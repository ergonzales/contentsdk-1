import { withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { useCallback, useEffect, useMemo, useState, JSX } from "react";
import Pdf from "../../../../../public/stories/pdfIcon/Pdf.svg";
import { useI18n } from "next-localization";
import { useRouter } from "next/router";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import LoadMore from "../ResourceList/LoadMore";
import Link from "next/link";

const Media = (props: any): JSX.Element => {
  const { t } = useI18n();
  const router = useRouter();

  const [mediaList, setMediaList] = useState<any[]>([]);
  // Use locale code for language state
  const [language, setLanguage] = useState(router.locale);
  const [selectYear, setSelectYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 10;

  const handleLoadMore = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const { MediaItems } = props.fields ?? {};
  const safeMediaItems = useMemo(() => (Array.isArray(MediaItems) ? MediaItems : []), [MediaItems]);

  // Sync language state with router.locale
  useEffect(() => {
    setLanguage(router.locale);
  }, [router.locale]);

  useEffect(() => {
    const filteredMediaList = safeMediaItems
      .filter((el: any) => {
        return el.fields?.Language?.value === language;
      })
      .filter((el: any) => {
        const isYearMatch = selectYear ? new Date(el.fields?.Date?.value ?? "").getFullYear().toString() === selectYear : true;
        return isYearMatch;
      })
      .sort((a: any, b: any) => new Date(b.fields?.Date?.value ?? "").getTime() - new Date(a.fields?.Date?.value ?? "").getTime());

    setMediaList(filteredMediaList);
    setTotalPages(Math.ceil(filteredMediaList.length / ITEMS_PER_PAGE));
  }, [selectYear, MediaItems, language, safeMediaItems]);

  // Use locale codes for dropdown values
  const languagesOption = useMemo(() => ["en", "fr"], []);
  const uniqueYears = useMemo(
    () => ["All", ...new Set(safeMediaItems.map((el: any) => new Date(el.fields?.Date?.value ?? "").getFullYear().toString()))].sort((a: string, b: string) => b.localeCompare(a)),
    [safeMediaItems]
  );
  const mediaPosts = useMemo(() => mediaList.slice(0, currentPage * ITEMS_PER_PAGE), [mediaList, currentPage]);

  return (
    <div className="ChartwellContainer SectionPadding  min-h-[400px]">
      <div className="flex items-center gap-4 sm:mb-4 md:mb-12">
        <label htmlFor="languageSelect" className="sr-only">
          {t("Select content by language")}
        </label>
        <select
          id="languageSelect"
          value={language}
          className="bg-ChartwellWhite border cursor-pointer border-ChartwellPlum rounded-lg p-1"
          onChange={(e) => {
            setLanguage(e.target.value);
          }}
        >
          {languagesOption.map((lang: string, index) => (
            <option key={index} className="rounded-lg" value={lang}>
              {t(lang)}
            </option>
          ))}
        </select>

        <label htmlFor="yearSelect" className="sr-only">
          {t("Select Year")}
        </label>
        <select id="yearSelect" className="bg-ChartwellWhite border cursor-pointer border-ChartwellPlum rounded-lg p-1" onChange={(e) => setSelectYear(e.target.value)}>
          <option selected value={"All"} disabled>
            {t("YearPlaceHolder")}
          </option>
          ;
          {uniqueYears?.map((year: string) => {
            return (
              <option key={year} value={year === "All" ? "" : year}>
                {year === "All" ? t(year) : year}
              </option>
            );
          })}
        </select>
      </div>
      <ul>
        {mediaPosts.map((el: any, index: number) => (
          <li className="mt-3 flex flex-col border-b border-ChartwellPlum w-full pb-2" key={index}>
            <span className="text-sm">{el.fields?.Date?.value?.substring(0, 4) ?? ""}</span>
            <Link
              locale={router.locale}
              className="md:flex justify-between text-[1.375rem] text-ChartwellPlum no-underline hover:text-ChartwellBlue-100 group"
              target="_blank"
              href={el.fields?.Link?.value?.href ?? "#"}
            >
              {el.fields?.Title?.value?.length > 100 ? el.fields.Title.value.substring(0, 100) + "..." : el.fields?.Title?.value ?? ""}
              {el.fields?.isDownloadLink?.value && (
                <svg width="30" height="40">
                  <image href={Pdf.src} width="30" height="30" />
                </svg>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {!mediaList.length && (
        <div className="flex items-center">
          <p className="text-ChartwellPlum text-[1.375rem] mr-4">{t("No Result")}</p>
          <SentimentVeryDissatisfiedIcon className="text-ChartwellPlum-100" />
        </div>
      )}
      <div>
        <LoadMore totalPages={totalPages} currentPage={currentPage} handleLoadMore={handleLoadMore} />
      </div>
    </div>
  );
};
export default withDatasourceCheck()(Media);
