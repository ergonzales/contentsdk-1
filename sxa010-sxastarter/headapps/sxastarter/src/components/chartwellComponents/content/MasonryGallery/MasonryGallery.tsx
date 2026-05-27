import { JSX } from "react";
import { withDatasourceCheck, NextImage } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { ChartwellModal } from "components/chartwellComponents/ui/modal/ChartwellModal";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { InView, useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";
const DynamicChartwellModal = dynamic(() => Promise.resolve(ChartwellModal), {
  ssr: false,
});
type MasonryGalleryProps = ComponentProps & {
  fields: {
    DAMImages: Array<any>;
  };
};

const MasonryGallery = (props: MasonryGalleryProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });
  const DAMImages = props.fields && props.fields?.DAMImages;

  return (
    <div className="ChartwellContainer SectionPadding ">
      <DynamicChartwellModal open={open} setOpen={setOpen}>
        {DAMImages !== undefined && DAMImages.length !== 0 && (
          <div className="w-full relative lg:w-10/12     mx-auto  ">
            <NextImage field={DAMImages[currentIndex].fields.displayImage} className=" mx-auto" />
            <div className=" w-full  absolute top-[50%]">
              <button
                onClick={() => setCurrentIndex(currentIndex === DAMImages.length - 1 ? 0 : currentIndex + 1)}
                type="button"
                className="hidden lg:block absolute top-[50%] right-[-15px]  sm:right-[-3%]  lg:right-[-3.6%] translate-y-[-50%]"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="lg:w-[50px] lg:h-[70px]  md:w-[30px] md:h-[50px] sm:w-[30px] sm:h-[40px] w-[20px] h-[30px]  fill-ChartwellGrey-100 hover:fill-ChartwellGrey" />
              </button>
              <button
                onClick={() => setCurrentIndex(currentIndex === 0 ? DAMImages.length - 1 : currentIndex - 1)}
                type="button"
                className="hidden lg:block absolute top-[50%] left-[-15px]  sm:left-[-3%] lg:left-[-3.6%]  translate-y-[-50%]"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="lg:w-[50px] lg:h-[70px]  md:w-[30px] md:h-[50px] sm:w-[30px] sm:h-[40px] w-[20px] h-[30px]  fill-ChartwellGrey-100  hover:fill-ChartwellGrey" />
              </button>
            </div>
            <div className="w-full flex justify-evenly absolute bottom-[-20%]">
              <button onClick={() => setCurrentIndex(currentIndex === 0 ? DAMImages.length - 1 : currentIndex - 1)} type="button" className="lg:hidden ">
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="lg:w-[50px] lg:h-[70px]  md:w-[30px] md:h-[50px] sm:w-[30px] sm:h-[40px] w-[20px] h-[30px]  fill-ChartwellGrey-100  hover:fill-ChartwellGrey" />
              </button>
              <button onClick={() => setCurrentIndex(currentIndex === DAMImages.length - 1 ? 0 : currentIndex + 1)} type="button" className="lg:hidden ">
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="lg:w-[50px] lg:h-[70px]  md:w-[30px] md:h-[50px] sm:w-[30px] sm:h-[40px] w-[20px] h-[30px]  fill-ChartwellGrey-100 hover:fill-ChartwellGrey" />
              </button>
            </div>
          </div>
        )}
      </DynamicChartwellModal>
      <ul ref={ref} className="grid grid-cols-3  md:grid-cols-4 gap-2 ">
        {DAMImages !== undefined &&
          DAMImages.length !== 0 &&
          DAMImages.map((image, index) => {
            return (
              <InView
                as="li"
                onClick={() => setCurrentIndex(index)}
                key={index}
                className={`${
                  inView ? "translate-y-[0] scale-100" : "first:translate-y-[-100%] last:translate-y-[100%] scale-0"
                } ease-in-out duration-900 [&:nth-child(3n)]:col-span-3 odd:col-span-2  md:[&:nth-child(3n)]:col-span-1 md:odd:col-span-1  md:[&:nth-child(3)]:!col-span-2 md:[&:nth-child(4)]:col-span-2`}
              >
                <div className="relative w-full h-[220px] hover:z-20 hover:animate-[wiggle_1s_ease-in-out_infinite] duration-300 ease-in-out hover:scale-105 cursor-pointer hover:drop-shadow-[2px_11px_3px_rgba(0,0,0,0.25)]">
                  <NextImage onClick={() => setOpen(!open)} className="absolute w-full h-full object-cover" field={image.fields.displayImage} />
                </div>
              </InView>
            );
          })}
      </ul>
    </div>
  );
};

export default withDatasourceCheck()<MasonryGalleryProps>(MasonryGallery);
