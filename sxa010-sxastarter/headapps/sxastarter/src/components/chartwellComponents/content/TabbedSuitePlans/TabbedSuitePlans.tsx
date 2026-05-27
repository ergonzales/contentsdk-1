import { JSX } from "react";
import { withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { TabbedSuiteSection } from "./TabbedSuiteParts/TabbedSuiteSection";

const TabbedSuitePlans = (props: any): JSX.Element => {
  return <TabbedSuiteSection props={props} />;
};

export default withDatasourceCheck()(TabbedSuitePlans);
