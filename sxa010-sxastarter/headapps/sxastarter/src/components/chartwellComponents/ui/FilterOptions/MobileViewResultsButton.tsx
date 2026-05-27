import Button from "components/Common/Button";
// import { ArrowDownCircleIcon } from "lucide-react";
export const MobileViewResultsButton = ({ ref, setIsFilterOpen }: { ref?: React.RefObject<HTMLDivElement | null>; setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const scrollToResults = () => {
    if (ref == null) return;
    setIsFilterOpen(false);
    // ref.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <Button color="blue-fill-200" additionalClass="mt-2 ml-2 px-4 py-2 rounded-md border" onClick={scrollToResults}>
      <div className="flex items-center gap-2">
        {/* <ArrowDownCircleIcon width={24} height={24} className=" text-ChartwellPlum" /> */}
        <span className="font-semibold text-[0.85rem] md:text-[0.9rem]">View Results</span>
      </div>
    </Button>
  );
};
