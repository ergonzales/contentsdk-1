import React from "react";
import { Popover } from "@headlessui/react";
// import { usePopoverClose } from "./PopoverCloseContext";
import NavDropDown from "./NavDropDown";
import NavDropDownTrigger from "./NavDropdownTrigger";
import { BookATourButton } from "../ChartwellPropertyHeader/BookATourButton";
import MapleLeaf from "../MapleLeaf";

export const ChartwellNavLinksPopover = ({ navData, styles }: { navData: any; styles: string }) => {
  // const { triggerClose } = usePopoverClose();

  // useEffect(() => {
  //   triggerClose();
  // }, [sitecoreContext?.route?.name]);

  if (!navData) {
    return <p>Loading</p>;
  }

  const NavigationItems = Object.values(navData.fields);

  const getFormattedBat = (bat: any) => {
    return bat
      ? {
          url: bat.url || bat.Href || "",
          fields: {
            NavigationTitle: {
              value: bat.fields?.NavigationTitle?.value || bat.NavigationTitle?.value || "",
            },
          },
        }
      : null;
  };

  const renderBookATourButton = (navItem: any, formattedBat: any) => (
    <React.Fragment key={navItem.Id}>
      <MapleLeaf />
      {formattedBat && (
        <BookATourButton
          BookATour={formattedBat}
          className={`${navItem.Styles.join(
            " "
          )} ${styles} rounded-[4px] leading-[1.25] hard-link hidden lg:flex ml-auto font-normal text-[0.875rem] px-3 py-4 lg:py-0 items-center text-white text-center bg-ChartwellBlue focus:bg-ChartwellPlum hover:bg-ChartwellPlum hover:text-white uppercase`}
        />
      )}
    </React.Fragment>
  );

  const renderNavItem = (navItem: any) => (
    <div className={`lg:ml-2 flex shrink`} key={navItem.Id}>
      <Popover as="nav" key={`Popover${navItem.Id}`} className="flex items-center">
        <Popover className="relative">
          <NavDropDownTrigger navItem={navItem} />
          <NavDropDown navItem={navItem} />
        </Popover>
      </Popover>
    </div>
  );

  return (
    <>
      {NavigationItems.map((navItem: any) => {
        if ((navItem.Id || "").toLowerCase() === "485cffc6-68d1-4a43-9e13-a06ccf6cf635") {
          const formattedBat = getFormattedBat(navItem);
          return renderBookATourButton(navItem, formattedBat);
        } else {
          return renderNavItem(navItem);
        }
      })}
    </>
  );
};
