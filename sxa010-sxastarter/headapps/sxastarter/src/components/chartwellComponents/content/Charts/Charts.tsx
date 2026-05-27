import { JSX } from "react";
import { TextField, Field, withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";

import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";

import { ChartItem } from "./ChartItem";
import { getGridCols } from "lib/helpers/layoutOption";

type ChartsProps = ComponentProps & {
  fields: {
    Chart: any;
    Heading: Field<string>;
    "Heading Level": Field<string>;
    Description: TextField;
    ContainerNumberOfColoumns: Field<string>;
  };
};

const Charts = (props: ChartsProps): JSX.Element => {
  const Text = props?.fields?.Description?.value;
  const ChartsArray = props?.fields?.Chart;
  const numberOfColumn = props?.fields?.ContainerNumberOfColoumns?.value;
  const colorizer = [
    {
      bg: "bg-ChartwellPlum-40",
      text: "!text-ChartwellPlum",
      rgb: "rgb(140, 19, 96)",
    },
    {
      bg: "bg-ChartwellPurple-40",
      text: "!text-ChartwellPurple",
      rgb: "rgb(96, 38, 158)",
    },
    {
      bg: "bg-ChartwellBlue-40",
      text: "!text-ChartwellBlue",
      rgb: "rgb(0, 91 , 150 )",
    },
  ];
  const gridCols = getGridCols(numberOfColumn);
  return (
    <>
      <div className="ChartwellContainer SectionPadding ">
        <HeadingLevel headingLevel={props?.fields && props?.fields["Heading Level"]} titleText={props?.fields?.Heading} styles={" text-center mb-4 md:mb-6"} />
        {Text && <div className="m-0 mt-2 ChartwellText text-center  md:mb-6" dangerouslySetInnerHTML={{ __html: `${Text}` }}></div>}
        <div className={`sm:grid-cols-2 md:grid-cols-3 ${gridCols} grid gap-4 xl:gap-16 mt-6`}>
          {ChartsArray?.map((el: any, index: number) => {
            const colorIndex = index % colorizer.length;
            return <ChartItem key={index} chartData={el} colorizer={colorizer} colorIndex={colorIndex} />;
          })}
        </div>
      </div>
    </>
  );
};

export default withDatasourceCheck()<ChartsProps>(Charts);
