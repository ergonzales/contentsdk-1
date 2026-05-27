import { PropertyLogoHomeName } from "components/chartwellComponents/ui/PropertyLogoHomeName";
import { PhoneNumber } from "./PhoneNumber";
import { BookATourButton } from "./BookATourButton";
import { BottomNavLinks } from "./BottomNavLinks";

interface IProps {
  bottomLink: any;
  phoneNumber: string;
  logo: { value: { src: string; height: number; width: number } };
  href: string;
  title: string;
  BookATour: any;
}

export const DesktopNav = ({ logo, bottomLink, phoneNumber, href, title, BookATour }: IProps) => (
  <div className="flex justify-between items-center pt-2">
    <div className="flex items-center">
      <PropertyLogoHomeName href={href} logo={logo} title={title} />
      {bottomLink?.length > 0 && (
        <ul className="flex items-center gap-4 xl:gap-6 ml-4 xl:ml-6 ChartwellText text-[0.875rem]">
          <BottomNavLinks bottomLink={bottomLink} />
        </ul>
      )}
    </div>
    <div className="flex items-center justify-between">
      {BookATour && <BookATourButton BookATour={BookATour} />}
      <PhoneNumber phoneNumber={phoneNumber} />
    </div>
  </div>
);
