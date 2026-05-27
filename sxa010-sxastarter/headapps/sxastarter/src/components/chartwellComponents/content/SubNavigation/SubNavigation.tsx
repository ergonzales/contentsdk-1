import { Field, LinkField } from "@sitecore-content-sdk/nextjs";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { ComponentProps } from "lib/component-props";
import Link from "next/link";

type LinkItem = {
  fields: {
    CTALink: LinkField;
  };
};

type IProps = ComponentProps & {
  fields: {
    Links: LinkItem[];
    ["Background Image"]?: Field<{ src: string }>;
    ["Background Color"]?: Field<string>;
  };
};

const normalizePath = (url?: string) => {
  if (!url) return "";
  // drop query/hash, remove trailing slash except root
  const noHash = url.split("#")[0].split("?")[0];
  return noHash !== "/" ? noHash.replace(/\/+$/, "") : "/";
};

const SubNavigation = ({ fields }: IProps) => {
  const router = useRouter();

  const links = fields?.Links;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = useState<{ width: number; left: number }>({
    width: 0,
    left: 0,
  });

  // console.log();

  //   // index based on current page
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  //   // index used while hovering/focusing
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  //   const activeIndex = hoverIndex ?? currentIndex;

  const updateIndicator = (index: number) => {
    if (!containerRef.current) return;

    const item = containerRef.current.querySelector<HTMLLIElement>(`li[data-index="${index}"]`);
    if (!item) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    setIndicator({
      width: itemRect.width,
      left: itemRect.left - containerRect.left,
    });
  };

  useEffect(() => {
    const currentPath = normalizePath(router.asPath);
    const foundIndex = links.findIndex((link) => {
      const linkHref = normalizePath(link.fields.CTALink?.value?.href);
      return linkHref === currentPath;
    });
    setCurrentIndex(foundIndex !== -1 ? foundIndex : 0);
    updateIndicator(foundIndex !== -1 ? foundIndex : 0);
  }, [router.asPath, links]);

  useEffect(() => {
    // Initialize indicator to first item
    updateIndicator(hoverIndex ?? currentIndex ?? 0);
  }, [currentIndex, hoverIndex]);

  if (!links.length) return null;

  return (
    <div className={`w-full bg-no-repeat bg-cover  overflow-hidden py-6`}>
      <nav ref={containerRef} className="ChartwellContainer relative py-4">
        {/* Base grey line */}
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-ChartwellGrey-200 hidden md:block" />

        {/* Animated indicator */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 translate-y-1/2 h-[4px] rounded-full bg-ChartwellPlum transition-all duration-500 ease-out hidden md:block"
          style={{
            width: `${indicator.width}px`,
            left: `${indicator.left}px`,
          }}
        />

        <ul className="relative flex flex-wrap items-center justify-center  gap-y-3 text-xs sm:text-sm md:text-base">
          {links.map((link, index) => {
            // const isActive = index === activeIndex;

            return (
              <li
                key={index}
                data-index={index}
                className="relative z-10 text-center first:border-r border-ChartwellGrey-200"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                onFocus={() => setHoverIndex(index)}
                onBlur={() => setHoverIndex(null)}
                // onClick={() => setCurrentIndex(index)}
              >
                <Link
                  target={link.fields.CTALink?.value?.target}
                  aria-label={link.fields.CTALink?.value?.text}
                  title={link.fields.CTALink?.value?.text}
                  locale={router.locale}
                  href={link.fields.CTALink?.value?.href || ""}
                  className={`inline-block uppercase py-2 px-6  ease-in-out no-underline duration-300 !rounded-md font-semibold  ${
                    hoverIndex === index ? "text-ChartwellGrey  hover:text-ChartwellPlum scale-105 -translate-y-1 -translate-x-1" : "text-ChartwellGrey "
                  } ${currentIndex === index ? "!text-ChartwellPlum bg-ChartwellWhite" : ""} `}
                >
                  {link.fields.CTALink?.value?.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SubNavigation;
