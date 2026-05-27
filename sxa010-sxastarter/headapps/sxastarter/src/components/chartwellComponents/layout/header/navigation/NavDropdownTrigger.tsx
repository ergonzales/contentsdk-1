import { JSX, KeyboardEvent, useRef } from "react";
import { PopoverButton } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import styles from "./NavDropDownTrigger.module.css";
import { useRouter } from "next/router";

const NavDropDownTrigger = ({ navItem }: { navItem: any }): JSX.Element => {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const isActive = router.asPath.trim().split("/").includes(navItem.Href.toLowerCase().replaceAll("/", "")) && router.asPath != "/";
  const linkClasses = navItem.Styles.reduce((styles: any, style: any) => styles.toString() + " " + style.toString(), "");
  const triggerLabel = navItem.NavigationTitle?.value || "Navigation";

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      buttonRef.current?.click();
    }
  };

  return (
    <div className={`  flex flex-align-items-center`}>
      <PopoverButton
        ref={buttonRef}
        title={triggerLabel}
        aria-label={`Toggle ${triggerLabel} menu`}
        aria-haspopup="menu"
        className={`leading-[1.25] xl:whitespace-nowrap text-black sm:px-2 md:px-3 xxl:px-4 py-3 mt-1 group inline-flex items-center !rounded-[6px] font-normal focus:bg-[#8d1360] focus:text-white focus:font-semibold focus:outline-none ${
          styles.navDropdownTrigger
        } ${isActive ? "chartwellDesktopNav isActive" : ""} popOverButton `}
        onMouseEnter={() => {}}
        onKeyDown={handleKeyDown}
      >
        <span className={`inline-flex ${linkClasses} popOverLink text-[0.875rem] ${isActive ? "!text-white" : ""}`}>{navItem.NavigationTitle?.value}</span>
        <span className="sr-only">Toggle {triggerLabel} menu</span>
        <ChevronDownIcon className={`h-5 w-5 group-hover:text-gray-500 `} aria-hidden="true" />
      </PopoverButton>
    </div>
  );
};
export default NavDropDownTrigger;
