import { getAllProvince } from "lib/database-operations/graphql/Province";
import { getAllResidence } from "lib/database-operations/graphql/Residence";
import { filterResidencesByDistance } from "lib/helpers/search-helpers";
import { normalizeString } from "lib/helpers/residence-helpers/normalizeString/normalizeString";
import { transformIdToDashWithCurlyBrackets } from "lib/helpers/utils/transform-id";
import { isThisPostalCode } from "lib/helpers/utils/postalcode-matcher";
import { Residence } from "src/models/Residence";

export const FIND_RESIDENCES_TOOL_NAME = "find_residences";

export const findResidencesToolDefinition = {
  type: "function",
  name: FIND_RESIDENCES_TOOL_NAME,
  strict: false,
  description: "Find Chartwell residences by Canadian postal code, city name, or residence name. Postal code lookups return nearby residences sorted by distance.",
  parameters: {
    type: "object",
    properties: {
      searchTerm: {
        type: "string",
        description: "The user's postal code, city name, or residence name query.",
      },
      maxDistanceKm: {
        type: "number",
        description: "Maximum distance in kilometers for postal code searches. Defaults to 25.",
      },
      limit: {
        type: "integer",
        description: "Maximum residences to return. Defaults to 20.",
        minimum: 1,
        maximum: 30,
      },
    },
    required: ["searchTerm"],
    additionalProperties: false,
  },
} as const;

type SearchIntent = "postal_code" | "city_or_residence_name";
type SearchType = "city" | "subCity" | "residence";
type SuggestionType = "city";

interface ResidenceSearchArgs {
  searchTerm?: string;
  maxDistanceKm?: number;
  limit?: number;
}

interface SearchableResidenceRow {
  id: string;
  propertyId: string;
  startingPrice?: number | null;
  residenceName: string;
  cityNameDisplay: string;
  subCityName: string;
  provinceName: string;
  residenceAddress: string;
  postalCode: string;
  cityLat: string;
  cityLng: string;
  Lat: string;
  Lng: string;
  url: string;
  contactNumber: string;
  livingOptions: string[];
  normalizedCityName: string;
  normalizedSubCityName: string;
  normalizedResidenceName: string;
  searchType?: SearchType;
  distance?: number;
}

interface ResidenceToolResult {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  startingPrice?: number | null;
  phone: string;
  url: string;
  livingOptions: string[];
  searchType?: SearchType;
  distanceKm?: number;
}

interface SearchSuggestion {
  searchTerm: string;
  type: SuggestionType;
}

export interface FindResidencesToolResponse {
  searchTerm: string;
  detectedInput: SearchIntent;
  maxDistanceKm: number | null;
  totalMatches: number;
  results: ResidenceToolResult[];
  message: string | null;
  suggestion: SearchSuggestion | null;
}

const RESIDENCE_CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes

interface ResidenceCacheEntry {
  expiresAt: number;
  rows: SearchableResidenceRow[];
  cityCandidates: Map<string, string>;
}

const residenceRowsCache = new Map<string, ResidenceCacheEntry>();

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function parseNumber(value: unknown, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseToolArguments(argumentsJson: string | undefined): ResidenceSearchArgs {
  if (!argumentsJson || argumentsJson.trim() === "") {
    return {};
  }

  try {
    const parsed = JSON.parse(argumentsJson) as ResidenceSearchArgs;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function isPostalCodeSearch(searchTerm: string): boolean {
  const trimmed = searchTerm.trim().toUpperCase();
  const compact = trimmed.replace(/\s+/g, "");
  return isThisPostalCode(trimmed) || /^[A-Z]\d[A-Z]$/.test(compact);
}

function buildResidenceAddress(residence: Residence): string {
  const city = residence.city?.name ?? "";
  const provinceAndPostal = [residence.province ?? "", residence.postalCode ?? ""].filter(Boolean).join(" ");
  return [residence.streetNameAndNumber ?? "", city, provinceAndPostal].filter(Boolean).join(", ");
}

function getLivingOptions(residence: Residence): string[] {
  const source = [residence.careServicesAvailable ?? "", residence.propertyCareServices ?? ""].filter(Boolean).join("|");

  return Array.from(
    new Set(
      source
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  );
}

function mapResidenceToSearchRow(residence: Residence): SearchableResidenceRow {
  const cityNameDisplay = residence.city?.name ?? "";
  const subCityName = "";
  const residenceName = residence.title || residence.name || "";
  return {
    id: residence.id,
    propertyId: String(residence.propertyID ?? residence.id),
    residenceName,
    cityNameDisplay,
    subCityName,
    startingPrice: residence.startingPrice ?? null,
    provinceName: residence.province ?? "",
    residenceAddress: buildResidenceAddress(residence),
    postalCode: residence.postalCode ?? "",
    cityLat: String(residence.city?.latitude ?? ""),
    cityLng: String(residence.city?.longitude ?? ""),
    Lat: String(residence.latitude ?? ""),
    Lng: String(residence.longitude ?? ""),
    url: residence.url ?? "",
    contactNumber: residence.phone ?? "",
    livingOptions: getLivingOptions(residence),
    normalizedCityName: normalizeString(cityNameDisplay),
    normalizedSubCityName: normalizeString(subCityName),
    normalizedResidenceName: normalizeString(residenceName),
  };
}

function selectLanguageResidenceEntries(residences: Residence[], language: "en" | "fr"): Residence[] {
  const grouped = new Map<string, Residence[]>();

  for (const residence of residences) {
    const key = String(residence.propertyID ?? residence.id);
    const current = grouped.get(key) ?? [];
    current.push(residence);
    grouped.set(key, current);
  }

  const selected: Residence[] = [];

  for (const groupedResidences of grouped.values()) {
    const preferred =
      groupedResidences.find((item) => item.language === language) ??
      groupedResidences.find((item) => item.language === "en") ??
      groupedResidences.find((item) => item.language === "fr") ??
      groupedResidences[0];

    if (preferred) {
      selected.push(preferred);
    }
  }

  return selected;
}

async function loadAllResidenceRows(language: "en" | "fr"): Promise<ResidenceCacheEntry> {
  const cacheKey = language;
  const cache = residenceRowsCache.get(cacheKey);

  if (cache && cache.expiresAt > Date.now()) {
    return cache;
  }

  const provinceList = (await getAllProvince(language)).filter((province): province is { id: string; value: string } => Boolean(province?.id));

  const provinceIds = Array.from(new Set(provinceList.map((province) => transformIdToDashWithCurlyBrackets(province.id)).filter((provinceId) => Boolean(provinceId))));

  const residencesByProvince = await Promise.all(
    provinceIds.map(async (provinceId) => {
      try {
        return await getAllResidence(provinceId, language);
      } catch (error) {
        console.error(`Failed to load residences for province ${provinceId}:`, error);
        return [];
      }
    })
  );

  const allResidences = residencesByProvince.flat().filter((residence): residence is Residence => Boolean(residence?.id));
  const selectedResidences = selectLanguageResidenceEntries(allResidences, language);
  const rows = selectedResidences.map((residence) => mapResidenceToSearchRow(residence)).filter((row) => Boolean(row.residenceName) && Boolean(row.cityNameDisplay));

  const cityCandidates = new Map<string, string>();
  for (const row of rows) {
    if (row.normalizedCityName && !cityCandidates.has(row.normalizedCityName)) {
      cityCandidates.set(row.normalizedCityName, row.cityNameDisplay);
    }
  }

  const entry: ResidenceCacheEntry = { rows, cityCandidates, expiresAt: Date.now() + RESIDENCE_CACHE_TTL_MS };
  residenceRowsCache.set(cacheKey, entry);

  return entry;
}

function findRowsByCityOrResidenceName(rows: SearchableResidenceRow[], searchTerm: string): SearchableResidenceRow[] {
  const q = normalizeString(searchTerm);

  if (!q) {
    return [];
  }

  const byCity: SearchableResidenceRow[] = [];
  const bySubCity: SearchableResidenceRow[] = [];
  const byResidenceName: SearchableResidenceRow[] = [];

  for (const row of rows) {
    if (row.normalizedCityName.startsWith(q)) {
      byCity.push({ ...row, searchType: "city" });
    }
    if (row.normalizedSubCityName.startsWith(q)) {
      bySubCity.push({ ...row, searchType: "subCity" });
    }
    if (row.normalizedResidenceName.includes(q)) {
      byResidenceName.push({ ...row, searchType: "residence" });
    }
  }

  return [...byCity, ...bySubCity, ...byResidenceName];
}

function levenshteinDistance(a: string, b: string): number {
  if (a === b) {
    return 0;
  }

  if (!a.length) {
    return b.length;
  }

  if (!b.length) {
    return a.length;
  }

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  let current = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    current[0] = i;

    for (let j = 1; j <= b.length; j++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + substitutionCost);
    }

    const swap = previous;
    previous = current;
    current = swap;
  }

  return previous[b.length];
}

function getMaxSuggestionDistance(normalizedQueryLength: number): number {
  if (normalizedQueryLength <= 4) {
    return 1;
  }

  if (normalizedQueryLength <= 8) {
    return 2;
  }

  return 3;
}

function findCitySuggestion(cityCandidates: Map<string, string>, searchTerm: string): SearchSuggestion | null {
  const normalizedQuery = normalizeString(searchTerm);

  if (!normalizedQuery || normalizedQuery.length < 3) {
    return null;
  }

  const maxDistance = getMaxSuggestionDistance(normalizedQuery.length);

  let bestCandidate: { cityName: string; distance: number; normalizedDistance: number } | null = null;

  for (const [normalizedCityName, cityName] of cityCandidates.entries()) {
    if (normalizedCityName === normalizedQuery) {
      return null;
    }

    if (normalizedCityName[0] !== normalizedQuery[0]) {
      continue;
    }

    const distance = levenshteinDistance(normalizedQuery, normalizedCityName);
    const normalizedDistance = distance / Math.max(normalizedQuery.length, normalizedCityName.length);

    if (distance > maxDistance || normalizedDistance > 0.34) {
      continue;
    }

    if (!bestCandidate || distance < bestCandidate.distance || (distance === bestCandidate.distance && normalizedDistance < bestCandidate.normalizedDistance)) {
      bestCandidate = {
        cityName,
        distance,
        normalizedDistance,
      };
    }
  }

  if (!bestCandidate) {
    return null;
  }

  return {
    searchTerm: bestCandidate.cityName,
    type: "city",
  };
}

function dedupeByPropertyId(rows: SearchableResidenceRow[]): SearchableResidenceRow[] {
  const seen = new Set<string>();
  const deduped: SearchableResidenceRow[] = [];

  for (const row of rows) {
    const key = row.propertyId || row.id;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(row);
  }

  return deduped;
}

function mapToolResult(row: SearchableResidenceRow): ResidenceToolResult {
  return {
    id: row.id,
    name: row.residenceName,
    address: row.residenceAddress,
    city: row.cityNameDisplay,
    province: row.provinceName,
    postalCode: row.postalCode,
    phone: row.contactNumber,
    startingPrice: row.startingPrice ?? null,
    url: row.url,
    livingOptions: row.livingOptions,
    searchType: row.searchType,
    distanceKm: typeof row.distance === "number" ? Math.round(row.distance * 10) / 10 : undefined,
  };
}

function buildResponse(searchTerm: string, detectedInput: SearchIntent, maxDistanceKm: number | null, rows: SearchableResidenceRow[], limit: number): FindResidencesToolResponse {
  const dedupedRows = dedupeByPropertyId(rows);
  const results = dedupedRows.slice(0, limit).map((row) => mapToolResult(row));

  return {
    searchTerm,
    detectedInput,
    maxDistanceKm,
    totalMatches: dedupedRows.length,
    results,
    message: results.length > 0 ? null : detectedInput === "postal_code" ? "No residences found within the selected distance." : "No residences found for the provided city or residence name.",
    suggestion: null,
  };
}

export async function executeFindResidencesTool(argumentsJson: string | undefined, language: "en" | "fr"): Promise<FindResidencesToolResponse> {
  const args = parseToolArguments(argumentsJson);
  const searchTerm = String(args.searchTerm ?? "").trim();

  if (!searchTerm) {
    return {
      searchTerm: "",
      detectedInput: "city_or_residence_name",
      maxDistanceKm: null,
      totalMatches: 0,
      results: [],
      message: "A postal code, city name, or residence name is required.",
      suggestion: null,
    };
  }

  const limit = clamp(Math.round(parseNumber(args.limit, 20)), 1, 30);

  try {
    const { rows, cityCandidates } = await loadAllResidenceRows(language);

    if (isPostalCodeSearch(searchTerm)) {
      const maxDistanceKm = clamp(parseNumber(args.maxDistanceKm, 25), 1, 500);
      const byDistance = await filterResidencesByDistance(rows, searchTerm, maxDistanceKm);
      const postalRows = Array.isArray(byDistance) ? (byDistance as SearchableResidenceRow[]) : [];
      return buildResponse(searchTerm, "postal_code", maxDistanceKm, postalRows, limit);
    }

    const cityAndResidenceRows = findRowsByCityOrResidenceName(rows, searchTerm);
    const response = buildResponse(searchTerm, "city_or_residence_name", null, cityAndResidenceRows, limit);

    if (!response.totalMatches) {
      response.suggestion = findCitySuggestion(cityCandidates, searchTerm);
    }

    return response;
  } catch (error) {
    console.error("find_residences tool execution failed:", error);
    return {
      searchTerm,
      detectedInput: "city_or_residence_name",
      maxDistanceKm: null,
      totalMatches: 0,
      results: [],
      message: "Unable to retrieve residences right now.",
      suggestion: null,
    };
  }
}
