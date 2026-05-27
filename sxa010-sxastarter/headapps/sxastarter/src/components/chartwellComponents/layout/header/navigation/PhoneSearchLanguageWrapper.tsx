import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import LanguageSwitcher from "../LanguageSwitcher";
import { useRouter } from "next/router";
// import { useState, useEffect } from "react";
interface IProp {
  open: boolean;
  setOpen: (open: boolean) => void;
  styles: string;
}
export const PhoneSearchLanguageWrapper = ({ styles }: IProp) => {
  const router = useRouter();

  const searchHandler = () => {
    if (router.pathname !== "/search") {
      if (router.locale === "en") {
        router.push(`/search`);
      } else {
        router.push(`/recherche`);
      }
    } else {
      router.reload();
    }
  };
  return (
    <div className={`${styles}`}>
      <a href="tel:18554610685" className="inline-block py-[0.8rem] text-ChartwellPlum text-[0.95rem] font-semibold hover:text-ChartwellPlum-100  focus:text-ChartwellPlum-100 leading-[1.25]">
        1-855-461-0685
      </a>

      <MagnifyingGlassIcon
        onClick={searchHandler}
        className="magnifying-glass-icon w-[44px] h-[44px] py-[0.5rem] ml-4 mr-2 text-ChartwellPlum hover:text-ChartwellPlum-100 focus:text-ChartwellPlum-100 cursor-pointer "
      />
      <LanguageSwitcher styles={`!ml-0`} />
    </div>
  );
};
