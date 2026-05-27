import Link from "next/link";
import { useRouter } from "next/router";
import { NextImage } from "@sitecore-content-sdk/nextjs";
export const PropertyLogoHomeName = ({ logo, href, title }: { logo: { value: object }; href: string; title: string }) => {
  const router = useRouter();

  return (
    <Link href={`${href}`} locale={router.locale} passHref title={title}>
      <div className="relative block ">
        <NextImage height={30} width={250} field={logo?.value} />
      </div>
    </Link>
  );
};
