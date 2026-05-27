import { RichText as JssRichText, Field } from "@sitecore-content-sdk/nextjs";
import { InView, useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";
type IProps = {
  headingLevel?: Field<string>;
  titleText: Field<string>;
  styles?: string;
};

export const HeadingLevel = ({ headingLevel, titleText, styles = "" }: IProps) => {
  const element = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({
    threshold: 0.4,
    triggerOnce: true,
  });
  const hObj = headingLevel && headingLevel.value && headingLevel.value.length !== 0 ? headingLevel.value : undefined;

  const headingTag = hObj && !hObj.includes("data") ? hObj : "p";
  const headingClass = hObj && !hObj.includes("data") ? hObj : hObj ? hObj.replace("p ", "") : "";
  useEffect(() => {
    if (element.current) {
      const childSpan = element.current.querySelector("span") as HTMLSpanElement;
      if (inView && childSpan) {
        childSpan.classList.add("animate-slide-in");
      }
    }
  });

  return (
    <>
      {titleText && titleText.value && titleText.value.length !== 0 && hObj && (
        <InView as="div">
          <div ref={ref}>
            <div ref={element}>
              <JssRichText field={titleText} tag={headingTag} className={`${headingClass} ${styles}`} />
            </div>
          </div>
        </InView>
      )}
    </>
  );
};
