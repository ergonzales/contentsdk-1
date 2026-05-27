import Link from "next/link";
import { resolveHref } from "lib/helpers/utils/resolve-href";

interface IProps {
  residenceName: string;
  url: string;
  styles?: string;
  language: string;
}

export const ResidenceLink = ({ residenceName, url, styles, language }: IProps) => {
  const href = resolveHref(url);

  return (
    <li>
      {href ? (
        <Link rel="noreferrer" target={"_self"} className={` no-underline duration-300 ease-in-out hover:text-ChartwellBlue-200 ${styles}`} locale={language} href={href}>
          {residenceName}
        </Link>
      ) : (
        <span className={`duration-300 ease-in-out ${styles}`}>{residenceName}</span>
      )}
    </li>
  );
};
