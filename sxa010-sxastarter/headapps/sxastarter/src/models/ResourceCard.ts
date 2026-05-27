export type ResourceQueryList = {
  resourceList: Resource[];
  endCursor: string;
  hasNext: boolean;
};

export type Resource = {
  id: string;
  name: string;
  path: string;
  url: {
    path: string;
    hostName: string;
    scheme: string;
    siteName: string;
    url: string;
  };
  body: {
    value: string;
  };
  title: {
    value: string;
  };
  subtitle: {
    value: string;
  };
  linkToResource: {
    jsonValue: any;
    id: string;
    url: string;
    text: string;
  };
  mediaForResource: {
    src: string;
  };
  backgroundImage: {
    assets: any[];
    file: any;
    jsonValue: {
      value: {
        src: string;
        alt: string;
      };
    };
  };
  isFeatured: {
    value: string;
  };
  category: {
    targetItems: {
      id: string;
      name: string;
      path: string;
    }[];
  };
  personalizationCategory: {
    targetItems: {
      id: string;
      name: string;
      path: string;
    }[];
  };
  resourceCardCategory: {
    targetItems: {
      field: {
        value: string;
      };
    }[];
  };
};

export interface ContextFields {
  id?: string;
  [key: string]: any; // Add other fields as necessary
}

export interface Resources {
  category: any;
  resourceCard: any;
  resourceCardId: string;
  id: string;
  resourceCategory?: {
    targetItems: { id: string }[];
  };
  personalizationCategory?: { displayName: string }[];

  createAt?: string;

  featured?: {
    boolValue: boolean;
  };
}
