import { Placeholder } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";

function FiftyFiftySplitter(props: ComponentProps) {
  return (
    <div className="flex flex-col sm:flex-row w-full max-w-screen-xl m-auto">
      <div className="w-full sm:w-1/2 bg-gray-100">
        <Placeholder rendering={props.rendering} name={"fifty-fifty-splitter-1"} />
      </div>
      <div className="w-full sm:w-1/2 bg-gray-200">
        <Placeholder rendering={props.rendering} name={"fifty-fifty-splitter-1"} />
      </div>
    </div>
  );
}

export default FiftyFiftySplitter;
