import { Birthstone, Kumbh_Sans, Open_Sans } from "next/font/google";

const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  weight: ["100", "300", "400", "600", "700", "800"],
  display: "swap",
  variable: "--font-kumbh-sans",
});

const birthstone = Birthstone({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-birthstone",
});

const openSans = Open_Sans({
  subsets: ["latin", "latin-ext", "greek", "greek-ext", "cyrillic", "cyrillic-ext", "vietnamese"],
  weight: ["300", "400", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-open-sans",
});

/** Apply on app root wrapper so SCSS can use --chartwell-*-fonts via .cw-font-vars in global.css */
export const chartwellFontClassNames = `${kumbhSans.variable} ${birthstone.variable} ${openSans.variable} cw-font-vars`;
