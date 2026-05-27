import { JSX } from "react";
import { RichText } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { useRouter } from "next/router";
import Link from "next/link";
type ProvinceCardsProps = ComponentProps & {
  fields: {
    targetProvinces: any[];
  };
};

const ProvinceCards = (props: ProvinceCardsProps): JSX.Element => {
  const router = useRouter();
  return (
    <div className="flex w-full max-w-1800px mx-auto bg-transparent bg-white px-16 sm:px-28 mt-8 mb-40">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-28 gap-y-12">
        {props.fields.targetProvinces &&
          props.fields.targetProvinces.map((province, key) => {
            return (
              <div key={key} className="flex flex-col items-center  justify-between ">
                <RichText className=" text-center" tag="h2" field={province.fields?.["Province Name"]}></RichText>
                <div>
                  <RichText className="text-center  " field={province.fields?.["Body"]}></RichText>

                  <Link
                    locale={router.locale}
                    href={province.fields?.["SearchLink"].value.href}
                    aria-label={province.fields?.["SearchLink"].value.text + " " + province.fields?.["Province Name"].value}
                    title={province.fields?.["SearchLink"].value.text + " " + province.fields?.["Province Name"].value}
                    className="bg-white mt-4  outline-2 focus:bg-ChartwellPlum outline-ChartwellPlum outline hover:bg-ChartwellPlum inline-flex text-center no-underline text-ChartwellPlum focus:text-ChartwellWhite hover:text-ChartwellWhite items-center justify-center font-semibold text-lg uppercase w-full p-4 ease-in-out"
                  >
                    <span className="sr-only">{province.fields?.["SearchLink"].value.text + " " + province.fields?.["Province Name"].value}</span>
                    {province.fields?.["SearchLink"].value.text}
                  </Link>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default ProvinceCards;
