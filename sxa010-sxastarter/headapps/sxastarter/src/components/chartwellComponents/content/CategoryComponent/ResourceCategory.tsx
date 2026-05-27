import { JSX } from "react";
import { Text as JssText, NextImage } from "@sitecore-content-sdk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

const ResourceCategory = (props: any): JSX.Element => {
  const [imageFile, setImageFile] = useState(props?.categoryImage?.jsonValue);
  const [textColor, setTextColor] = useState("text-ChartwellPlum");
  const [isActive, setIsActive] = useState<boolean>(false);
  const router = useRouter();

  const checkCategoryId = useCallback(() => {
    try {
      if (router.asPath.split("?")[0] === props.categoryUrl?.url) {
        setImageFile(props.categoryHoverImage?.jsonValue);
        setTextColor("text-ChartwellBlue");
        setIsActive(true);
      }
    } catch (e) {
      console.error("Error checking category ID:", e);
    }
  }, [router.asPath, props.categoryUrl, props.categoryHoverImage?.jsonValue]);

  useEffect(() => {
    checkCategoryId();
  }, [checkCategoryId]);

  const handleMouseEnter = () => {
    setImageFile(props.categoryHoverImage?.jsonValue);
    setTextColor("text-ChartwellBlue");
  };

  const handleMouseLeave = () => {
    if (!isActive) {
      setImageFile(props?.categoryImage?.jsonValue);
      setTextColor("text-ChartwellPlum");
    }
  };

  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Link href={props.categoryUrl?.url || ""} locale={router.locale} scroll={false} className="text-center no-underline">
          <NextImage field={imageFile} className="block xs:w-24 xs:h-24 w-16 h-16 mx-auto" />
          <JssText field={props.categoryName} tag="h2" className={`mx-auto py-3 px-3 lg:px-2 font-semibold field-title text-lg normal-case no-underline ${textColor}`} />
        </Link>
      </div>
    </>
  );
};
export default ResourceCategory;
