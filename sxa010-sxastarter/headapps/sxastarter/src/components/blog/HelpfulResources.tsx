import { JSX } from "react";
import BlogResourceCard from "./BlogResourceCard/BlogResourceCard";
import { useI18n } from "next-localization";

const HelpfulResources = (props: any): JSX.Element => {
  const { t } = useI18n();
  let x = 0;
  const cards = props.props;

  return (
    <div className="blogResourcesSection py-2 md:py-4 my-2 md:my-6 print:hidden">
      <span className="uppercase font-normal mt-1 mb-1 text-lg text-ChartwellPlum">{t("HelpfulResources")}</span>

      <div className={`grid grid-cols-1 gap-1 md:gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch`}>
        {cards.map((card: any) => {
          x++;
          return <BlogResourceCard key={x} props={card}></BlogResourceCard>;
        })}
      </div>
    </div>
  );
};
export default HelpfulResources;
