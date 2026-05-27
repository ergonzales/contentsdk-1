import { ResidenceListModel } from "src/models/Residence";
import { modelData } from "../modelData/modelData";
import { filterResidencesByDistance } from "../../search-helpers";

export async function getRowsForPostalCode(searchTerm: string, maxDistance: number, context: any, router: any, provinceId?: string): Promise<ResidenceListModel[]> {
  // Early return for empty searchTerm
  if (!searchTerm) return [];

  // Get model data with potential filtering by provinceId
  const model = modelData(context, router);
  const filteredModel = provinceId ? model.filter((p: ResidenceListModel) => p.provinceId === provinceId) : model;

  // Avoid unnecessary operation if model is empty
  if (filteredModel.length === 0) return [];

  // Filter residences by distance
  return (await filterResidencesByDistance(filteredModel, searchTerm, maxDistance)) ?? [];
}
