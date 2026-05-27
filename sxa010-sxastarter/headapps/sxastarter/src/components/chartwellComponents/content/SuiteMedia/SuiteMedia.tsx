import { Field, ImageField, withDatasourceCheck, Image as JssImage } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { useMemo, JSX } from "react";
import { InView, useInView } from "react-intersection-observer";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";
import { getBgColor } from "lib/helpers/layoutOption/index";

type SuiteMediaProps = ComponentProps & {
  fields: {
    Title: Field<string>;
    Desc: Field<string>;
    "video ID": Field<string>;
    videoSource: Field<string>;
    "background color": Field<string>;
    "is Video": Field<boolean>;
    "Display Image": ImageField;
    "Bottom Desc": Field<string>;
    "Heading Level": Field<string>;
  };
};

const SuiteMedia = ({ fields }: SuiteMediaProps): JSX.Element => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const {
    Title,
    Desc,
    "Bottom Desc": DescBottom,
    "video ID": VideoId,
    videoSource: VideoSource,
    "background color": BgValue,
    "is Video": isVideoField,
    "Display Image": Image,
    "Heading Level": HeadingLevelField,
  } = fields || {};

  const desc = Desc?.value;
  const descBottom = DescBottom?.value;
  const videoId = VideoId?.value;
  const videoSource = VideoSource?.value;
  const bgValue = BgValue?.value;
  const isVideo = isVideoField?.value;

  const videoHref = useMemo(() => {
    if (!videoSource || !videoId) return "";
    switch (videoSource) {
      case "vimeo":
        return `https://player.vimeo.com/video/${videoId}`;
      case "youtube":
        return `https://www.youtube.com/embed/${videoId}`;
      case "matterport":
        return `https://my.matterport.com/show/?m=${videoId}`;
      default:
        return "";
    }
  }, [videoSource, videoId]);

  const bgColor = getBgColor(bgValue);
  const hasImage = Image?.value && Image?.value.asset !== null && Image?.value.src;
  const isRendering = (isVideo && videoHref) || hasImage;

  if (!isRendering) return <div />;

  return (
    <div className="ChartwellContainer SectionPadding">
      <div>
        <HeadingLevel headingLevel={HeadingLevelField} titleText={Title} styles="mb-6 text-center" />
        {desc && <div className="text-center ChartwellText" dangerouslySetInnerHTML={{ __html: desc }} />}
      </div>
      <div ref={ref} className="mt-12 relative">
        <div className={`absolute ${bgColor} top-[50%] z-0 translate-y-[-50%] w-full h-[60%]`} />
        <InView as="div" className={`${inView ? "opacity-100" : "opacity-0"} ease-in-out duration-900`}>
          {isVideo && videoHref ? (
            <iframe
              className="mx-auto h-[220px] w-full sm:h-[320px] sm:w-[75%] md:h-[400px] md:w-[70%] lg:h-[500px] lg:w-[65%] z-50 drop-shadow-[10px_11px_3px_rgba(0,0,0,0.25)]"
              src={videoHref}
              allow="autoplay; fullscreen"
              title={Title?.value || "Embedded Video"}
              aria-label={Title?.value || "Video Player"}
              allowFullScreen
              suppressHydrationWarning
            />
          ) : (
            hasImage && (
              <JssImage
                field={Image}
                className="mx-auto min-h-[220px] w-full sm:h-[320px] sm:w-[75%] md:h-[400px] md:w-[70%] lg:h-[500px] lg:w-[65%] z-50 drop-shadow-[10px_11px_3px_rgba(0,0,0,0.25)]"
              />
            )
          )}
        </InView>
        {descBottom && <div className="text-center mt-12 ChartwellText" dangerouslySetInnerHTML={{ __html: descBottom }} />}
      </div>
    </div>
  );
};

export default withDatasourceCheck()<SuiteMediaProps>(SuiteMedia);
