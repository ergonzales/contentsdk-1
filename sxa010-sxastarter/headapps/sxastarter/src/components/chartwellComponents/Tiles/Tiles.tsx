import { Field, ImageField, LinkField, withDatasourceCheck, RichText as JssRichText } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { TileCard } from "./TileCard";
import { useState, JSX } from "react";
import { getGridCols } from "lib/helpers/layoutOption";
import { HeadingLevel } from "../ui/HeadingLevel/HeadingLevel";

type TileCardFields = {
  "Heading Level": Field<string>;
  Heading: Field<string>;
  Image: ImageField;
  Description?: Field<string>;
  "CTA Text"?: Field<string>;
  "CTA Link"?: LinkField;
};

type TileCardItem = {
  id?: string;
  name?: string;
  fields?: TileCardFields;
};

type TilesProps = ComponentProps & {
  fields: {
    Heading: Field<string>;
    "Heading Level": Field<string>;
    Description: Field<string>;
    Cards: TileCardItem[];
    ContainerNumberOfColoumns: Field<string>;
  };
};

const Tiles = (props: TilesProps): JSX.Element => {
  const [isOpenArray, setIsOpenArray] = useState(() => props?.fields?.Cards?.map(() => false) || []);

  const handleCardClick = (index: number, isOpen: boolean) => {
    setIsOpenArray((currentIsOpenArray) => {
      const newIsOpenArray = [...currentIsOpenArray];
      newIsOpenArray[index] = isOpen;
      return newIsOpenArray;
    });
  };
  const headingLevel = props?.fields && props?.fields["Heading Level"];
  const titleText = props?.fields?.Heading;
  const desc = props.fields?.Description;
  const Cards = props?.fields?.Cards;
  const numberOfColumn = props?.fields?.ContainerNumberOfColoumns?.value;
  const gridCols = getGridCols(numberOfColumn);

  return (
    <div className="ChartwellContainer ">
      <HeadingLevel headingLevel={headingLevel} titleText={titleText} styles={"text-center mb-4 md:mb-6"} />
      {desc && <JssRichText field={desc} tag="div" className="mt-4 ChartwellText text-center" />}
      <div className="flex items-center justify-center">
        <ul className={`sm:grid gap-4 sm:grid-cols-2 ${gridCols} p-4 bg-ChartwellGrey-10 mt-4  `}>
          {Cards &&
            Cards.map((cardItem, index) => {
              const card = cardItem?.fields;
              if (!card?.Heading || !card?.Image || !card["Heading Level"]) {
                return null;
              }

              const isOpen = isOpenArray[index];
              const headingLevel = card["Heading Level"];
              const titleText = card.Heading;
              const Image = card.Image;
              const desc = card?.Description;
              const CTAText = card && card["CTA Text"]?.value;
              const CTALink = card && card["CTA Link"]?.value?.href;
              return (
                <TileCard
                  CTALink={CTALink}
                  CTAText={CTAText}
                  handleCardClick={handleCardClick}
                  key={cardItem?.id || cardItem?.name || titleText?.value || index}
                  desc={desc}
                  index={index}
                  Image={Image}
                  isOpen={isOpen}
                  headingLevel={headingLevel}
                  titleText={titleText}
                />
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<TilesProps>(Tiles);
