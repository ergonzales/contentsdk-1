import { JSX } from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const BlogResourceCard = (props: any): JSX.Element => {
  const router = useRouter();
  const cardImg = props?.props?.fields?.Image?.value;
  const cardType = props?.props?.fields?.CardType?.name;
  const cardPadding = props?.props?.fields?.CardType?.name === "Generic Card" ? "p-[3rem]" : "p-0";
  let FormHTML = props?.props?.fields["Form HTML"]?.value;
  FormHTML = FormHTML && FormHTML.replace(/~~eloqua..type--([\s\S]+?)~~/g, "");
  const [msgContainerClass, setMsgContainerClass] = useState("hidden");
  const ValidateField = useCallback(
    (ele: any) => {
      const validationDetails = [
        {
          name: "email",
          pattern: /(^[A-Z0-9!#\$%&'\*\+\-\/=\?\^_`\{\|\}~][A-Z0-9!#\$%&'\*\+\-\/=\?\^_`\{\|\}~\.]{0,62}@(([A-Z0-9](?:[A-Z0-9\-]{0,61}[A-Z0-9])?)(\.[A-Z0-9](?:[A-Z0-9\-]{0,61}[A-Z0-9])?)+)$)/i,
          length: 100,
          message: {
            en: "A valid email address is required",
            fr: "Entrez une adresse de courriel valide",
          },
        },
        {
          name: "required",
          pattern: /^$|^\s$/g,
          length: 100,
          message: {
            fr: "Ce champ est requis",
            en: "This field is required",
          },
        },
        {
          name: "minlength",
          pattern: /^.{2,}$/,
          length: 2,
          message: {
            fr: "Pas assez de lettres",
            en: "Not enough letters",
          },
        },
        {
          name: "maxlength",
          pattern: /^.{35,}$/,
          length: 35,
          message: {
            fr: "Limite de caractères atteinte",
            en: "Character limit reached",
          },
        },
        {
          name: "alphanumeric",
          pattern: /[^a-zA-ZÀ-ÿ\s\'\-\.\"\_\(\)]+/g,
          length: 100,
          message: {
            fr: "Des lettres seulement s'il vous plaît",
            en: "Letters only please",
          },
        },
        {
          name: "nohtml",
          pattern: /(<([^>]+)>)/gi,
          length: 100,
          message: {
            fr: "Ne pas inclure de codes HTML",
            en: "Value must not contain any HTML",
          },
        },
        {
          name: "nourl",
          pattern: /(telnet|ftp|https?):\/\/(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.|[a-z0-9]\.)+[a-z]{2,63}/i,
          length: 100,
          message: {
            fr: "Ne pas inclure de lien URL",
            en: "Value must not contain any URL's",
          },
        },
      ];
      const validationsForField = ele.getAttribute("data-validation").split(",") || null;
      if (ele.parentElement.querySelector(".errorMsg")) {
        ele.parentElement.querySelector(".errorMsg").innerHTML = "";
      }
      ele.setAttribute("data-valid", "");
      validationsForField.map((rule: string) => {
        const validateAgainst = validationDetails.find((index) => index.name === rule);
        let isMatch = false;
        if (ele.getAttribute("type") == "radio") {
          const ename = ele.getAttribute("name");
          isMatch = document.querySelector('input[name="' + ename + '"]:checked') ? true : false;
        } else {
          if (rule != "minlength" && rule != "maxlength") {
            isMatch = ele.value.match(validateAgainst?.pattern);
            isMatch = rule !== "email" ? !isMatch : isMatch; //for emails we want a positive match, for everything else we want negatives
          } else {
            if (rule == "minlength" && validateAgainst?.length && ele.value.length < validateAgainst?.length) {
              isMatch = true;
            }
            if (rule == "maxlength" && validateAgainst?.length && ele.value.length > validateAgainst?.length) {
              isMatch = true;
            }
            isMatch = !isMatch;
          }
        }

        //console.log("validation", ele.value, ele.id, validateAgainst?.name, isMatch, ele.getAttribute("type") == "radio");
        if (!isMatch) {
          const newErrorDiv = document.createElement("div");
          newErrorDiv.classList.add("errorMsg");
          if (ele.getAttribute("type") != "radio" && ele.parentElement.querySelectorAll(".errorMsg").length < 1) {
            ele.parentElement.appendChild(newErrorDiv);
          }
          if (ele.getAttribute("type") == "radio" && ele.parentElement.parentElement.parentElement.querySelectorAll(".errorMsg").length < 1) {
            ele.parentElement.parentElement.parentElement.appendChild(newErrorDiv);
          }
          const errorDiv = ele.getAttribute("type") != "radio" ? ele.parentElement.querySelector(".errorMsg") : ele.parentElement.parentElement.parentElement.querySelector(".errorMsg");
          errorDiv.innerHTML = router.locale == "en" ? validateAgainst?.message.en : validateAgainst?.message.fr;

          ele.setAttribute("data-valid", false);
        } else {
          if (ele.getAttribute("type") == "radio" && ele.parentElement.parentElement.parentElement.querySelector(".errorMsg")) {
            ele.parentElement.parentElement.parentElement.querySelector(".errorMsg").remove();
          }
        }
      });
    },
    [router.locale]
  );

  useEffect(() => {
    const form: any = router.locale == "en" ? document.querySelector("#form53") : document.querySelector("#form102");
    if (cardType == "Form Card" && form) {
      const elements = Array.from(form.elements);
      form.addEventListener("submit", (event: any) => {
        let isFormValid = true;
        form.querySelector(".cw-submit-button-style").setAttribute("disabled", true);
        elements.map((ele: any) => {
          if (ele.getAttribute("data-validation")) {
            ValidateField(ele);
          }
          if (ele.getAttribute("data-valid") === "false") {
            isFormValid = false;
          }
        });
        if (!isFormValid) {
          event.preventDefault();
          form.querySelector(".cw-submit-button-style").removeAttribute("disabled");
        }
        return isFormValid;
      });

      elements.map((ele: any) => {
        const validation = ele.getAttribute("data-validation") || null;
        if (validation) {
          ele.addEventListener("blur", () => {
            ValidateField(ele);
          });
        }
      });

      const targetFrame = document.querySelector("#FormMessageFrame") as HTMLIFrameElement | null;
      targetFrame?.addEventListener("load", () => {
        setMsgContainerClass("");
      });
    }
  });

  if (cardType != "Form Card") {
    return (
      <>
        <Link
          href={props?.props?.fields["CTA Link"]?.value?.href}
          locale={router.locale}
          passHref
          className="flex w-100 grow"
          target={`_${props?.props?.fields["CTA Target"] ? props?.props?.fields["CTA Target"]?.name : "self"}`}
        >
          <div
            className={`blogResourceCard ${props?.props?.fields?.CardType?.name?.replace(
              / /g,
              ""
            )} ${cardPadding} divide-gray-200 hover:transform hover:scale-105 transition duration-300 shadow my-1 md:my-4 items-stretch w-100 grow relative`}
          >
            {cardType === "Resource Download Card" && (
              <img src={cardImg?.src} width={cardImg?.width} height={cardImg?.height} alt={props?.props?.fields?.Heading?.value} className={`blogResourceCardImage`} />
            )}
            <div className={`${cardPadding === "p-0" ? "p-[3rem]" : "p-0"} w-full blogCardTextContent`}>
              {props?.props?.fields["Sub Heading"]?.value && <p className="uppercase">{props?.props?.fields["Sub Heading"]?.value}</p>}
              <h2>{props?.props?.fields?.Heading?.value}</h2>
              {props?.props?.fields["Card Text"]?.value && cardType != "Form Card" && <p>{props?.props?.fields["Card Text"]?.value}</p>}
              {cardType == "Resource Download Card" && (
                <div className="mt-5 text-center bg-transparent text-white/80 outline-2 outline-white/80 outline hover:outline-white hover:bg-white hover:text-ChartwellPlum font-semibold text-lg uppercase p-4 py-[6px]">
                  {props?.props?.fields["CTA Text"]?.value}
                </div>
              )}
            </div>
          </div>
        </Link>
      </>
    );
  } else {
    return (
      <div
        className={`blogResourceCard ${props?.props?.fields?.CardType?.name?.replace(
          / /g,
          ""
        )} ${cardPadding} divide-gray-200 hover:transform hover:scale-105 transition duration-300 shadow my-1 md:my-4 items-stretch w-100 grow relative`}
      >
        <div className={`${cardPadding === "p-0" ? "p-[3rem]" : "p-0"} w-full blogCardTextContent ${msgContainerClass === "hidden" ? "" : "hidden"}`}>
          {props?.props?.fields["Sub Heading"]?.value && <p className="uppercase">{props?.props?.fields["Sub Heading"]?.value}</p>}
          <h2>{props?.props?.fields?.Heading?.value}</h2>
          {props?.props?.fields["Card Text"]?.value && cardType != "Form Card" && <p>{props?.props?.fields["Card Text"]?.value}</p>}
          {cardType == "Form Card" && (
            <>
              <div
                id="eloquaForm"
                className="w-100 bootlegBootstrapContainer"
                dangerouslySetInnerHTML={{
                  __html: FormHTML,
                }}
              />
              <iframe title="Form Submission Message" aria-label="Form Submission Message" id="FormMessageFrame" name="FormMessageFrame"></iframe>
            </>
          )}
        </div>
        <div
          id="MsgContainer"
          className={`${cardPadding === "p-0" ? "p-[3rem]" : "p-0"} w-full blogCardTextContent ${msgContainerClass}`}
          dangerouslySetInnerHTML={{
            __html: props?.props?.fields["Form Thank You Msg"]?.value,
          }}
        />
      </div>
    );
  }
};
export default BlogResourceCard;
