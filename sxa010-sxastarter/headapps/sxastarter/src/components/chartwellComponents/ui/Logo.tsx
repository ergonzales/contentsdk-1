import { JSX } from "react";
import { useRouter } from "next/router";
import { useId } from "react";
import Link from "next/link";
import Image from "next/image";
const defaultLogoSrc = "https://dam.chartwell.com/m/57a5a0b97a53083a/original/CHARTWELL_Logo.png";
const Logo = ({ styles = "", imgStyles = "", href = "/", src = defaultLogoSrc }: { styles?: string; imgStyles?: string; href?: string; src?: string; alt?: string }): JSX.Element => {
  const id = useId();
  const router = useRouter();
  const logoName = router.locale === "en" ? "Chartwell Retirement Residences" : "Résidences pour retraités Chartwell";
  return (
    <>
      <Link href={href} className={`${styles}`} locale={router.locale} passHref>
        <span className="sr-only">{logoName}</span>
        <Image width={150} height={10} className={`h-10 mx-2 w-150px ${imgStyles} md:mr-4`} alt={logoName} id={`CharwellLogo_${id}`} src={src} />
      </Link>
    </>
  );
};
export default Logo;
