import { Field, LinkField } from "@sitecore-content-sdk/nextjs";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { useRouter } from "next/router";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";
import { StarIcon } from "@heroicons/react/20/solid";
import { useState, useEffect, useMemo } from "react";
import { useI18n } from "next-localization";

interface PropertyTestimonialProps {
  Title?: Field<string>;
  CTAText: {
    value: string;
  };
  CTALink: LinkField;
  place_id: string;
  propsReviews?: {
    value: string;
  };
}
interface Review {
  id: string;
  author_name: string;
  profile_photo_url: string;
  rating: number;
  text: string;
  time: number;
}

export const PropertyTestimonialSection = ({ place_id, Title, CTAText, CTALink, propsReviews }: PropertyTestimonialProps) => {
  const rout = useRouter();
  const { t } = useI18n();
  const [currentReviews, setCurrentReviews] = useState(0);
  const [reviews, setReviews] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const isHomePage = rout.asPath === "/";

  const reviewsData = useMemo(() => {
    if (!place_id || isHomePage || !propsReviews?.value) return [];

    const reviewsFromJson = propsReviews?.value ? JSON.parse(propsReviews?.value) : [];

    return reviewsFromJson;
  }, [place_id, isHomePage, propsReviews?.value]);

  useEffect(() => {
    setReviews(reviewsData);
  }, [reviewsData, setReviews]);

  const headingLvl = { value: "h2" as string } as Field<string>;
  const headingTitle = { value: Title?.value as string } as Field<string>;

  return reviews?.Reviews?.length ? (
    <div className="ChartwellContainer SectionPadding ">
      {Title && <HeadingLevel headingLevel={headingLvl} titleText={headingTitle} styles="text-center lg:text-right lg:pr-56px pb-8" />}
      <div className={`relative md:grid grid-cols-3 `}>
        <div className=" col-span-1">
          <div className="mt-3  flex flex-col justify-center items-center">
            <div className=" flex flex-col justify-center items-center bg-ChartwellPlum shadow-ChartwellPlum-100 shadow-md p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-ChartwellWhite text-[1.6rem] md:text-[2.4rem]">{reviews?.Rating}</span>
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon key={rating} className={classNames(reviews?.Rating > rating ? "text-yellow-400" : "text-gray-300", "h-8 w-8 md:h-12 md:w-12 flex-shrink-0")} aria-hidden="true" />
                ))}
              </div>
              <p className="sr-only">{reviews?.rating} out of 5 stars</p>
              <p className="ml-2 ChartwellText text-ChartwellWhite">{t("BasedOnReviews").replace("{amount}", reviews?.UserRatingsTotal)}</p>
            </div>
            <ChartwellLink
              href={CTALink?.value?.href}
              label={`${CTAText?.value}`}
              target="self"
              linkId={CTALink?.value?.id as string}
              tailwindStyles={` p-2 md:text-[1.0625rem] text-[0.875rem] !mt-10 lg:!mt-12 duration-300 !border-ChartwellPlum white-on-plum-background`}
            />
          </div>
        </div>
        <div className="col-span-2 relative">
          <h3 className="sr-only">Recent reviews</h3>
          <div
            className={`flow-root mt-6 md:mt-0 ${isOpen && " overflow-y-scroll scrollbar-hide"}  relative bg-ChartwellWhite rounded-md shadow-md p-4 overflow-hidden min-h-[500px] md:min-h-[400px] `}
          >
            <div className={`absolute ${isOpen && "hidden"} z-20 bottom-4 left-[50%] translate-x-[-50%] flex items-center gap-4`}>
              {reviews?.Reviews?.length > 1 &&
                reviews.Reviews?.map((review: any, index: any) => {
                  return (
                    <button
                      key={`${review.id}-${index}`}
                      onClick={() => {
                        setCurrentReviews(index);
                      }}
                      type="button"
                      className={`block w-4 h-4 rounded-full  ${currentReviews === index ? "bg-ChartwellPlum" : "bg-ChartwellPlum-40"} hover:bg-ChartwellPlum focus:bg-ChartwellPlum `}
                    >
                      <span className="sr-only">Next</span>
                    </button>
                  );
                })}
            </div>

            <div className=" mt-8 md:mt-0">
              {reviews.Reviews?.sort((a: any, b: any) => b.time - a.time).map((review: Review, index: number) => {
                const dateObject = new Date(review?.time * 1000);
                const year = dateObject.getFullYear();
                const month = dateObject.getMonth() + 1;
                const date = dateObject.getDate();

                return (
                  <div
                    key={`${review.id}-${index}`}
                    className={`p-2 absolute  ${
                      index === currentReviews ? "translate-x-[0] opacity-100 " : `${index < currentReviews ? " translate-x-[-100%]" : "translate-x-[100%]"} opacity-0`
                    } duration-500 ease-in-out`}
                  >
                    <div className="flex items-center">
                      <div className=" w-12 h-12 relative rounded-full flex items-center justify-center bg-ChartwellPlum">
                        <span className="ChartwellText font-bold uppercase text-ChartwellWhite">{review.author_name.split("")[0]}</span>{" "}
                      </div>
                      <div className="ml-4">
                        <div className="md:flex items-center gap-4">
                          <p className="text-sm font-bold ChartwellText m-0">{review.author_name}</p>
                          <span className="ChartwellText">{`${year}-${month}-${date}`}</span>
                        </div>

                        <div className="mt-1 flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon key={rating} className={classNames(review.rating > rating ? "text-yellow-400" : "text-gray-300", "h-8 w-8 flex-shrink-0")} aria-hidden="true" />
                          ))}
                        </div>
                        <p className="sr-only">{review.rating} out of 5 stars</p>
                      </div>
                    </div>
                    <div className="block lg:hidden">
                      <p className="mt-4 space-y-6 ChartwellText">{review.text.length < 300 ? review?.text : ` ${isOpen ? review.text : review.text.substring(0, 300) + "..."}`}</p>
                      {review.text.length > 300 && (
                        <button onClick={() => setIsOpen(!isOpen)} type="button" aria-label={t("SiteSearchReadMoreTextAriaLabel")} className="ChartwellText text-ChartwellBlue">
                          {!isOpen ? ` ${t("ReadMore")}` : `${t("ReadLess")}`}
                        </button>
                      )}
                    </div>
                    <div className=" hidden lg:block">
                      <p className="mt-4 space-y-6 ChartwellText">
                        {review?.text?.length < 800 ? review.text : ` ${isOpen ? review.text : review.text.substring(0, 800) + "..."}`}
                        {review?.text?.length > 800 && (
                          <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="ChartwellText text-ChartwellBlue hover:text-ChartwellBlue-100 focus:text-ChartwellBlue-100"
                            aria-label={t("SiteSearchReadMoreTextAriaLabel")}
                          >
                            {!isOpen ? ` ${t("ReadMore")}` : `${t("ReadLess")}`}
                          </button>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
