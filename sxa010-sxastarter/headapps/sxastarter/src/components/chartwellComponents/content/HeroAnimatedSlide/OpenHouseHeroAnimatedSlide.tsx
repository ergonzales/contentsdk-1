import React from "react";

interface HeroAnimatedSlideProps {
  animation?: string;
  slideAnimatedText?: string[];
  slideStaticText?: string;
  ctaLink?: any;
  Tag?: any;
  isQuebec?: boolean;
  linkTargetHref?: string;
  bkgImage?: any;
}

const OpenHouseHeroAnimatedSlide: React.FC<HeroAnimatedSlideProps> = ({ animation, slideAnimatedText, slideStaticText, ctaLink, Tag, isQuebec, linkTargetHref, bkgImage }) => {
  // Helper to inject class if <span> is present
  function renderWordWithClass(word: string, index: number) {
    // If the word contains a <span>, animate only the span content, keep the rest static
    const frSpanMatch = word.match(/^(.*)?<span[^>]*>(.*?)<\/span>(.*)?$/i);
    if (frSpanMatch) {
      const before = frSpanMatch[1] || "";
      const inside = frSpanMatch[2] || "";
      const after = frSpanMatch[3] || "";
      return (
        <>
          {before}
          <span key={index} className="openhouseanimation">
            {animateLetters(inside)}
          </span>
          {after ? after + " " : " "}
        </>
      );
    }
    return word + " "; // Add space back after each word
  }

  function animateLetters(text: string) {
    return text.split("").map((char, i) => (
      <span className="letter" style={{ animationDelay: `${i * 0.08}s` }} key={i}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  }

  const elementID = animation ? "#" + animation?.toLowerCase().replace(/\s/g, "") : "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;500;700&display=swap');

        /* --- Animation Keyframes and General Styles --- */
        @keyframes kenBurns {
            0% { filter: blur(4px); transform: translateX(-5%) scale(1.05); }
            100% { filter: blur(0px); transform: translateX(0) scale(1); }
        }
        @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
        @keyframes blurFadeIn {
            0% { filter: blur(5px); }
            100% { filter: blur(0px); }
        }
        @keyframes backgroundFadeIn {
            0% { background-color: rgba(255, 200, 150, 0); }
            100% { background-color: rgba(240, 103, 104, 1); }
        }
        @keyframes backgroundFadeInOrange {
            0% { background-color: rgba(243, 137, 51, 0); transform: rotateZ(0deg); opacity: 0; }
            10% { background-color: rgba(243, 137, 51, 0.8); transform: rotateZ(2deg); opacity: 0.15; }
            20% { background-color: rgba(243, 137, 51, 0.8); transform: rotateZ(-2deg); opacity: 0.3; }
            30% { background-color: rgba(243, 137, 51, 0.8); transform: rotateZ(1.5deg); opacity: 0.45; }
            40% { background-color: rgba(243, 137, 51, 0.8); transform: rotateZ(-1.5deg); opacity: 0.6; }
            50% { background-color: rgba(243, 137, 51, 0.8); transform: rotateZ(1deg); opacity: 0.7; }
            60% { background-color: rgba(243, 137, 51, 0.8); transform: rotateZ(-1deg); opacity: 0.8; }
            70% { background-color: rgba(243, 137, 51, 0.8); transform: rotateZ(0.5deg); opacity: 0.9; }
            80% { background-color: rgba(243, 137, 51, 0.8); transform: rotateZ(-0.5deg); opacity: 0.95; }
            100% { background-color: rgba(243, 137, 51, 0.8); transform: rotateZ(0deg); opacity: 1; }
        }
        @keyframes backgroundBalanceOrange {
            0% { transform: rotateZ(0deg); }
            2% { transform: rotateZ(2deg); }
            4% { transform: rotateZ(-2deg); }
            6% { transform: rotateZ(1.5deg); }
            8% { transform: rotateZ(-1.5deg); }
            10% { transform: rotateZ(1deg); }
            12% { transform: rotateZ(-1deg); }
            14% { transform: rotateZ(0.5deg); }
            16% { transform: rotateZ(-0.5deg); }
            18% { transform: rotateZ(0deg); }
            100% { transform: rotateZ(0deg); }
        }
        @keyframes shrinkFadeIn {
            0% { transform: scale(3); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        @keyframes letterFadeIn {
            to { opacity: 1; }
        }
        @keyframes fade-in-focus {
            0% { opacity: 0; filter: blur(0px); transform: scale(0.95); text-shadow: none; }
            60% { filter: blur(10px); }
            99% { text-shadow: none; }
            100% { opacity: 1; filter: blur(0); transform: scale(1.0); text-shadow: 0 0 5px rgba(0, 0, 0, 0.5); }
        }
        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        /* --- Layout and Responsive Styles --- */
        .hero, .scene-container {
            position: relative;
            height: 65vh;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-left: 3rem;
            padding-top: 2rem;
        }
        .scene-container {
            width: 100vw;
            height: 360px;
            overflow: hidden;
        }
        .background-image {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image: url('${bkgImage?.url || ""}');
            background-size: cover;
            background-position: center;
            z-index: 1;
        }
        .hero-image { position: absolute; top: 0; left: 0; width: 110%; height: 110%; object-fit: cover; object-position: center; z-index: 1; }
        .background-image { display: none !important; }

        .staticText, .delight-text-container {
            z-index: 2; text-align: left; color: white; padding: 1rem 3rem; flex-basis: 50%;
        }
        ${elementID} .delight-text-container { text-align: right; }
        .staticText h3 { font-size: 6vh; color: white; font-weight: 400; margin: 0; text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.45); }
        .staticText p { font-size: 3.5vh; margin: 0; font-weight: 300; text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.45); }

        @media screen and (max-width: 1024px) {
            .staticText, .delight-text-container { padding: 1rem; flex-basis: 100%; }
            .staticText h3, .staticText p { font-size: 4vh; }
            ${elementID} #SlideText { font-size: 4vh !important; }
        }
        @media screen and (max-width: 767px) {
            .staticText, .delight-text-container { padding: 1rem; flex-basis: 100%; }
            .staticText h3 { font-size: 4vh; }
            .staticText p { font-size: 2.5vh; }
        }
        @media screen and (max-width: 479px) {
            .staticText, .delight-text-container { padding: 1rem; flex-basis: 100%; }
            .staticText h3 { font-size: 2.5vh; }
            .staticText p { font-size: 1.5vh; }
            ${elementID} #SlideText { font-size: 2.5vh !important; }
        }

        /* --- Animation and Text Styles --- */
        .openhouseanimation { white-space: nowrap; }
        .openhouseanimation .letter { opacity: 0; display: inline-block; animation: letterFadeIn 0.4s forwards; }

        #openhouse.scene-container.open-house {
            background-image: url('${bkgImage?.url || ""}') !important;
            background-size: cover;
            background-position: center;
            overflow: hidden;
            position: relative;
            display: block;      
            padding: 0 !important;
            margin: 0 !important;
            ${ctaLink?.href ? `cursor: pointer;` : ""}
        }
        html[lang="fr"] #openhouse.scene-container.open-house, #openhouse.scene-container.open-house.quebec { background-position: center 33%; }

        .heroContentContainer {
            background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.0) 100%);
        }

        @media (min-width: 640px) { .scene-container, .background-image { height: 60vh; } }
        @media (min-width: 768px) { .scene-container, .background-image { height: 70vh; } }
        @media (min-width: 1024px) { .scene-container, .background-image { height: 70vh; } }
        @media (min-width: 1280px) { .scene-container, .background-image { height: 70vh; } }

        .inviting-copy {
            color: #FFFFFF; font-size: 9vw; font-weight: 700; margin-bottom: 50px; line-height: 1.3; display: block; height: auto; position: static; background-color: transparent !important;
        }
        @media (min-width: 640px) { .inviting-copy { font-size: 8vw; } }
        @media (min-width: 768px) { .inviting-copy { font-size: 6vw; } }
        @media (min-width: 1024px) { .inviting-copy { font-size: 5vw; } }
        @media (min-width: 1280px) { .inviting-copy { font-size: 4vw; } }

        .inviting-copy .word:nth-child(1) { animation-delay: 0.2s; }
        .inviting-copy .word:nth-child(2) { animation-delay: 0.4s; }
        .inviting-copy .word:nth-child(3) { animation-delay: 0.6s; }
        .inviting-copy .word:nth-child(4) { animation-delay: 0.8s; }
        .inviting-copy .word:nth-child(5) { animation-delay: 1.0s; }
        .inviting-copy .word:nth-child(6) { animation-delay: 1.2s; }
        .inviting-copy .word:nth-child(7) { animation-delay: 1.4s; }
        .inviting-copy .word:nth-child(8) { animation-delay: 1.6s; }
        .inviting-copy .word:nth-child(9) { animation-delay: 1.8s; }
        .inviting-copy .word:nth-child(10) { animation-delay: 2.0s; }
        .inviting-copy .word:nth-child(11) { animation-delay: 2.2s; }
        .inviting-copy .word:nth-child(12) { animation-delay: 2.4s; }
        .inviting-copy .word:nth-child(13) { animation-delay: 2.6s; }
        .inviting-copy .word:nth-child(14) { animation-delay: 2.8s; }
        .inviting-copy .word:nth-child(15) { animation-delay: 3.0s; }
        .inviting-copy .word:nth-child(16) { animation-delay: 3.2s; }

        .cta-button {
            display: inline-block; padding: 15px 15px; text-decoration: none; font-size: 5vw; font-weight: 700; color: #FFFFFF; position: relative; overflow: hidden; background-color: rgba(140, 19, 96, 0.5); border: rgba(140, 19, 96, 0.25); border-radius: 60px !important; transition: background-color 0.3s; opacity: 0; transform: scale(0.95); animation: fade-in-focus 2s ease-out forwards; animation-delay: 1.8s;
        }
        .cta-button:hover { background-color: rgb(140, 19, 96); color: white; }
        @media (min-width: 640px) { .cta-button { font-size: 4.5vw; padding: 15px 30px; } }
        @media (min-width: 768px) { .cta-button { font-size: 4vw; padding: 15px 45px; } }
        @media (min-width: 1024px) { .cta-button { font-size: 2.75vw; padding: 15px 45px; } }
        @media (min-width: 1280px) { .cta-button { font-size: 2vw; padding: 15px 45px; } }

        .cta-button .ripple { position: absolute; border-radius: 50%; transform: scale(0); animation: ripple 0.6s linear; background-color: rgba(255, 255, 255, 0.5); pointer-events: none; z-index: 1; }
        @media (hover: hover) and (pointer: fine) { .cta-button:hover .ripple { animation: ripple 0.6s linear; } }
        @media (hover: none) and (pointer: coarse) { .cta-button:active .ripple { animation: ripple 0.6s linear; } }

        ${elementID} #SlideText { line-height: 1; font-size: 4.5vh; font-weight: 600; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); opacity: 0; animation: fadeIn 2s ease-in-out 0.75s forwards; }
        ${elementID} #SlideText span span { background-color: rgb(151, 1, 96); padding: 0.25em 0.025rem; display: inline-block; width: fit-content; margin-left: auto; margin-right: auto; line-height: 1; white-space: nowrap; opacity: 0; animation: fadeIn 2s ease-in-out 0.75s forwards; }
        ${elementID} #SlideText span span:first-child { padding: 0.25em 0.025em 0.25em 0.25em; }
        ${elementID} #SlideText span span:last-child { padding: 0.25em 0.25em 0.25em 0.025em; }

        #openhouse .cta-button { display: none }
        .hero-content p { font-size: 1.5rem; margin-bottom: 1.5rem; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); }
      `}</style>
      <div className="flex relative" style={{ maxWidth: "100vw", overflowX: "hidden" }}>
        <div
          className={`scene-container ${(animation || "").toLowerCase().replace(/\s/g, "-")} flex content-end ${isQuebec ? "quebec" : ""}`}
          id={elementID ? elementID.substring(1) : undefined}
          onClick={() => {
            if (linkTargetHref) self.location.href = linkTargetHref;
          }}
        >
          <div className="flex flex-row w-full content-end heroContentContainer">
            {slideStaticText && <div className="staticText" dangerouslySetInnerHTML={{ __html: slideStaticText || "" }}></div>}
            <div className="delight-text-container flex justify-end items-center">
              {animation &&
                React.createElement(
                  Tag || "h1",
                  { className: "inviting-copy", id: "SlideText" },
                  (slideAnimatedText || []).map((word: string, index: number) => renderWordWithClass(word, index))
                )}
              {/* {animation !== "Joy is ageless fade in" && (
                <a href="#" className="cta-button">
                  {ctaText}
                </a>
              )}
              {animation === "Joy is ageless fade in" && React.createElement(Tag || "h1", { className: "inviting-copy", id: "SlideText", dangerouslySetInnerHTML: { __html: slideTextRaw || "" } })} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default OpenHouseHeroAnimatedSlide;
