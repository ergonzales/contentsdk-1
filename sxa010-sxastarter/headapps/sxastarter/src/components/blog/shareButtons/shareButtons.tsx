import { useSitecore } from "@sitecore-content-sdk/nextjs";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, LinkedinShareButton, LinkedinIcon, EmailShareButton, EmailIcon } from "next-share";
import { useEffect, useState } from "react";
import { useI18n } from "next-localization";
export const ShareButtons = (subject: any) => {
  const [origin, setOrigin] = useState("https://chartwell.com");
  const { page } = useSitecore();
  const sitecoreContext = page?.layout?.sitecore?.context || {};
  const { t } = useI18n();

  useEffect(() => {
    setOrigin(window.location.origin);
  }, [sitecoreContext]);

  const itemPath = origin + sitecoreContext.itemPath;
  const title = subject.subject;
  return (
    <div className="flex items-center w-100 md:w-36 md:flex-none shareButtons min-w-fit !p-2 md:p-0">
      <span className="inline-flex mr-[10px] plum">{t("ShareIn")}</span>
      <FacebookShareButton className="" url={itemPath} quote={`${title}`} hashtag="">
        <FacebookIcon size={36} round />
      </FacebookShareButton>
      <TwitterShareButton url={itemPath} title={`${title}`}>
        <TwitterIcon size={36} round />
      </TwitterShareButton>
      <LinkedinShareButton url={itemPath}>
        <LinkedinIcon size={36} round />
      </LinkedinShareButton>
      <EmailShareButton url={itemPath} subject={`${title}`} body={`${title}: ${itemPath}`}>
        <EmailIcon size={36} round />
      </EmailShareButton>
      <a href="#" onClick={() => window.print()} className="button transparent shareBtn" aria-label="print">
        <img src="/print.svg" height="40" width="40" alt="print"></img>
      </a>
    </div>
  );
};
