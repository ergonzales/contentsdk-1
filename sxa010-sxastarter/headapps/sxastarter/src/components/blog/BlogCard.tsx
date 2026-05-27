import { useRouter } from "next/router";
import { NextImage, ImageField } from "@sitecore-content-sdk/nextjs";
import { NextImageBkg } from "components/chartwellComponents/ui/BackgroundImage/BackgroundImage";
// import { Quote } from "lucide-react";
import Link from "next/link";

const cardCategoryClasses = "text-sm xs:text-lg justify-center uppercase text-center font-small whitespace-nowrap";

export const BlogCard = (props: {
  cardId: string;
  cardType: string;
  cardURL: string;
  cardImageSrc: string;
  cardDescription: string;
  cardCategory: string;
  cardTitle: string;
  imageField: ImageField;
  label: string;
}) => {
  const { cardId, cardType, cardURL, cardImageSrc, cardDescription, cardCategory, cardTitle, imageField, label } = props;
  const router = useRouter();

  // Determine image dimensions
  const imgField = imageField?.value;
  const imgHeight = Number(imgField?.height);
  const imgWidth = Number(imgField?.width);
  const useDefaultDims = !imgHeight && !imgWidth;
  const height = useDefaultDims ? 480 : imgHeight || 480;
  const width = useDefaultDims ? 640 : imgWidth || 640;

  if (cardType === "card-1") {
    return (
      <li key={cardId} className="">
        <Link href={cardURL} locale={router.locale} className="no-underline text-center">
          <div className="relative  w-full flex flex-col xs:min-h-[640px] xs:h-[640px] justify-between bg-ChartwellPlum divide-gray-200 hover:transform hover:scale-105 transition duration-300 shadow">
            <div className="relative flex flex-1 flex-col">
              <div className="relative xs:mb-4 mb-0 ">
                <NextImage field={imageField} height={height} width={width} />
                <div className="p-4 pb-0">
                  <h2 className="xs:py-3 text-2xl font-semibold text-center text-ChartwellWhite align-top">{cardTitle}</h2>
                  <div
                    className="mx-auto text-sm xs:text-lg text-ChartwellWhite mt-3 max-w-7xl field-body text-ellipsis overflow-hidden ..."
                    dangerouslySetInnerHTML={{ __html: `<p class='m-0 p-0 cw-line-clamp-5'>${cardDescription}</p>` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap w-full px-8">
              <div className="border-t w-full border-1 border-ChartwellWhite py-3">
                <div className={`${label ? " flex justify-between items-center" : ""} `}>
                  <span className={`${cardCategoryClasses} text-ChartwellWhite !m-0 leading-normal  `}>{cardCategory}</span>
                  {label && <span className="font-semibold text-ChartwellPlum uppercase m-0 p-2 ml-2 bg-ChartwellWhite leading-normal">{label}</span>}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </li>
    );
  }

  if (cardType === "card-2") {
    return (
      <li key={cardId}>
        <Link href={cardURL} locale={router.locale} className="no-underline text-center">
          <div className="relative w-full flex flex-col xs:min-h-[640px] xs:h-[640px] justify-between bg-white divide-gray-200 hover:transform hover:scale-105 transition duration-300 shadow">
            <div className="relative flex flex-1 flex-col p-6">
              <div className="relative xs:mb-4 mb-2">
                <NextImage field={imageField} height={height} width={width} />
                <div className="absolute bg-ChartwellPlum/95 -bottom-12 xs:-bottom-16 xs:inset-x-5 inset-x-2 mx-auto max-w-400px bg-opacity-50 text-white py-2 px-2 xs:px-6 ov flex justify-center items-center">
                  <h2 className="xs:py-3 text-2xl font-semibold text-center text-white align-top">{cardTitle}</h2>
                </div>
              </div>
              <div className="mt-6 flex flex-col justify-center">
                <div
                  className="mx-auto text-sm xs:text-lg text-ChartwellGrey mt-6 pt-6 max-w-7xl field-body text-ellipsis overflow-hidden ..."
                  dangerouslySetInnerHTML={{ __html: `<p class='m-0 p-0 cw-line-clamp-6'>${cardDescription}</p>` }}
                />
              </div>
            </div>
            <div className="flex flex-wrap w-full px-8">
              <div className="border-t w-full border-1 border-ChartwellPlum py-3">
                <div className={`${label ? "flex justify-between items-center" : ""} `}>
                  <span className={`${cardCategoryClasses} text-ChartwellPlum !m-0 leading-normal`}>{cardCategory}</span>
                  {label && <span className="font-semibold text-ChartwellGrey uppercase m-0 px-2 bg-ChartwellGrey/5 leading-normal">{label}</span>}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </li>
    );
  }

  // card-3 or default
  return (
    <li
      key={cardId}
      className="card-3 relative bg-cover bg-center bg-no-repeat hover:scale-105 hover:shadow-card ease-in-out w-full flex flex-col xs:min-h-[640px] xs:h-[640px] justify-between bg-white divide-gray-200 hover:transform transition duration-300 shadow"
    >
      <NextImageBkg field={cardImageSrc} bgPosition="" priority={false} />
      <Link href={cardURL} locale={router.locale} className="no-underline z-10 text-ChartwellGrey hover:text-ChartwellGrey flex flex-col justify-between items-center text-center">
        <div className="p-8 h-full ">
          <div className="bg-ChartwellWhite-200 px-8 pt-12 pb-0 xs:min-h-[575px] xs:h-[575px] flex justify-between flex-col relative">
            <div>
              <h2 className="xs:py-3 text-2xl font-semibold text-center">{cardTitle}</h2>
            </div>
            <div className="line-clamp-[8]" dangerouslySetInnerHTML={{ __html: `<p class='m-0 p-0 cw-line-clamp-7'>${cardDescription}</p>` }} />

            <div className={` border-t border-ChartwellPlum  ${label ? "flex items-center justify-between" : ""}`}>
              <span className="uppercase block text-ChartwellPlum m-0 py-4 leading-normal">{cardCategory}</span>
              {label && <span className="font-semibold text-ChartwellGrey uppercase m-0 px-2 bg-ChartwellGrey/5 leading-normal">{label}</span>}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};
