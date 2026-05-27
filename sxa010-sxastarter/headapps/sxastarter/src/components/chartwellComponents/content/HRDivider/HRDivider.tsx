import { JSX } from "react";
const HRDivider = (): JSX.Element => {
  return (
    <div className="flex w-full relative max-w-1800px mx-auto mt-4 mb-16">
      <div className="w-full inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t-2 border-ChartwellPlum" />
      </div>
    </div>
  );
};

export default HRDivider;
