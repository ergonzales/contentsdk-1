import { JSX } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
const NavDropDownItem = ({ item }: { item: any; parent: any }): JSX.Element => {
  const router = useRouter();
  const isActive = router.asPath.trim() == item?.Href.toLowerCase() && router.asPath != "/" ? "!text-[#8d1360] font-semibold isActive " : "";

  const linkClasses = item?.Styles ? item?.Styles.reduce((styles: any, style: any) => styles.toString() + " " + style.toString(), "") : "";

  const prepend = [
    {
      item: { en: "Experiences", fr: "L’expérience Chartwell" },
      text: { en: "Explore Our Experiences", fr: "Explorez nos expériences" },
    },
    {
      item: { en: "Living Options", fr: "Options d’hébergement" },
      text: { en: "Discover Living Options", fr: "Découvrez nos options d’hébergement" },
    },
    {
      item: { en: "Resources", fr: "Ressources" },
      text: { en: "Browse Resources", fr: "Parcourez nos ressources" },
    },
    {
      item: { en: "About Us", fr: "À propos de nous" },
      text: { en: "Learn About Us", fr: "À propos de nous" },
    },
    {
      item: { en: "Find a Residence", fr: "Trouver une résidence" },
      text: { en: "Search Residences", fr: "Trouver une résidence" },
    },
  ];

  type Locale = "en" | "fr";
  const locale = (router.locale === "fr" ? "fr" : "en") as Locale;
  const found = prepend.find((p) => p.item[locale] === item.NavigationTitle?.value);
  const linkText = found ? found.text[locale] : item.NavigationTitle?.value;

  if (!item) {
    return <></>;
  }
  return (
    <Link key={item?.Id} href={item?.Href} className={`${linkClasses} `} locale={router.locale} target={item?.Id ? "_self" : "_blank"}>
      <div className="p-0">
        <span className={`px-4 py-2 my-1 chartwellDesktopNav sm:!text-sm font-normal linkText ${isActive}`}>{linkText}</span>
      </div>
    </Link>
  );
};
export default NavDropDownItem;
