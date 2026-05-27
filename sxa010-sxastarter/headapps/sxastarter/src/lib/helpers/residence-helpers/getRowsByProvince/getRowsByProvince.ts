import { getUniqueCities } from "../getUniqueCities/getUniqueCities";
import { modelData } from "../modelData/modelData";
import { normalizeString } from "../normalizeString/normalizeString";

export function getRowsByProvince(searchTerm: string, context: any, router: any, provinceId: any): any[] {
  // Pre-calculate the normalized search term to avoid recalculating it for each item
  const normalizedSearchTerm = normalizeString(searchTerm);

  // Combine filtering into a single operation to reduce iterations over the dataset
  const model =
    modelData(context, router)?.filter(
      (residence: any) =>
        residence.provinceId === provinceId &&
        (!searchTerm || // If no search term is provided, this part always evaluates to true
          normalizeString(residence.residenceName).includes(normalizedSearchTerm) ||
          normalizeString(residence.cityNameDisplay).startsWith(normalizedSearchTerm) ||
          normalizeString(residence.postalCode).startsWith(normalizedSearchTerm))
    ) || [];

  // Calculate unique cities only if model has items
  const uniqueCities = model.length > 0 ? getUniqueCities(Object.values(model), router) : [];

  return uniqueCities;
}
