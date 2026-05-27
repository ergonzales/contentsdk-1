import { checkIsItPromo } from "lib/helpers/utils/checkIsItPromo";
import { JSX } from "react";

const HighlightBanner = (props: any): JSX.Element => {
  /**
   * Renders the HighlightBanner component.
   *
   * @param props - The component props.
   * @returns The rendered HighlightBanner component.
   */
  const { ci, ciChild } = props?.fields?.data || {};

  const contextItemParent = ciChild?.parent;
  const promos = ci?.promos?.targetItems?.[0] || contextItemParent?.promos?.targetItems?.[0] || {};

  const hasActivePromo = promos && checkIsItPromo(promos?.promoStartDate?.jsonValue?.value, promos?.promoEndDate?.jsonValue?.value);
  if (!hasActivePromo) return <></>;
  return (
    <div className="w-full bg-ChartwellPlum shadow-md shadow-ChartwellPlum-100   z-10">
      <div className="p-2 ">
        <p className="text-center text-ChartwellWhite ">{promos?.longPromotionTitle?.value}</p>
      </div>
    </div>
  );
};
export default HighlightBanner;
