import { StoryFn, Meta } from "@storybook/react";
import { ComponentProps } from "lib/component-props";
import HRDivider from "components/chartwellComponents/content/HRDivider/HRDivider";

export default {
  title: "Components/HRDivider",
  component: HRDivider,
  argTypes: {
    fields: {
      control: {
        type: "object",
      },
    },
  },
} as Meta;

const Template: StoryFn<ComponentProps> = () => <HRDivider />;

export const Default = Template.bind({});
Default.args = {};
