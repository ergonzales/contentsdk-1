import { ChatBotData } from "components/chatOpenAi/chat-types";

import {
  propertyRolePrompt,
  propertyOfficialLinksPrompt,
  propertyAbsoluteRulesPrompt,
  propertyLanguageRulesPrompt,
  propertyInformationPrompt,
  propertyLivingOptionsPrompt,
  propertyPricingPrompt,
  propertyEventsPrompt,
  propertyPoliciesPrompt,
  propertyGoalsPrompt,
  propertyAnswerTypesPrompt,
  propertyRoutingOrderPrompt,
  propertyForbiddenWordingPrompt,
  propertyFollowUpRulesPrompt,
  propertyCodeDetectedPrompt,
  propertyContextPrompt,
  propertyPhoneHoursPrompt,
  propertyBookATourPrompt,
} from "./propertyPromptParts";

import {
  corporateRolePrompt,
  corporateContextPrompt,
  corporateTaskPrompt,
  corporateRulesHeaderPrompt,
  corporateGoalsPrompt,
  corporateLanguageRulesPrompt,
  corporateAbsoluteRulesPrompt,
  corporatePhoneHoursPrompt,
  corporateBookATourPrompt,
  corporateCodeDetectedPrompt,
  corporateAnswerTypesPrompt,
  corporateDataContextFirstPrompt,
  corporateRoutingOrderPrompt,
  corporateFollowUpRulesPrompt,
  corporateOutputFormatPrompt,
  FindAResidencePrompt,
} from "./corporatePromptParts";
function stripHtmlTags(text: string): string {
  return text.replace(/<\/?[^>]+(>|$)/g, "");
}

const corporatePrompt = (documents: string) => {
  const safeDataPrompt = stripHtmlTags(documents ?? "")
    .replace(/\n+/g, "\n")
    .trim();

  const promptText = [
    corporateRolePrompt,
    corporateContextPrompt(safeDataPrompt),
    corporateTaskPrompt,
    corporateRulesHeaderPrompt,
    corporateGoalsPrompt,
    corporateLanguageRulesPrompt,
    corporatePhoneHoursPrompt,
    corporateBookATourPrompt,
    corporateAbsoluteRulesPrompt,
    corporateCodeDetectedPrompt,
    // corporateSelfReflectionPrompt,
    corporateAnswerTypesPrompt,
    corporateDataContextFirstPrompt,
    corporateRoutingOrderPrompt,
    corporateFollowUpRulesPrompt,
    FindAResidencePrompt,
    corporateOutputFormatPrompt,
  ]
    .join("\n\n")
    .trim();

  return promptText;
};

const propertyPrompt = (data: ChatBotData, documents: string) => {
  const safeDataPrompt = stripHtmlTags(documents ?? "")
    .replace(/\n+/g, "\n")
    .trim();

  return [
    propertyRolePrompt(data.propertyName),
    propertyOfficialLinksPrompt,
    propertyAbsoluteRulesPrompt,
    propertyLanguageRulesPrompt,
    propertyInformationPrompt(data),
    propertyPhoneHoursPrompt,
    propertyLivingOptionsPrompt(data),
    propertyPricingPrompt(data),
    propertyEventsPrompt(data),
    propertyPoliciesPrompt,
    propertyGoalsPrompt,
    propertyBookATourPrompt,
    propertyAnswerTypesPrompt(data.propertyName),
    propertyRoutingOrderPrompt,
    propertyForbiddenWordingPrompt,
    propertyFollowUpRulesPrompt,
    propertyCodeDetectedPrompt,
    propertyContextPrompt(safeDataPrompt),
  ].join("\n\n");
};

export const prompt = (data: ChatBotData, documents: string) => {
  return data.isCorporate ? corporatePrompt(documents) : propertyPrompt(data, documents);
};
