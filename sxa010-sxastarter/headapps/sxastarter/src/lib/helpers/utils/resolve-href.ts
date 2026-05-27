export const resolveHref = (value: unknown): string => {
  if (!value) return "";
  if (typeof value === "string") return value.trim();

  const hrefCandidate = value as {
    href?: unknown;
    path?: unknown;
    url?: unknown;
    value?: { href?: unknown; path?: unknown };
  };

  const nestedUrl = hrefCandidate?.url as { href?: unknown; path?: unknown } | undefined;
  const candidates = [hrefCandidate?.href, hrefCandidate?.path, nestedUrl?.path, nestedUrl?.href, hrefCandidate?.value?.href, hrefCandidate?.value?.path];
  const firstString = candidates.find((candidate) => typeof candidate === "string" && candidate.trim().length > 0);

  return firstString ? String(firstString).trim() : "";
};