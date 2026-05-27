// import hljs from "highlight.js/lib/common";
export const normalize = (s: string) => {
  return s
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "");
};

export const hasAny = (haystack: string, needles: string[]) => needles.some((k) => haystack.includes(normalize(k)));

// helpers/isCodeLike.ts
// helpers/isCodeLike.ts

// export function isCodeLike(text: string): boolean {
//   const codePatterns = [
//     /const |let |var /,
//     /function\s+\w+\(/,
//     /class\s+\w+/,
//     /<\w+>.*<\/\w+>/, // JSX / HTML
//     /\b(if|else|for|while|return|import|export)\b/,
//     /=>/,
//     /;|{|\}/,
//   ];
//   return codePatterns.some((r) => r.test(text));
// }
export function isCodeLike(text: string): boolean {
  const codePatterns = [
    /const |let |var /,
    /function\s+\w+\(/,
    /class\s+\w+/,
    /<\w+>.*<\/\w+>/, // JSX / HTML
    /\b(if|else|for|while|return|import|export)\b/,
    /=>/,
    /;|{|\}/,
  ];
  return codePatterns.some((r) => r.test(text));
}
