import { useEffect, JSX } from "react";

interface EmbedComponentProps {
  fields?: {
    "javascript src"?: { value: string };
    javascript?: { value: string };
    "html code"?: { value: string };
  };
}

const EmbedComponent = (props: EmbedComponentProps): JSX.Element => {
  const extractAttributesFromHTML = (html: string): { classMatch?: string } => {
    const divMatch = html.match(/<div[^>]*>/);
    if (!divMatch) return {};

    const classMatch = divMatch[0].match(/class=["']([^"']+)["']/);

    return {
      classMatch: classMatch?.[1],
    };
  };

  const { classMatch } = extractAttributesFromHTML(props.fields?.["html code"]?.value ?? "");

  useEffect(() => {
    if (classMatch?.startsWith("embedsocial-hashtag")) {
      const script = document.createElement("script");
      script.src = "https://embedsocial.com/cdn/ht.js";
      script.async = true;
      script.onload = () => {
        if ((window as any).EmbedSocial?.load) {
          (window as any).EmbedSocial?.load?.();
        }
      };
      document.head.appendChild(script);
    }
    const targetDiv = document.querySelector("#embeddedContentDiv");
    const src = document.querySelector("#ScriptSrc");
    const inline = document.querySelector("#InlineSrc");
    try {
      src && targetDiv?.removeChild(src);
      inline && targetDiv?.removeChild(inline);
    } catch {}
    if (props?.fields?.["javascript src"]?.value) {
      const scriptContent = document.createElement("script");
      scriptContent.src = props?.fields?.["javascript src"]?.value;
      scriptContent.id = "ScriptSrc";
      scriptContent.defer = true;
      targetDiv?.appendChild(scriptContent);
    }
    if (props?.fields?.javascript?.value) {
      const scriptContent = document.createElement("script");
      scriptContent.innerHTML = props?.fields?.javascript?.value;
      scriptContent.id = "InlineSrc";
      targetDiv?.appendChild(scriptContent);
    }
  }, [classMatch, props.fields]); // Only re-run when fields change

  return (
    <div className="ChartwellContainer SectionPadding  relative w-full" id="embeddedContentDiv">
      <div dangerouslySetInnerHTML={{ __html: props?.fields?.["html code"]?.value ?? "" }}></div>
    </div>
  );
};

export default EmbedComponent;
