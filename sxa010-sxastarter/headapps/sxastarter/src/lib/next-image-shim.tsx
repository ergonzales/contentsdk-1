import React from "react";

type ShimImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string | { src?: string };
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  loader?: unknown;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  unoptimized?: boolean;
};

const ALLOWED_IMG_ATTRIBUTES = new Set([
  "alt",
  "crossOrigin",
  "decoding",
  "draggable",
  "fetchPriority",
  "height",
  "id",
  "loading",
  "referrerPolicy",
  "role",
  "sizes",
  "slot",
  "src",
  "srcSet",
  "tabIndex",
  "title",
  "useMap",
  "width",
]);

const VALID_ATTRIBUTE_NAME = /^[A-Za-z][A-Za-z0-9:._-]*$/;

const isSafeImgAttribute = (key: string, value: unknown) => {
  if (value === undefined || value === null) return false;
  if (typeof value === "function" || typeof value === "symbol" || typeof value === "bigint") return false;
  if (typeof value === "object") return false;

  if (ALLOWED_IMG_ATTRIBUTES.has(key)) return true;
  if (key.startsWith("data-") || key.startsWith("aria-")) return true;

  return VALID_ATTRIBUTE_NAME.test(key) && key === key.toLowerCase();
};

const NextImageShim = ({
  src,
  alt = "",
  fill,
  style,
  className,
  priority: _priority,
  quality: _quality,
  sizes: _sizes,
  loader: _loader,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  unoptimized: _unoptimized,
  ...rest
}: ShimImageProps) => {
  const resolvedSrc = typeof src === "string" ? src : src?.src || "";

  const imgStyle: React.CSSProperties = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        ...(style || {}),
      }
    : { ...(style || {}) };

  const safeRest = Object.fromEntries(Object.entries(rest).filter(([key, value]) => isSafeImgAttribute(key, value)));

  return <img src={resolvedSrc} alt={alt} className={className} style={imgStyle} {...safeRest} />;
};

export default NextImageShim;
