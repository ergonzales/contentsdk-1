import { JSX } from "react";
import ResourceCategory from "./ResourceCategory";

const CategoryComponent = (props: any): JSX.Element => {
  return (
    <div className="category-component bg-transparent pb-8 w-full">
      <div className="mx-auto max-w-1800px px-6 text-center lg:px-8">
        <ul role="list" className="flex justify-center flex-wrap gap-x-8 gap-y-2 text-center mt-20 mx-auto">
          {Array.isArray(props.fields?.data?.ds?.categories?.targetItems) &&
            props.fields?.data?.ds?.categories?.targetItems?.map((resourceCategory: any, index: number) => (
              <li className="w-[200px]" key={index}>
                <ResourceCategory {...resourceCategory} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
export default CategoryComponent;
