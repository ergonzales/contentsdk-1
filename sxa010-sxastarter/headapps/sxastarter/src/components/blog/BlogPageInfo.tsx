import { JSX } from "react";
import { withDatasourceCheck } from "@sitecore-content-sdk/nextjs";

const BlogPageInfo = (): JSX.Element => {
  return <div>{"Blog Page Info goes here.."}</div>;
};
export default withDatasourceCheck()(BlogPageInfo);
