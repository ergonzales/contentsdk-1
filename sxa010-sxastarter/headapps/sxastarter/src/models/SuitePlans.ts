export interface SuitePlan {
  fields: any;
  careLevel?: {
    targetItem?: {
      field: {
        value: string;
      };
    };
  };
  children?: {
    results?: SuitePlan[];
  };
}

export interface GroupedSuitePlans {
  [careLevel: string]: SuitePlan[];
}
