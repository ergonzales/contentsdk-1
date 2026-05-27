import { JSX } from "react";
import { useRouter } from "next/router";
import { NextImage } from "@sitecore-content-sdk/nextjs";
import Link from "next/link";

const FeaturedResourceCard = (props: any): JSX.Element => {
  const router = useRouter();
  // const lngLink = router.locale == "fr" ? "/fr" : "";

  const href = `${
    props.linkToResource?.targetItem?.url?.path && props.linkToResource?.targetItem?.url?.path != ""
      ? props.linkToResource?.targetItem?.url?.path
      : props.mediaForResource?.src
      ? props.mediaForResource.src
      : "#"
  }`;

  return (
    <Link
      className="no-underline flex w-full justify-center  relative isolate overflow-hidden h-full bg-white py-4 sm:py-16 lg:w-full hover:transform hover:scale-105 transition duration-300 shadow  "
      href={href}
      locale={router.locale}
    >
      {props?.subtitle && <span className="absolute top-1 right-[50%] translate-x-[50%] !text-sm  text-center uppercase m-0 !text-ChartwellGrey leading-normal">{props?.subtitle?.value}</span>}
      <NextImage field={props.backgroundImage?.jsonValue} className="absolute   inset-0  -z-10 h-full w-full p-6  object-cover  object-center" />
      <div className="flex flex-col-reverse  justify-between w-full p-6 xs:p-2 relative z-10 max-w-3xl  ">
        <h2 className="text-ChartwellWhite bg-ChartwellPlum/90 font-semibold normal-case text-xl xs:text-3xl xs:px-10 p-4  ">{props.title.value}</h2>
      </div>
    </Link>
  );
};

export default FeaturedResourceCard;
