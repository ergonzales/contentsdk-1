import { ChangeEvent, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
interface IProp {
  stylesTitle?: string;
  stylesInput?: string;
  stylesBTN?: string;
  stylesForm?: string;
  stylesWrapperForm?: string;
}
export const HeaderSearchInput = ({ stylesTitle, stylesInput, stylesBTN, stylesForm, stylesWrapperForm }: IProp) => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { t } = useI18n();

  const CTAText = t("CTAText");
  const PlaceholderText = t("PlaceholderText");
  const Title = t("Title");
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const isDisabled = query.length === 0;
  const redirectUrl = router.locale == "en" ? "/search" : "/fr/recherche";
  return (
    <div className={`flex flex-col items-center bg-white p-4 m-4 my-[auto] w-[95%] ${stylesWrapperForm}`} style={{ margin: "auto !important" }}>
      {Title && Title.length !== 0 && <h3 className={` ChartwellTitleH2  text-[2.1875rem] sm:text-[3.125rem] text-center mb-2 ${stylesTitle}`}>{Title}</h3>}
      <form action={redirectUrl} method="get" className={`${stylesForm}`}>
        <div className="relative ">
          <input
            className={`w-[270px] sm:min-w-[340px] md:min-w-[400px] text-md md:text-2xl  text-ChartwellPlum border-2  border-ChartwellPlum placeholder:text-ChartwellPlum bg-transparent py-2 px-4  shadow-sm focus:border-ChartwellPlum  focus:ring-ChartwellPlum ${stylesInput}`}
            type="text"
            id="q"
            name="q"
            placeholder={PlaceholderText}
            value={query}
            onChange={(e) => handleInputChange(e)}
          />
          <MagnifyingGlassIcon className="w-[30px] h-[30px]  text-ChartwellPlum-100 absolute top-[50%] translate-y-[-50%] right-[2%]" />
        </div>
        {CTAText && (
          <button
            disabled={isDisabled}
            type="submit"
            className={` text-white ${
              isDisabled ? "bg-ChartwellPlum-100 " : " cursor-pointer bg-ChartwellPlum  focus:bg-ChartwellPlum"
            } mt-5  block mx-auto  px-20 sm:px-24 py-2 md:px-28 md:py-3 shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ChartwellPlum uppercase ${stylesBTN}`}
          >
            {CTAText}
          </button>
        )}
      </form>
    </div>
  );
};
