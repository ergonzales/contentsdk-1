import React, { useMemo } from "react";

type Feature = {
  id: string | number;
  fields?: {
    [key: string]: {
      value?: string;
    };
  };
};

interface ListOfFeatureProps {
  featureList: Feature[];
  title: string;
  itemStyles?: string;
  listStyle?: string;
}

export const ListOfFeature: React.FC<ListOfFeatureProps> = ({ featureList, title, itemStyles = "list-disc mx-4", listStyle = "grid grid-cols-2 gap-4" }) => {
  const [leftColumn, rightColumn] = useMemo(() => {
    if (!Array.isArray(featureList)) return [[], []];
    const midIndex = Math.ceil(featureList.length / 2);
    return [featureList.slice(0, midIndex), featureList.slice(midIndex)];
  }, [featureList]);

  if (!Array.isArray(featureList) || featureList.length === 0) return null;

  const renderColumn = (column: Feature[]) => (
    <ol className="list-none space-y-2">
      {column.map((feature) => (
        <li key={feature.id} className={itemStyles}>
          <p className="!m-0">{feature.fields?.["Key Feature Name"]?.value ?? ""}</p>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <p className="text-ChartwellGrey font-semibold m-0 p-0">{title}</p>
      <div className={listStyle}>
        {renderColumn(leftColumn)}
        {renderColumn(rightColumn)}
      </div>
    </>
  );
};
