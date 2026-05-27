import { StoryFn, Meta } from "@storybook/react";
import ResourceList from "components/chartwellComponents/content/ResourceList/ResourceList";

export default {
  title: "Components/ResourceList",
  component: ResourceList,
  argTypes: {
    fields: {
      control: {
        type: "object",
      },
    },
  },
} as Meta;

const Template: StoryFn<any> = (args) => <ResourceList {...args} />;

export const Default = Template.bind({});
Default.args = {};
