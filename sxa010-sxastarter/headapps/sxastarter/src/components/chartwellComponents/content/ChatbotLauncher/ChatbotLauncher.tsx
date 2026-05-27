import { withDatasourceCheck, RichText as JssRichText, Field } from "@sitecore-content-sdk/nextjs";
import { JSX, useCallback, useMemo } from "react";
import { ComponentProps } from "lib/component-props";
import { useSessionStorage } from "usehooks-ts";
import { useRouter } from "next/router";
import Button from "components/Common/Button";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";

type ChatbotLauncherProps = ComponentProps & {
  fields: {
    BackgroundImage?: Field<{ src: string }>;
    Description?: Field<string>;
    Heading: Field<string>;
    ["Heading Level"]?: Field<string>;
    ["CTA Text"]?: Field<string>;
  };
};

type SessionBranch = {
  open: boolean;
  isPopupActive: boolean;
  openAtLeastOnce: boolean;
};
const initialSessionsStorage: SessionBranch = {
  open: false,
  isPopupActive: false,
  openAtLeastOnce: false,
};

const ChatbotLauncher = (props: ChatbotLauncherProps): JSX.Element => {
  const router = useRouter();
  const storageKey = useMemo(() => `chatBot_${router.locale}`, [router.locale]);

  const [valueSessionsStorage, setSessionsStorage] = useSessionStorage<SessionBranch>(storageKey, initialSessionsStorage);

  const updateSession = useCallback(
    (mutator: (draft: SessionBranch) => void) => {
      setSessionsStorage((prev) => {
        const next = structuredClone(prev) as SessionBranch;
        mutator(next);
        return next;
      });
    },
    [setSessionsStorage]
  );

  const openChat = useCallback(() => {
    updateSession((d) => {
      d.open = true;
      d.isPopupActive = false;
      d.openAtLeastOnce = true;
    });
  }, [updateSession]);

  const { BackgroundImage, Description, Heading, "Heading Level": headingLevelField, "CTA Text": ctaTextField } = props.fields || {};
  const isOpen = valueSessionsStorage.open;

  return (
    <section className="w-full bg-no-repeat bg-cover" style={{ backgroundImage: `url(${BackgroundImage!.value.src})` }}>
      <div>
        <div className="ChartwellContainer SectionPadding flex flex-col items-center gap-4 text-center">
          <HeadingLevel headingLevel={headingLevelField} titleText={Heading} />
          <JssRichText field={Description} className="m-0 ChartwellText " />
          <Button disabled={isOpen} additionalClass={`px-8 !py-2 mt-2 transition-opacity ${isOpen ? "opacity-40 cursor-not-allowed" : ""}`} onClick={openChat} color={"plum"}>
            <span className="uppercase">{ctaTextField?.value}</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default withDatasourceCheck()<ChatbotLauncherProps>(ChatbotLauncher);
