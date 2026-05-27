import { JSX } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export const SearchItem = ({ key, s, readmore }: { key: any; s: any; readmore: any }): JSX.Element => {
  const router = useRouter();
  const urlPath = s.url.path;
  const contentVal = s.Description?.value;

  return (
    <>
      <li key={key} className={` p-6 `}>
        <Link target="_self" href={urlPath} locale={router.locale} className="no-underline">
          <h3 className="text-left">{s?.Title?.value}</h3>
        </Link>
        {contentVal && <div className="m-0 mt-2 text-[1.125rem] text-left  mb-2" dangerouslySetInnerHTML={{ __html: `${contentVal}` }}></div>}
        <Link target="_self" href={urlPath} locale={router.locale} className="no-underline">
          {readmore}
        </Link>
      </li>
    </>
  );
};
