import { JSX } from "react";
import { Field, RichText as JssRichText, withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { getCookie, setCookie } from "typescript-cookie";
import { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";

type CookieConsentProps = ComponentProps & {
  fields: {
    Text: Field<string>;
  };
};

const USER_CONSENT_COOKIE_KEY = "chartwell_banner_cookie";

const CookieConsent = (props: CookieConsentProps): JSX.Element => {
  const [cookieConsentIsTrue, setCookieConsentIsTrue] = useState("false");
  const checkCookiePresent = async () => {
    if (getCookie(USER_CONSENT_COOKIE_KEY) != "true") {
      setCookie(USER_CONSENT_COOKIE_KEY, "false", { expires: 0 });
      document.cookie = USER_CONSENT_COOKIE_KEY + "=" + "false" + ";" + 0 + ";path=/";
      setCookieConsentIsTrue("false");
    }
  };

  useEffect(() => {
    checkCookiePresent();
    const consentIsTrue = getCookie(USER_CONSENT_COOKIE_KEY) == "true" ? "true" : "false";
    setCookieConsentIsTrue(consentIsTrue);
  }, []);

  const setCookieValue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cookieConsentIsTrue) {
      setCookie(USER_CONSENT_COOKIE_KEY, "true", { expires: 0 });
      document.cookie = USER_CONSENT_COOKIE_KEY + "=" + "true" + ";" + 0 + ";path=/";
      setCookieConsentIsTrue("true");
    }
  };

  return (
    <div
      className={`px-2 py-4 w-full flex justify-center fixed bottom-0 bg-ChartwellPlum-100 ${
        cookieConsentIsTrue !== "true" ? "opacity-100" : "opacity-0 pointer-events-none hidden"
      } duration-500 ease-out`}
    >
      <div className="py-0">
        <form
          className="text-ChartwellWhite "
          onSubmit={(e) => {
            setCookieValue(e);
          }}
        >
          <div className="">
            <div className="flex items-center">
              <JssRichText tag="div" field={props?.fields?.Text} className={`mt-2 md:mt-0 text-[12px]`} />
              <button className=" absolute top-0 right-0 md:static cursor-pointer ml-4" type="submit" title="close">
                <XCircleIcon className={`h-8 w-8 text-white`} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<CookieConsentProps>(CookieConsent);
