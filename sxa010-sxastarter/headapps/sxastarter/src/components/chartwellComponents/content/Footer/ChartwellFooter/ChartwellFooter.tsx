import { JSX } from "react";
import { withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";

import { useRouter } from "next/router";
import Link from "next/link";

import Phone from "../../../../../../public/bi_telephone_white.svg";
import ChartwellMarker from "../../../../../../public/white_chartwell_marker.svg";
import ButterflyBg from "../../../../../../public/Butterfly-Opacity.svg";

import { MiceTypeLink } from "../uiFooter/MiceTypeLink";
import { ChartwellSocialLink } from "components/chartwellComponents/ui/socialLink/ChartwellSocialLink";
import { BookATourButton } from "components/chartwellComponents/layout/header/ChartwellPropertyHeader/BookATourButton";
// import { footerCtaButton } from "lib/helpers/helper";

interface FooterField<T> {
  value: T;
}

interface NavigationItem {
  id: string;
  url: string;
  fields: {
    NavigationTitle?: { value: string };
  };
}

interface ExternalItem extends NavigationItem {
  name: string;
  fields: NavigationItem["fields"] & {
    ExternalDropItem: {
      value: {
        url: string;
        title: string;
        text: string;
      };
    };
  };
}

interface SocialItem {
  id: string;
  displayName: string;
  fields: {
    SocialLink: FooterField<string>;
    "Link Target": FooterField<string>;
    SocialLinkSVG: FooterField<{ src: string }>;
  };
}

interface FooterFields {
  BookATourContactUsSubscribePages: NavigationItem[];
  leftLinksBlock: NavigationItem[];
  rightLinksBlock: NavigationItem[];
  MiceTypeLinksUp: NavigationItem[];
  DropItems: ExternalItem[];
  SocialsCards: SocialItem[];
  address: FooterField<string>;
  phoneNumber: FooterField<string>;
  companyName: FooterField<string>;
  CopyrightInfo: FooterField<string>;
}

interface ChartwellFooterProps extends ComponentProps {
  fields: {
    data?: {
      ds?: {
        fields?: {
          name: string;
          jsonValue: unknown;
        }[];
      };
    };
  };
}

const ChartwellFooter = ({ fields }: ChartwellFooterProps): JSX.Element => {
  const { ds } = fields?.data || {};

  const footerFields =
    ds?.fields?.reduce((acc: { [key: string]: any }, item: any) => {
      if (item?.name) {
        acc[item.name] = ds?.fields?.find((field: any) => field.name === item.name)?.jsonValue || [];
      }
      return acc;
    }, {}) || {};

  const {
    BookATourContactUsSubscribePages = [],
    leftLinksBlock = [],
    rightLinksBlock = [],
    MiceTypeLinksUp = [],
    CopyrightInfo = { value: "" },
    DropItems = [],
    SocialsCards = [],
    address = { value: "" },
    phoneNumber = { value: "" },
    companyName = { value: "" },
  } = footerFields as FooterFields;

  const router = useRouter();

  const renderBookATourButton = (item: any) => {
    return (
      <li key={item.id}>
        <BookATourButton
          BookATour={item}
          style={"text-[0.875rem] uppercase"}
          className={
            "text-center text-[0.875rem] border font-normal text-[0.875rem] px-6 py-3 w-full md:w-auto hover:border-ChartwellWhite-100  focus:border-ChartwellWhite-100  hover:text-ChartwellWhite-100  focus:text-ChartwellWhite-100 duration-300 cursor-pointer flex justify-center"
          }
          isBat={false}
        />
      </li>
    );
  };

  const renderLeftLink = (leftLink: any) => {
    return (
      <li
        key={leftLink.id}
        className="py-1 text-[0.875rem] md:text-[0.8125rem] hover:text-ChartwellWhite-100 focus:text-ChartwellWhite-100 active:text-ChartwellWhite-100 duration-300 uppercase sm:text-center md:text-left "
      >
        <Link className="" href={`${leftLink.url}`} locale={router.locale} passHref>
          {leftLink.fields?.NavigationTitle?.value}
        </Link>
      </li>
    );
  };

  const renderDropItem = (navLink: any) => {
    return (
      <li
        key={navLink.id}
        className="py-1 text-[14px] md:text-[13px]  hover:text-ChartwellWhite-100 focus:text-ChartwellWhite-100 active:text-ChartwellWhite-100 duration-300 uppercase text-center md:text-left"
      >
        <Link target="_blank" href={`${navLink?.fields?.ExternalDropItem?.value?.url}`} locale={router.locale} passHref>
          {navLink?.name === "external-careers" ? navLink?.fields?.ExternalDropItem?.value?.text.toUpperCase() : navLink?.fields?.ExternalDropItem?.value?.title.toUpperCase()}
        </Link>
      </li>
    );
  };

  const renderRightLink = (rightLink: any, index: number) => {
    return (
      <li
        key={rightLink.id}
        className="text-[0.875rem] md:text-[0.8125rem]  relative hover:text-ChartwellWhite-100 first:md:ml-[-14px] focus:text-ChartwellWhite-100 active:text-ChartwellWhite-100 duration-300 uppercase  text-center md:text-left whitespace-nowrap"
      >
        <Link href={`${rightLink.url}`} locale={router.locale} passHref className="">
          {rightLink.fields?.NavigationTitle?.value}
        </Link>
        <span className={` absolute hidden md:block w-[2px] h-[2px] ${index === 0 ? "md:hidden " : ""}  bg-ChartwellWhite-200 rounded-full left-[-4%] top-[50%] translate-y-[-50%]`}></span>
      </li>
    );
  };

  const renderSocialLink = (linkCard: any, index: number) => {
    return (
      <ChartwellSocialLink
        key={linkCard.id}
        href={linkCard.fields?.SocialLink?.value}
        name={linkCard.displayName}
        target={linkCard.fields?.["Link Target"]?.value}
        ImageValue={linkCard.fields?.SocialLinkSVG?.value}
        index={index}
      />
    );
  };

  const renderMiceTypeLink = (link: any, listStyle?: string | "", linkStyle?: string | "") => {
    return <MiceTypeLink listStyle={listStyle} LinkStyle={linkStyle} key={link.id} link={link} />;
  };

  return (
    <footer className={`bg-ChartwellGrey w-full relative bg-no-repeat bg-cover md:bg-35% sm:bg-right `} style={{ backgroundImage: `url(${ButterflyBg.src})` }}>
      <p id="footer-heading" className="sr-only">
        Footer
      </p>
      <div className="ChartwellContainer ChartwellFooterText SectionPadding  ">
        <div className="  ">
          <div className="md:w-full lg:w-[80%]  md:flex justify-between ">
            <div className="md:pr-6">
              <span className="my-3 inline-block ChartwellFooterText font-bold text-center md:text-left text-[1.375rem] md:text-[1.25rem] uppercase">
                {companyName && companyName.value.toString()}
              </span>
              <address className="flex md:flex-row flex-col  items-center flex-wrap">
                <a
                  className="hover:text-ChartwellWhite-100 ChartwellFooterText no-underline focus:text-ChartwellWhite-100 duration-300 justify-center  not-italic  text-[0.875rem] flex items-center "
                  href={`https://www.google.com/maps/place/${address?.value}`}
                  rel="noreferrer noopener"
                >
                  <svg width="30" height="40" className="hidden sm:block">
                    <image href={`${ChartwellMarker.src}`} width="30" height="30" className=" " />
                  </svg>
                  {address?.value}
                </a>
                <a
                  href={`tel:${phoneNumber?.value}`}
                  className="hover:text-ChartwellWhite-100 ChartwellFooterText no-underline justify-center text-[0.875rem] focus:text-ChartwellWhite-100 duration-300 flex items-center not-italic"
                >
                  <svg width="20" height="20" className="block mx-2">
                    <image href={`${Phone.src}`} width="20" height="20" className="" />
                  </svg>
                  <span>{phoneNumber?.value}</span>
                </a>
              </address>
              <ul className="md:flex  md:items-center md:justify-between grid mt-4 gap-4 ">{BookATourContactUsSubscribePages.map(renderBookATourButton)}</ul>
            </div>
            <span className="w-0  border-l hidden md:block"></span>
            <div>
              <ul className="md:px-[18px] flex flex-col mt-6 md:mt-3 sm:justify-center md:justify-start items-center  md:grid gap-1 ">{leftLinksBlock?.map(renderLeftLink)}</ul>
              <ul className="md:px-[18px] flex flex-col justify-center items-center  md:grid gap-1 ">{DropItems?.map(renderDropItem)}</ul>
            </div>

            <span className="w-0 hidden md:block border-l"></span>
            <ul className={`md:px-[18px] flex flex-col  mt-4 md:mt-3 justify-center items-center md:grid ml-2 gap-1 ${router.locale === "fr" ? "md:ml-2" : ""}`}>
              {rightLinksBlock?.sort()?.map(renderRightLink)}
            </ul>
          </div>
        </div>
        <div className=" flex mt-8 justify-center items-center gap-4 md:hidden">
          <span className="w-full h-[1px] bg-white"></span>
          {SocialsCards?.map(renderSocialLink)}
          <span className="w-full h-[1px] bg-white"></span>
        </div>
        <ul className="md:hidden mt-6 gap-2 flex flex-col items-center justify-center">
          {/* Mobile */}
          {MiceTypeLinksUp?.map((link: any) => renderMiceTypeLink(link))}
        </ul>

        <div className="flex mt-2 md:mt-10  sm:relative">
          <div className="mt-2 md:w-[80%] md:border-t border-white pt-2 lg:mr-4   ">
            <div>
              <p className="mx-0 my-1 p-0 ChartwellFooterText text-center md:text-left">{`${CopyrightInfo?.value.replace("2025", new Date().getFullYear().toString())}` || ""}</p>
              <ul className="hidden md:flex">
                {/* Desktop */}
                {MiceTypeLinksUp?.map((link: any) => renderMiceTypeLink(link, "first:pl-0 px-2 border-r last:border-0", "m-0   md:order-1"))}
              </ul>
            </div>
          </div>

          <div className="hidden md:flex mt-4 sm:mt-0 gap-2 lg:gap-4 absolute top-[-50%] right-0 md:translate-y-[30%] ">{SocialsCards.map(renderSocialLink)}</div>
        </div>
      </div>
    </footer>
  );
};

export default withDatasourceCheck()<ChartwellFooterProps>(ChartwellFooter);
