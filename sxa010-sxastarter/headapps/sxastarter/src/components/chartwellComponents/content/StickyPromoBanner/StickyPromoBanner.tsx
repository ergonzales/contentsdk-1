import { JSX } from "react";
import { withDatasourceCheck, RichText as JssRichText } from "@sitecore-content-sdk/nextjs";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { useEffect, useState } from "react";
import { hidePageBannerOrAnnouncement } from "lib/helpers/helper";

import { useRouter } from "next/router";
import { Button } from "@headlessui/react";
import dynamic from "next/dynamic";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";
const ChartwellModalLazy = dynamic(() => import("components/chartwellComponents/ui/modal/ChartwellModal").then((m) => m.ChartwellModal), { ssr: false });
const StickyVideoBannerLazy = dynamic(() => import("./StickyVideoBanner").then((m) => m.StickyVideoBanner), { ssr: false });
const StickyPromoBanner = (props: any): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    //for the css animation to restart
    if (typeof document !== "undefined") {
      const el = document.querySelector(".stickyPromoUniversal") as HTMLElement;
      if (el) {
        el.style.animation = "none";
        el.offsetHeight; /* trigger reflow */
        el.style.animation = "";
      }
    }
  }, []);

  const bannerData = hidePageBannerOrAnnouncement(sitecoreContext, props?.fields, router);

  // Hide if not valid date or excluded, unless there's an announcement
  if (bannerData && bannerData?.hideBannerOrAnnouncement) return <></>;
  const ctaStyle = (
    (bannerData?.hasAnnouncement
      ? bannerData?.ci?.cTALink?.jsonValue?.value?.class || bannerData?.ci?.cTAStyle?.jsonValue?.value
      : bannerData.ds?.stickyPromoCtaLink?.jsonValue?.value?.class || bannerData.ds?.stickyPromoCtaStyle?.jsonValue?.value || bannerData?.ci?.["CTA Style"]?.value) ?? "plum on clear background"
  ).replace(/\s/g, "-");

  const vimeoID = bannerData.vimeoID;

  return (
    <>
      <ChartwellModalLazy open={open} setOpen={setOpen} styles=" flex flex-col justify-center items-center relative ">
        {open && vimeoID ? <StickyVideoBannerLazy id={vimeoID} /> : null}
      </ChartwellModalLazy>
      <div id={`StickyPromoBanner${bannerData?.hasAnnouncement ? "Announcement" : ""}`} className={`!z-10 sticky w-full  bg-ChartwellPlum stickyPromoUniversal`}>
        <div className="ChartwellContainer !py-[8px]">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-4">
            {!bannerData.hasAnnouncement && (bannerData.ds?.stickyPromoBlockText?.jsonValue?.value || bannerData?.ci?.BlockText?.value) && (
              <JssRichText field={bannerData.ds?.stickyPromoBlockText?.jsonValue || bannerData?.ci?.BlockText} tag="div" className="text-ChartwellWhite sm:flex sm:items-center gap-1" />
            )}
            {bannerData.hasAnnouncement && (bannerData.ci?.announcement?.jsonValue?.value || bannerData?.fields?.Announcement?.value) && (
              <div
                className="text-ChartwellWhite sm:flex sm:items-center gap-1 announcementText text-center md:text-left"
                dangerouslySetInnerHTML={{ __html: bannerData.ci?.announcement?.jsonValue?.value || bannerData?.fields?.Announcement?.value || "" }}
              />
            )}
            {bannerData.hasAnnouncement && bannerData.shouldShowCta ? (
              <ChartwellLink
                href={bannerData.ctaHref}
                target={bannerData.ctaTarget}
                label={bannerData.ctaLabel}
                ariaLabel={bannerData.ctaTitle}
                textStyles="!text-[0.8125rem]"
                tailwindStyles={`!m-0 !mt-[0px] duration-300 chartwellCTAs !py-[4px] !px-[10px] ${ctaStyle} !border-ChartwellWhite rounded-md`}
                linkId={bannerData.ctaLinkId}
              />
            ) : bannerData.shouldShowCta && !vimeoID ? (
              <ChartwellLink
                href={bannerData.ctaHref}
                target={bannerData.ctaTarget}
                label={bannerData.ctaLabel}
                ariaLabel={bannerData.ctaTitle}
                textStyles="!text-[0.8125rem]"
                tailwindStyles={`!m-0 !mt-[0px] duration-300 chartwellCTAs !py-[4px] !px-[10px] ${ctaStyle} !border-ChartwellWhite rounded-md`}
                linkId={bannerData.ctaLinkId}
              />
            ) : (
              vimeoID && (
                <Button
                  onClick={() => setOpen(!open)}
                  className={`text-sm rounded-md bg-ChartwellPlum py-2 px-4 border-2 border-white text-white hover:bg-white hover:text-ChartwellPlum ease-in-out duration-300 uppercase`}
                >
                  {bannerData.ctaLabel}
                </Button>
              )
            )}

            {/* {bannerData.shouldShowCta && !vimeoID && (
              <ChartwellLink
                href={bannerData.ctaHref}
                target={bannerData.ctaTarget}
                label={bannerData.ctaLabel}
                ariaLabel={bannerData.ctaTitle}
                textStyles="!text-[0.8125rem]"
                tailwindStyles={`!m-0 !mt-[0px] duration-300 chartwellCTAs !py-[4px] !px-[10px] ${ctaStyle} !border-ChartwellWhite rounded-md`}
                linkId={bannerData.ctaLinkId}
              />
            )}
            {vimeoID && (
              <Button
                onClick={() => setOpen(!open)}
                className={`text-sm rounded-md bg-ChartwellPlum py-2 px-4 border-2 border-white text-white hover:bg-white hover:text-ChartwellPlum ease-in-out duration-300 uppercase`}
              >
                {bannerData.ctaLabel}
              </Button>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default withDatasourceCheck()<any>(StickyPromoBanner);
