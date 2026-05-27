
import { useI18n } from "next-localization";
interface PropertySharedData {
  componentName: string;
  fields: {
    TopNavConfig?: any[];
  };
}
import { BookATourButton } from "components/chartwellComponents/layout/header/ChartwellPropertyHeader/BookATourButton";
import Phone from "../../../public/bi_telephone.svg";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";
interface ChatBotNavTopMenuProps {
  isCorporate: boolean;
  handleSelectForm: () => void;
  phoneNumber?: string;
  isDesktop: boolean;
  showBookATourButtonOnTopMenu: boolean;
}

export const ChatBotNavTopMenu = ({ isCorporate, handleSelectForm, phoneNumber = "1-855-461-0685", isDesktop, showBookATourButtonOnTopMenu }: ChatBotNavTopMenuProps) => {
  const { sitecoreContext } = useSitecoreContext();
  const { t: dictionary } = useI18n();
  const PropertySharedDataPh = sitecoreContext?.route?.placeholders["headless-main"] as PropertySharedData[];

  const bat = PropertySharedDataPh?.find((el: PropertySharedData) => el.componentName === "PropertySharedData")?.fields?.TopNavConfig?.find((el: any) => el.name === "book-a-tour") || null;

  return (
    <div className={`  flex  items-center ${isDesktop ? "justify-between" : "justify-start gap-2 flex-row-reverse"} pt-4 `}>
      {isCorporate ? (
        <BookATourButton
          BookATour={bat}
          className={` !rounded-[8px] leading-[1.25] hard-link   font-normal text-[0.875rem] px-3 py-4  items-center text-white text-center  focus:bg-ChartwellPlum hover:bg-ChartwellPlum hover:text-white    bg-ChartwellBlue no-underline   uppercase 
        hover:bg-ChartwellBlue-100  `}
        />
      ) : (
        showBookATourButtonOnTopMenu && (
          <button
            onClick={() => handleSelectForm()}
            className="  !rounded-[8px] leading-[1.25] hard-link   font-normal text-[0.875rem] px-4 py-4  items-center text-white text-center  focus:bg-ChartwellPlum hover:bg-ChartwellPlum hover:text-white    bg-ChartwellBlue no-underline   uppercase 
        hover:bg-ChartwellBlue-100 ease-in-out duration-300 hover:-translate-x-[2px] hover:-translate-y-[2px]"
          >
            <span className="font-bold">{dictionary("BookATourChatBot")}</span>
          </button>
        )
      )}
      <a
        href={`tel:${phoneNumber.replace(/-/g, "")}`}
        className="inline-block py-[0.8rem] text-ChartwellPlum text-[0.95rem] font-semibold hover:text-ChartwellPlum-100  focus:text-ChartwellPlum-100 leading-[1.25] no-underline"
      >
        {isDesktop ? (
          phoneNumber
        ) : (
          <svg width="25" height="25" className="block">
            <image href={`${Phone.src}`} width="25" height="25" />
          </svg>
        )}
      </a>
    </div>
  );
};

export default ChatBotNavTopMenu;
