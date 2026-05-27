import { ChartwellModal } from "components/chartwellComponents/ui/modal/ChartwellModal";
import dynamic from "next/dynamic";

import { PropertyTestimonialSection } from "../Testimonials/PropertyTestimonialSection";

export const TestimonialsChatBotModal = ({ setOpen, isTestimonialOpen, data }: { setOpen: any; isTestimonialOpen: boolean; data: any }) => {
  const DynamicChartwellModal = dynamic(() => Promise.resolve(ChartwellModal), {
    ssr: false,
  });

  const getData = (name: string) => {
    return data?.find((x: { name: string }) => x.name === name)?.jsonValue;
  };
  // console.log(data, "data");

  const BackgroundImage = getData("Background Image")?.value;
  const CTAText = getData("CTA Text");
  const CTALink = getData("CTA Link");
  const place_id = getData("PlaceID")?.value;
  const title = getData("Title");
  const reviews = getData("reviews");
  const styles = {
    testimonialsStyles: {
      backgroundImage: `url(${BackgroundImage?.src})`,
    },
  };

  return (
    <DynamicChartwellModal styles="bg-ChartwellWhite flex items-center justify-center overflow-y-scroll" CloseBTNPosition={"m-[1%]"} open={isTestimonialOpen} setOpen={setOpen} isBackButton={true}>
      <div className="w-full h-full lg:h-fit  bg-cover bg-no-repeat bg-ChartwellWhite" style={styles?.testimonialsStyles}>
        <PropertyTestimonialSection CTAText={CTAText} CTALink={CTALink} place_id={place_id} Title={title} propsReviews={reviews} />
      </div>
    </DynamicChartwellModal>
  );
};
