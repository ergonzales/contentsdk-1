import React, { JSX } from "react";
import { PopoverCloseProvider } from "./PopoverCloseContext";
import { ChartwellNavLinksPopover } from "./ChartwellNavLinksPopover";

export const DesktopNavigation = ({ navData, children, styles }: { navData: any; styles: any; children: React.ReactNode }): JSX.Element => {
  return (
    <>
      <PopoverCloseProvider>
        <ChartwellNavLinksPopover navData={navData} styles={styles} />
      </PopoverCloseProvider>
      {children}
    </>
  );
};
