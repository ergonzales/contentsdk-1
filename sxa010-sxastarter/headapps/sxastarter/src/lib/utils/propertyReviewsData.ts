// Utility to robustly extract property reviews from deeply nested Sitecore data structure
// Accepts either an array or a single object (ancestors)
export function getPropertyReviewsData(ancestors: any): any {
  // Normalize input to array
  const normalizedAncestors = Array.isArray(ancestors) ? ancestors : [ancestors];
  if (!Array.isArray(normalizedAncestors) || normalizedAncestors.length === 0) return [];

  // Recursively search for the first reviews value in the nested structure
  function findReviews(node: any): any {
    if (!node || typeof node !== "object") return undefined;
    // Check if this node has reviews
    if (node?.reviews?.jsonValue?.value) return node.reviews.jsonValue.value;
    // If it has children, search recursively
    const children = Array.isArray(node?.children?.results) ? node.children.results : [];
    for (const child of children) {
      const found = findReviews(child);
      if (found) return found;
    }
    return undefined;
  }

  for (const ancestor of normalizedAncestors) {
    const found = findReviews(ancestor);
    if (found) return found;
  }
  // fallback to empty array if not found
  return [];
}
