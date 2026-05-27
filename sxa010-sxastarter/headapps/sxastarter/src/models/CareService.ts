export type CareServiceQueryResult = {
  careServiceList: CareService[];
  endCursor: string;
  hasNext: boolean;
};

export type CareService = {
  id: string;
  name: string;
  label: string;
  value: string;
  description: string;
  legacyId: string;
};
