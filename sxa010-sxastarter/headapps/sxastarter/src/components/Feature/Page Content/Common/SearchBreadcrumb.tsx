import { JSX } from "react";
import Link from "next/link";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter } from "next/router";

type BreadcrumbElement = {
  title: string | null | undefined;
  href: string | null;
  highlight?: boolean;
  additionalClassnames?: string;
};

type SearchBreadcrumbProps = {
  elements: BreadcrumbElement[];
};

const SearchBreadcrumb = (props: SearchBreadcrumbProps): JSX.Element => {
  const router = useRouter();
  return (
    <div className="flex px-8 pt-10 pb-4">
      {props.elements.map((element, elementIndex: number) => {
        return (
          <div key={elementIndex} className="flex items-center">
            <Link key={elementIndex} href={element.href || ""} locale={router.locale} passHref>
              <div className={`${element.highlight ? "text-ChartwellPlum hover:text-ChartwellBlue-100" : "text-ChartwellGrey"} cursor-pointer capitalize ${element.additionalClassnames}`}>
                {element.title}
              </div>
            </Link>
            {elementIndex !== props.elements.length - 1 && (
              <div className="mx-2">
                <ArrowForwardIosIcon style={{ fontSize: "16px", color: "rgba(84,79,84,0.4)" }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SearchBreadcrumb;
