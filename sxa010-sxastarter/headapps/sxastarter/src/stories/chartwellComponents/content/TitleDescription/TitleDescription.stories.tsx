import { StoryFn, Meta } from "@storybook/react";
import TitleDescription from "components/chartwellComponents/content/TitleDescription/TitleDescription";

export default {
  title: "Components/TitleDescription",
  component: TitleDescription,
  argTypes: {
    fields: {
      control: {
        type: "object",
      },
    },
  },
} as Meta;

const Template: StoryFn<any> = (args) => <TitleDescription {...args} />;

export const Default = Template.bind({});
Default.args = {
  fields: {
    Title: { value: "Title" },
    Body: { value: "<p>Body <b>bold</b></p>" },
    BackgroundImage: { value: { src: "https://via.placeholder.com/1920x1080", alt: "Alt Text" } },
    Icon: { value: { src: "/stories/Category_Icon/arm_chair.svg", alt: "Alt Text" } },
  },
};
