import { JSX } from "react";
import { Field } from "@sitecore-content-sdk/nextjs";
import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  setNumber: number;
  onChange: (pageNumber: number) => void;
  onNext: () => void;
  onBack: () => void;
  backText: Field<string>;
  nextText: Field<string>;
  hasNext: boolean;
  hasBack: boolean;
};

const Pagination = (props: PaginationProps): JSX.Element => {
  const pageNumbers: number[] = [];
  // Determine the maximum number of pages to show based on the device type
  const maxPages = window.innerWidth < 1024;

  // Calculate the range of pages to show based on the current page
  const rangeStart = Math.max(1 + props.setNumber * 10, props.currentPage + props.setNumber * 10 - 1);
  const rangeEnd = Math.min(props.setNumber * 10 + props.totalPages, props.currentPage + props.setNumber * 10 + 2);

  // Add the page numbers to the list
  if (maxPages) {
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i);
    }
  } else {
    for (let i = props.setNumber * 10 + 1; i <= props.setNumber * 10 + props.totalPages; i++) {
      pageNumbers.push(i);
    }
  }

  // Calculate the previous and next page numbers based on the current page
  // const prevPage = props.currentPage > 1 ? props.currentPage - 1 : null;
  // const nextPage = props.currentPage < props.totalPages ? props.currentPage + 1 : null;
  interface PaginateButtonProps {
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    page: number;
  }

  // eslint-disable-next-line react/display-name
  const PaginateButton = React.forwardRef<HTMLAnchorElement, PaginateButtonProps>(({ onClick, page }, ref) => {
    return (
      <a
        className={`text-sm py-2 px-2 mx-2 hover:text-ChartwellPlum-70 hover:border-b-2 border-ChartwellPlum hover:border-ChartwellPlum-70 page-link ${
          page === props.currentPage + props.setNumber * 10 ? " text-ChartwellPlum border-b-2 border-ChartwellPlum" : "text-ChartwellPlum"
        }`}
        onClick={onClick}
        ref={ref}
      >
        {page}
      </a>
    );
  });
  return (
    <nav>
      <ul className="pagination flex flex-wrap justify-center xs:p-20 py-5">
        {props.hasBack || props.setNumber * 10 + props.currentPage != pageNumbers[0] ? (
          <li className="page-item">
            <button
              className="page-link hover:text-ChartwellPlum hover:border-b-2 font-semibold border-ChartwellPlum text-ChartwellPlum uppercase text-sm py-1 px-4"
              onClick={() => (props.setNumber * 10 + props.currentPage <= pageNumbers[0] ? props.onBack() : props.onChange(props.setNumber * 10 + props.currentPage - 1))}
            >
              {props.backText?.value}
            </button>
          </li>
        ) : (
          props.currentPage > 1 && <li className="text-ChartwellPlum-100 uppercase text-sm font-semibold xs:px-4 px-2 page-item self-end">{props.backText?.value}</li>
        )}
        {pageNumbers.map((page) => (
          <li key={page} className={`page-item${page === props.currentPage + props.setNumber * 10 ? " active " : ""}`}>
            <PaginateButton
              onClick={function (): void {
                props.onChange(page);
              }}
              page={page}
            />
          </li>
        ))}
        {props.hasNext || props.setNumber * 10 + props.currentPage != pageNumbers[pageNumbers.length - 1] ? (
          <li className="page-item ">
            <button
              className="hover:text-ChartwellPlum-70 font-semibold hover:border-b-2 border-ChartwellPlum text-ChartwellPlum uppercase text-sm py-1 px-4 page-link"
              onClick={() => (props.currentPage + props.setNumber * 10 == pageNumbers[pageNumbers.length - 1] ? props.onNext() : props.onChange(props.setNumber * 10 + props.currentPage + 1))}
            >
              {props.nextText?.value}
            </button>
          </li>
        ) : (
          props.hasNext && <li className="text-ChartwellPlum-100 uppercase font-semibold text-sm px-4 page-item self-end">{props.nextText?.value}</li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
