import { JSX } from "react";
import { Field, LinkField, withDatasourceCheck, RichText as JssRichText } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { InView, useInView } from "react-intersection-observer";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";

type TwoColMultiMediaSectionProps = ComponentProps & {
  fields: {
    MediaList: Array<any>;
    "Section Title": Field<string>;
    "Heading Level": Field<string>;
    "CTA Text": Field<string>;
    "Desc text": Field<string>;
    "Media location": Field<string>;
    "CTA Link": LinkField;
    ["CTA Style"]: Field<string>;
    "Background Image"?: Field<any>;
    "bottom desc text": Field<string>;
  };
};

const TwoColMultiMediaSection = (props: TwoColMultiMediaSectionProps): JSX.Element => {
  const { ref, inView } = useInView({
    threshold: 0.4,
    triggerOnce: true,
  });

  if (!props.fields)
    return (
      <>
        <p>Missing Content and or Data Source</p>
      </>
    );

  const { MediaList } = props.fields;
  const BackgroundImage = props.fields && props.fields["Background Image"] != undefined ? props.fields["Background Image"]?.value : undefined;
  const CTAText = props.fields && props.fields["CTA Text"].value;
  const Text = props.fields && props.fields["Desc text"];
  const TextBottom = props.fields && props.fields["bottom desc text"];
  const Location = props.fields && props.fields["Media location"].value === "Left" ? true : false;
  const CTALink = props.fields && props.fields["CTA Link"].value;
  const CTAStyle = (props.fields && props.fields["CTA Style"] && props.fields["CTA Style"].value ? props.fields && props.fields["CTA Style"].value : "plum on clear background").replace(/\s/g, "-");

  const VideoListSrc =
    MediaList &&
    MediaList.length !== 0 &&
    MediaList.map((video): any => {
      if (video?.fields?.VideoID?.value?.length != 0) {
        switch (video?.fields?.VideoSource?.value) {
          case "vimeo":
            return { name: video.name, src: `https://player.vimeo.com/video/${video.fields.VideoID.value}` };

          case "youtube":
            return { name: video.name, src: `https://www.youtube.com/embed/${video.fields.VideoID.value}` };

          case "matterport":
            return { name: video.name, src: `https://my.matterport.com/show/?m=${video.fields.VideoID.value}` };

          default:
            break;
        }
      }
    });
  const isOneVideo = VideoListSrc && VideoListSrc.length === 1 ? true : false;

  return (
    <div className="w-full bg-no-repeat bg-cover" style={{ backgroundImage: BackgroundImage?.src && `url(${BackgroundImage?.src})` }}>
      <div className="ChartwellContainer SectionPadding ">
        {props.fields && props.fields["Heading Level"] && props.fields["Section Title"] && <HeadingLevel headingLevel={props.fields["Heading Level"]} titleText={props.fields["Section Title"]} />}
        <div className={`md:flex md:justify-between ${isOneVideo ? "SectionPadding lg:flex lg:items-center gap-12" : ""}  ${Location ? "flex-row-reverse " : ""}`}>
          <div className={`${Location ? "md:ml-10" : "md:mr-10"} ${isOneVideo ? "w-full lg:w-1/2 md:ml-0" : "md:w-[35%]"}  md:content-center`}>
            {Text && <JssRichText field={Text} tag="div" className="mb-4 ChartwellText" />}
            {CTAText != "" && CTALink.href != "" && TextBottom.value == ""
              ? CTALink && <ChartwellLink href={CTALink.href} label={CTAText} tailwindStyles={`p-2 hidden sm:hidden md:block ${CTAStyle} `} linkId={CTALink?.id as string} />
              : ""}
          </div>
          <ul ref={ref} className={`flex flex-col sm:justify-items-center items-center ${isOneVideo ? "w-full lg:w-1/2" : "sm:mt-6 md:mt-0 lg:py-6 sm:grid sm:gap-4 sm:grid-cols-2"}`}>
            {VideoListSrc &&
              VideoListSrc.length !== 0 &&
              VideoListSrc.map((video, index) => {
                return (
                  video &&
                  video.src.length != 0 && (
                    <li key={index} className={`relative overflow-hidden group ${isOneVideo ? "w-full" : "mt-6 sm:mt-0"}`}>
                      <InView as="div" className={`${inView ? "opacity-100" : "opacity-0"} w-full ease-in-out duration-1250`}>
                        <iframe
                          title={video.name || "Embedded Video"}
                          aria-label={video.name || "Video Player"}
                          key={index}
                          className={`${isOneVideo ? "flex flex-1 w-full sm:w-full h-[200px] sm:h-[360px]" : "md:w-360px lg:w-400px md:h-200px"}`}
                          src={`${video.src}`}
                          allow="autoplay; fullscreen"
                          allowFullScreen
                          suppressHydrationWarning
                        ></iframe>
                      </InView>
                    </li>
                  )
                );
              })}
          </ul>
        </div>
        {TextBottom.value != "" && <JssRichText field={TextBottom} tag="div" className="ChartwellText" />}
        <div className={`w-full flex items-center justify-center ${TextBottom.value != "" ? "xs:flex" : "sm:hidden"}`}>
          {CTAText != "" && CTALink.href != "" ? CTALink && <ChartwellLink href={CTALink.href} label={CTAText} tailwindStyles={`p-2 block ${CTAStyle} `} linkId={CTALink?.id as string} /> : ""}
        </div>
      </div>
    </div>
  );
};
export default withDatasourceCheck()<TwoColMultiMediaSectionProps>(TwoColMultiMediaSection);
