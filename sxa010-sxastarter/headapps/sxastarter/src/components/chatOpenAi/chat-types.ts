export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  isDisclaimerInjected?: boolean;
  customId?: string;
}

export interface SelectedFormTypes {
  name: string;
  id: string;
  fields: {
    "Form type": { name: string; fields: { EloquaFormName: { value: string } } }[];
    Inputs: {
      id: string;
      fields: {
        fieldName: { value: string };
        fieldType: { value: string };
        label: { value: string };
        options: { targetItems: any[] };
        placeholder: { value: string };
      };
    }[];
  };
}

interface QuestionItem {
  fields: { Question: { value: string } };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** One suite/plan line for pricing */
export interface SuitePlanSummary {
  name: string;
  typeOfBedroom: string;
  priceRegular: string;
  pricePromo?: string;
  keyFeature: string[];
  optionFeature: string[];
}

export interface ChatBotData {
  // Residence-only (optional)
  address?: string;
  livingOptions?: string[];
  propertyName?: string;
  // propertyContactNumber?: string;
  ResidenceID?: string;
  price?: SuitePlanSummary[];
  customId: string;
  residenceUpComingEvents?: string | undefined;
  popupMessage: string;
  // Shared
  isCorporate: boolean;
  Questions: QuestionItem[];
  Forms: SelectedFormTypes[];
  corporateId?: string;
  // faq: FaqItem[];
  // prompt: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  content?: string;
}

export interface TourBookingData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  property: string;
  message?: string;
}
