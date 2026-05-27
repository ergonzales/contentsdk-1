import { JSX } from "react";
import { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Field, LinkField } from "@sitecore-content-sdk/nextjs";
import { translateProvinceName } from "lib/helpers/search-helpers";
import { useRouter } from "next/router";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

type ProvinceBreadcrumb = {
  homepageLink: LinkField;
  dropdownText: Field<string>;
  provinceNamesList: string[];
  onChange: (newProvinceName: string) => any;
};

const ProvinceBreadcrumb = (props: ProvinceBreadcrumb): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [currentProvince, setCurrentProvince] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getCurrentProvince = async () => {
      const url = new URL(window.location.href);
      if (!ignore) {
        setCurrentProvince(translateProvinceName(url.searchParams.get("province") || "en", router.locale || "en"));
      }
    };
    let ignore = false;
    getCurrentProvince();
    return () => {
      ignore = true;
    };
  });

  return (
    <div className="px-8 pt-10 pb-4">
      <div className="flex justify-start items-center gap-3">
        <a className="text-ChartwellPlum hover:text-ChartwellBlue-100" href={sitecoreContext.language === "fr" ? "/fr" : props.homepageLink?.value?.href}>
          {props.homepageLink?.value?.text}
        </a>
        <ArrowForwardIosIcon style={{ fontSize: "16px", color: "rgba(84,79,84,0.4)" }} />
        <div className="cursor-pointer capitalize text-ChartwellGrey" onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
          {currentProvince || props.dropdownText?.value || "Choose Province"}
          {isDropdownVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </div>
      </div>

      {/* Dropdown */}
      <div className="relative bg-white">
        {isDropdownVisible ? (
          <div className="absolute z-10 bg-white top-0 left-0 shadow-[0_6px_12px_-2px_rgba(50, 50, 93, 0.25)] shadow-[0_3px_7px_-3px_rgba(0,0,0,0.7)] inline-flex flex-col py-2">
            {props.provinceNamesList
              .filter((provName) => provName.toLowerCase() !== currentProvince?.toLowerCase())
              .map((provinceName, provinceNameIndex: number) => {
                return (
                  <div
                    className="min-w-[200px] bg-white hover:bg-ChartwellPlum/25 cursor-pointer px-6 py-1 text-ChartwellGrey hover:text-ChartwellPlum"
                    onClick={() => {
                      setIsDropdownVisible(false);
                      props.onChange(provinceName);
                    }}
                    key={provinceNameIndex}
                  >
                    {translateProvinceName(provinceName.toLowerCase(), sitecoreContext.language || "en")}
                  </div>
                );
              })}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ProvinceBreadcrumb;
