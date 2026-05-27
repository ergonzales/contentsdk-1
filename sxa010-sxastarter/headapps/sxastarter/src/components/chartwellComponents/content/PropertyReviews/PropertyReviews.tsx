import { Field, withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { useState, useEffect, useCallback, JSX } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { useI18n } from "next-localization";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
// import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { SkeletonReviews } from "./SkelettonReviews";
import { findNestedValue } from "lib/helpers/helper";

type PropertyReviewsProps = ComponentProps & {
  fields: {
    data: {
      ds: {
        reviews: { jsonValue: Field<string> };
      };
      ci: any;
    };
    Heading: Field<string>;
    placeId: Field<string>;
  };
};

interface Review {
  user: {
    name: string;
  };
  date: string;
  rating: number;
  snippet: string;
  response?: {
    snippet: string;
  };
}

const PropertyReviews = (props: PropertyReviewsProps): JSX.Element => {
  // Extract placeId and Heading using the helper, with fallback order
  const placeId = props.fields?.placeId?.value || findNestedValue(props.fields?.data?.ci?.ancestors, "placeId");
  const Heading = props.fields?.Heading?.value || findNestedValue(props.fields?.data?.ci?.ancestors, "Heading");

  const { t } = useI18n();
  type SortByOption = { id: number; name: string; value: string };
  const sortByOption: SortByOption[] = [
    { id: 1, name: "newestFirst", value: t("NewestFirst") },
    { id: 2, name: "ratingHigh", value: t("RatingHigh") },
    { id: 3, name: "ratingLow", value: t("RatingLow") },
  ];

  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortBY, setSortBY] = useState<SortByOption>(sortByOption[0]);
  const [nextPageToken, setNextPageToken] = useState("");
  const [prevPageTokens, setPrevPageTokens] = useState<string[]>([""]);
  const [currentToken, setCurrentToken] = useState(0);
  const [errorNetwork, setErrorNetwork] = useState(false);
  const [errorToken, setErrorToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch reviews from API
  const fetchReviews = useCallback(
    async (pageToken = "") => {
      if (!placeId) return;
      setIsLoading(true);
      setErrorNetwork(false);
      setErrorToken(false);
      try {
        const queryParams = new URLSearchParams({
          place_id: placeId,
          sort_by: sortBY.name,
          next_page_token: pageToken,
        });
        const response = await fetch(`/api/v1/serpapi?${queryParams}`);
        if (!response.ok) throw new Error("Network response was not ok.");
        const data = await response.json();
        setReviews(data.reviews || []);
        setNextPageToken(data.serpapi_pagination?.next_page_token || "");
      } catch (err: any) {
        setErrorNetwork(err.message.includes("Network response was not ok."));
        setErrorToken(err.message.includes("next_page_token"));
      } finally {
        setIsLoading(false);
      }
    },
    [placeId, sortBY.name]
  );

  // Fetch reviews on mount and when dependencies change
  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchReviews, placeId, sortBY.name]);

  // Pagination handlers
  const handleNextPage = useCallback(() => {
    setPrevPageTokens((tokens) => [...tokens, nextPageToken]);
    setCurrentToken((token) => token + 1);
    fetchReviews(nextPageToken);
  }, [nextPageToken, fetchReviews]);

  const handlePrevPage = useCallback(() => {
    setCurrentToken((token) => token - 1);
    setPrevPageTokens((tokens) => {
      const newTokens = [...tokens];
      newTokens.pop();
      return newTokens.length ? newTokens : [""];
    });
    fetchReviews(prevPageTokens[currentToken - 1]);
    if (errorToken) setErrorToken(false);
  }, [prevPageTokens, currentToken, fetchReviews, errorToken]);

  const BTNStyle =
    "mt-8 block border px-6 md:px-16 py-3 md:py-4 duration-300 ease-in-out hover:text-ChartwellWhite hover:bg-ChartwellPlum focus:ring-indigo-600 text-ChartwellPlum border-ChartwellPlum";

  // Render star icons for rating
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => <StarIcon key={i} className={rating > i ? "text-yellow-400 h-8 w-8 flex-shrink-0" : "text-gray-300 h-8 w-8 flex-shrink-0"} aria-hidden="true" />);

  // Error state
  if (errorNetwork) {
    return (
      <div className="ChartwellContainer flex flex-col items-center">
        <p className="data-h3">{t("ReviewsIsNotAvailable")}</p>
        <ChartwellLink href={`https://www.google.com/maps/place/?q=place_id:${placeId}`} label={t("Google Reviews BTN")} target="blank" linkId="" />
      </div>
    );
  }

  // Main render
  return (
    <div className="ChartwellContainer SectionPadding ">
      <div className="w-full bg-cover bg-no-repeat bg-ChartwellWhite">
        <div className="ChartwellContainer">
          {Heading && <h1 className="text-[2rem] md:text-[2.625rem] mb-2 text-center">{Heading}</h1>}
          {reviews?.length === 0 || isLoading ? (
            <SkeletonReviews />
          ) : (
            <>
              <label htmlFor="sortBy" className="block ChartwellText">
                {t("SortBy")}
              </label>
              <div className="relative mt-2">
                <select
                  id="sortBy"
                  name="sortBy"
                  className="relative md:w-1/5 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={sortBY.id}
                  onChange={(e) => {
                    const selected = sortByOption.find((opt) => opt.id === Number(e.target.value));
                    if (selected) setSortBY(selected);
                  }}
                >
                  {sortByOption.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-8">
                {reviews.map((review: Review, index: number) => (
                  <div key={index} className="flow-root mt-6 bg-ChartwellWhite rounded-md shadow-md p-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 relative rounded-full flex items-center justify-center bg-ChartwellPlum">
                        <span className="ChartwellText font-bold uppercase text-ChartwellWhite">{review?.user?.name?.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="md:flex items-center gap-4">
                          <p className="bg-ChartwellWhite font-bold ChartwellText m-0">{review?.user?.name}</p>
                        </div>
                        <div className="mt-1 flex items-center">{renderStars(review.rating)}</div>
                        <p className="sr-only">{review.rating} out of 5 stars</p>
                      </div>
                    </div>
                    <div>
                      <p className="mt-4 space-y-6 ChartwellText">{review?.snippet}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="flex items-center gap-2 md:gap-4 justify-center">
            {prevPageTokens.length > 1 && currentToken !== 0 && !isLoading && (
              <button className={BTNStyle} onClick={handlePrevPage}>
                {t("Back")}
              </button>
            )}
            {nextPageToken && !errorToken && !isLoading && (
              <button className={BTNStyle} onClick={handleNextPage}>
                {t("Next")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
PropertyReviews.displayName = "PropertyReviews";
export default withDatasourceCheck()<PropertyReviewsProps>(PropertyReviews);
