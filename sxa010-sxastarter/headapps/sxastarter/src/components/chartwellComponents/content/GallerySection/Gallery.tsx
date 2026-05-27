import { NextImage } from "@sitecore-content-sdk/nextjs";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { InView, useInView } from "react-intersection-observer";

interface DAMImageField {
  name: string;
  jsonValue: any;
}

interface DAMImage {
  fields: DAMImageField[];
}

interface IProps {
  DAMImages: DAMImage[];
  initialInView?: boolean;
}

export const Gallery = ({ DAMImages, initialInView = false }: IProps) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
    initialInView,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLUListElement>(null);

  // Memoize the last index for performance
  const lastIndex = useMemo(() => DAMImages.length - 1, [DAMImages.length]);

  // Memoize display images for all DAMImages
  const displayImages = useMemo(
    () =>
      DAMImages.map(({ fields }) => {
        if (!Array.isArray(fields)) {
          // If fields is not an array, try to return fields.displayImage or fields itself
          return (fields as any)?.displayImage ?? fields;
        }
        // If fields is an array, find displayImage
        return fields.find(({ name }) => name === "displayImage");
      }),
    [DAMImages]
  );

  // Helper to get image dimensions with defaults
  const getImageDimensions = (img: any) => {
    const src = img?.jsonValue?.value?.src ?? img?.src;
    if (!src) return { height: 960, width: 1280 };
    const height = Number(img?.jsonValue?.value?.height ?? img?.height);
    const width = Number(img?.jsonValue?.value?.width ?? img?.width);
    const useDefaultDims = !height && !width;
    return {
      height: useDefaultDims ? 960 : height || 960,
      width: useDefaultDims ? 1280 : width || 1280,
    };
  };

  // Scroll the slider by a given offset
  const scrollSlider = useCallback((offset: number) => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += offset;
    }
  }, []);

  const sliderRight = useCallback(() => scrollSlider(120), [scrollSlider]);
  const sliderLeft = useCallback(() => scrollSlider(-120), [scrollSlider]);
  const sliderLeftRight = useCallback(
    (index: number) => {
      index <= currentIndex ? sliderLeft() : sliderRight();
    },
    [currentIndex, sliderLeft, sliderRight]
  );

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? lastIndex : prev - 1));
    sliderLeft();
  }, [lastIndex, sliderLeft]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === lastIndex ? 0 : prev + 1));
    sliderRight();
  }, [lastIndex, sliderRight]);

  // Keyboard accessibility handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      handlePrev();
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      handleNext();
      e.preventDefault();
    }
  };

  const handleThumbnailKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      setCurrentIndex(index);
      sliderLeftRight(index);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      const prev = index === 0 ? displayImages.length - 1 : index - 1;
      setCurrentIndex(prev);
      sliderLeftRight(prev);
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      const next = index === displayImages.length - 1 ? 0 : index + 1;
      setCurrentIndex(next);
      sliderLeftRight(next);
      e.preventDefault();
    }
  };

  // Focus management for thumbnails
  const thumbnailRefs = useRef<Array<HTMLLIElement | null>>([]);
  useEffect(() => {
    if (thumbnailRefs.current[currentIndex]) {
      // Prevent scroll when focusing thumbnail
      thumbnailRefs.current[currentIndex]?.focus({ preventScroll: true });
    }
  }, [currentIndex]);

  return (
    <div className="ChartwellContainer SectionPadding relative">
      <div className="px-4" ref={ref} tabIndex={0} aria-label="Image gallery carousel" onKeyDown={handleKeyDown} role="region">
        <button
          onClick={handlePrev}
          type="button"
          className="bg-ChartwellBlue p-1 md:p-2 rounded-full flex item-center justify-center md:hover:bg-ChartwellPlum duration-300 ease-in-out absolute top-1/2 -translate-y-1/2 left-1 xl:-left-2"
          aria-label="Previous image"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5 md:w-6 md:h-6 fill-ChartwellWhite" />
        </button>
        <InView as="div" className={`${inView ? "opacity-100" : "opacity-0"} ease-in-out duration-900`}>
          <div>
            <div className="relative min-h-[250px] sm:min-h-[360px] md:min-h-[420px] xl:min-h-[560px] w-full group">
              {displayImages.map((displayImage, index) => {
                const dims = getImageDimensions(displayImage);
                return (
                  <NextImage
                    key={index}
                    field={displayImage?.jsonValue ?? displayImage}
                    className={`absolute w-full h-full ease-in duration-500 object-cover object-center ${currentIndex === index ? "opacity-100" : "opacity-0"}`}
                    height={dims.height}
                    width={dims.width}
                    aria-hidden={currentIndex !== index}
                  />
                );
              })}
            </div>
          </div>
        </InView>
        <button
          onClick={handleNext}
          type="button"
          className="bg-ChartwellBlue p-1 md:p-2 rounded-full flex item-center justify-center md:hover:bg-ChartwellPlum duration-300 ease-in-out absolute top-1/2 -translate-y-1/2 right-1 xl:-right-2"
          aria-label="Next image"
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5 md:w-6 md:h-6 fill-ChartwellWhite" />
        </button>
      </div>
      <div className="w-full px-4">
        <ul
          ref={sliderRef}
          className="flex md:justify-center mt-2 overflow-y-hidden overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide gap-2"
          role="tablist"
          aria-label="Gallery thumbnails"
        >
          {displayImages.map((displayImage, index) => {
            const dims = getImageDimensions(displayImage);
            return (
              <li
                className={`relative min-h-[55px] min-w-[100px] w-full max-w-[120px] hover:border hover:border-ChartwellPlum cursor-pointer ${
                  currentIndex === index ? "border border-ChartwellPlum" : ""
                }`}
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  sliderLeftRight(index);
                }}
                tabIndex={0}
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                onKeyDown={(e) => handleThumbnailKeyDown(e, index)}
                role="tab"
                aria-selected={currentIndex === index}
                aria-label={`Go to image ${index + 1}`}
              >
                <NextImage
                  field={displayImage?.jsonValue ?? displayImage}
                  className="cursor-pointer absolute w-full h-full object-cover object-center"
                  height={dims.height}
                  width={dims.width}
                  aria-hidden={currentIndex !== index}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
