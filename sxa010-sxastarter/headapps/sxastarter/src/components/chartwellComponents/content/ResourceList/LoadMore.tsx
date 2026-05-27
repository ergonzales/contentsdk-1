import React from "react";
import { useI18n } from "next-localization";
interface LoadMoreProps {
  totalPages: number;
  currentPage: number;
  handleLoadMore: (page: number) => void;
}

const LoadMore: React.FC<LoadMoreProps> = React.memo(({ totalPages, currentPage, handleLoadMore }) => {
  const { t: dict } = useI18n();

  return (
    <>
      {currentPage < totalPages && (
        <button type="button" className="mt-8 block mx-auto border px-16 py-4 plum-on-clear-background" aria-label={dict("LoadMore")} onClick={() => handleLoadMore(currentPage + 1)}>
          <span>{dict("LoadMore")}</span>
        </button>
      )}
    </>
  );
});

LoadMore.displayName = "LoadMore";

export default LoadMore;
