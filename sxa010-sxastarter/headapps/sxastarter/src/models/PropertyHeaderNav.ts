export interface PropertyHeaderProps {
  propertyName: string | "";
  propertyId: string | "";
  homePageLink: string | "";
  propertyLogo: any | "";
  propertyOverviewLink: string | "";
  propertyLivingOptions: any | "";
  propertyBookaTour: any | "";
  propertyContactNumber: string | "";
  propertySubNavItems: any | "";
  bilingual: boolean | false;
  // propertyAddress: string | "";
  residence: any | "";
}

export interface CorpNavItem {
  name: string;
  templateName: {
    name: string;
  };
  jsonValue: {
    fields: Record<string, unknown>;
  };
}

export interface NavigationItem {
  id: string;
  url: string;
  fields: { NavigationTitle: { value: string } };
}
