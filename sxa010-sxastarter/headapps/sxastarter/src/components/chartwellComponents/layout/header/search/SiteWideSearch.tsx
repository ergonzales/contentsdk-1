import { JSX } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HeaderSearchInput } from "./HeaderSearchInput";
import { SearchItem } from "./SearchItem";
import { useI18n } from "next-localization";
export const SiteWideSearch = (): JSX.Element => {
  const [searchResults, setSearchResults]: any = useState([]);
  const [formateResult, setFormateResult]: any = useState([]);
  const [isLoading, setIsLoading]: any = useState(false);
  const [resultCount, setResultCount]: any = useState(0);
  const { t } = useI18n();

  const router = useRouter();
  const { q } = router.query;

  const siteSearchResultText = t("SiteSearchResultText")
    .replace("{searchtext}", q as string)
    .replace("{resultCount}", resultCount);
  const siteSearchResidenceResultText = t("SiteSearchResidenceResultText").replace("{searchtext}", q as string);
  const siteSearchReadMoreText = t("SiteSearchReadMoreText");
  const SiteSearchTryNewSearchText = t("SiteSearchTryNewSearchText");

  useEffect(() => {
    let ignore = false;
    const fetchResults = async () => {
      try {
        // if (q && q.length !== 0) {
        if (ignore) return;
        setIsLoading(true);
        const result = await (await fetch(`/api/v1/search?q=${q}&language=${router.locale}`)).json();
        setSearchResults(result?.data?.search?.results);
        setResultCount(result?.data?.search?.total);
        setIsLoading(false);
        // }
      } catch (error) {}
    };
    q && fetchResults();
    return () => {
      ignore = true;
    };
  }, [q, router.locale]);

  useEffect(() => {
    const newFormat = () => {
      setIsLoading(true);
      return searchResults.reduce((acc: { [x: string]: any[] }, obj: any) => {
        const template = obj.template.name;

        if (!acc[template]) {
          acc[template] = [];
        }
        acc[template].push(obj);

        return acc;
      }, {});
    };

    setFormateResult(newFormat());
    setIsLoading(false);
  }, [searchResults]);
  const secondGroup =
    formateResult &&
    Object.keys(formateResult).length !== 0 &&
    Object.values(formateResult)
      .filter((el: any) => el[0].template.name !== "PropertyChildPage")
      .flat();
  const PropertyPageGroup = formateResult && Object.keys(formateResult).length !== 0 && formateResult.PropertyChildPage;
  const skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <div className="ChartwellContainer  justify-center">
      <div className="flex flex-col justify-center">
        <h3 className="my-6 text-center">{SiteSearchTryNewSearchText}</h3>
        <HeaderSearchInput stylesInput="!block md:!w-[700px] lg:!w-[1000px]" stylesTitle="!hidden" />
      </div>
      {isLoading || q == undefined ? (
        <>
          <div className=" mt-10 px-12 pb-12  w-full">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-4 w-2/4 bg-ChartwellPlum-100 rounded"></div>
              </div>
            </div>
          </div>
          <>
            {skeleton.map((_, index) => {
              return (
                <div key={index} className=" px-16 pb-12  w-full">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-2 w-1/3 bg-ChartwellPlum-100 rounded"></div>
                      <div className="space-y-3">
                        <div className="h-2  bg-ChartwellPlum-100 rounded"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-2 w-20 bg-ChartwellBlue-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        </>
      ) : (
        <div>
          {searchResults && searchResults.length >= 0 && q !== undefined && <h2 className="mt-10">{siteSearchResultText}</h2>}
          {Object.keys(formateResult).length >= 0 && secondGroup && secondGroup.length >= 0 && (
            <div className="">
              <ul className="border-b p-4">
                {formateResult &&
                  Object.keys(formateResult).length !== 0 &&
                  secondGroup &&
                  secondGroup.length !== 0 &&
                  secondGroup.map((s: any) => {
                    return <SearchItem key={s.id} s={s} readmore={siteSearchReadMoreText} />;
                  })}
              </ul>
            </div>
          )}
          {Object.keys(formateResult).length >= 0 && PropertyPageGroup && PropertyPageGroup.length >= 0 && (
            <div>
              <h2 className="mt-10">{siteSearchResidenceResultText}</h2>
              <ul className="border-b p-4">
                {formateResult &&
                  Object.keys(formateResult).length !== 0 &&
                  PropertyPageGroup &&
                  PropertyPageGroup.length !== 0 &&
                  PropertyPageGroup.map((s: any) => {
                    return <SearchItem key={s.id} s={s} readmore={siteSearchReadMoreText} />;
                  })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SiteWideSearch;
