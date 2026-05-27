export type Province = {
  id: string;
  value: string;
};

export type ProvinceQueryResult = {
  provinceList: Province[];
  endCursor: string;
  hasNext: boolean;
};
