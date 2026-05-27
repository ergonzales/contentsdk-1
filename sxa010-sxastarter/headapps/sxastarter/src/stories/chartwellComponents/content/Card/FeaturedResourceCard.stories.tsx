import { Meta } from "@storybook/react";
import FeaturedResourceCard from "components/chartwellComponents/content/Card/FeaturedResourceCard";

export default {
  title: "Components/FeaturedResourceCard",
  component: FeaturedResourceCard,
  argTypes: {},
} as Meta;

// const Template: Story<FeaturedResourceCardProps> = (args) => <FeaturedResourceCard {...args} />;

// export const Feature = Template.bind({});
// Feature.args = {
//   fields: {
//     type: { value: "4" },
//     title: { value: "Understand your finances with our affordability calculator" },
//     backgroundImage: { value: { src: "/stories/cost_calculator_lady_feature.jpg", alt: "Alt Text" } },
//     linkToResource: {
//       value: {
//         href: "/link",
//         text: "Calculate Your Expenses",
//       },
//     },
//     mediaForResource: {
//       value: {
//         href: "/link",
//         text: "Start Your Search With Us",
//       },
//     },
//   },
// };
