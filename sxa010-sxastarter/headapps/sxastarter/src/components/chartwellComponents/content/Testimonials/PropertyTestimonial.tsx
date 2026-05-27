import { JSX } from "react";
import { Field, ImageField, LinkField, withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";

import { PropertyTestimonialSection } from "./PropertyTestimonialSection";
type PropertyTestimonialProps = ComponentProps & {
  fields: {
    Testimonials: Array<any>;
    Title: Field<string>;
    "Background Image": ImageField;
    "CTA Text": Field<string>;
    "CTA Link": LinkField;
    ["CTA Style"]: Field<string>;
    PlaceID: Field<string>;
    reviews: { value: string };
  };
};

const PropertyTestimonial = (props: PropertyTestimonialProps): JSX.Element => {
  const place_id = props?.fields?.PlaceID?.value;

  const { Title, "CTA Text": CTAText, "Background Image": BackgroundImage, "CTA Link": CTALink, reviews } = props?.fields;

  const styles = {
    testimonialsStyles: {
      backgroundImage: `url(${BackgroundImage?.value?.src})`,
    },
  };
  return (
    <div className="w-full  bg-cover bg-no-repeat bg-ChartwellWhite" style={styles?.testimonialsStyles}>
      <PropertyTestimonialSection Title={Title} CTAText={CTAText} CTALink={CTALink} place_id={place_id} propsReviews={reviews} />
    </div>
  );
};

export default withDatasourceCheck()<PropertyTestimonialProps>(PropertyTestimonial);
