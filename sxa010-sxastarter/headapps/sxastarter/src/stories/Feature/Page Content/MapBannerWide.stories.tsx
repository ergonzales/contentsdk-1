import { StoryFn, Meta } from "@storybook/react";

import MapBannerWide from "components/Feature/Page Content/MapBannerWide";

export default {
  title: "Feature/Page Content/Map Banner Wide",
  component: MapBannerWide,
  argTypes: {},
} as Meta<typeof MapBannerWide>;

const Template: StoryFn<typeof MapBannerWide> = (args) => <MapBannerWide {...args} />;

export const Default = Template.bind({});

Default.args = {
  fields: {
    map: {
      value: {
        src: "stories/Map Banner/map_wide.svg",
        alt: "Canada Map",
      },
    },
    mobileMap: {
      value: {
        src: "stories/Map Banner/map_wide.svg",
        alt: "Canada Map",
      },
    },
    britishColumbiaLink: {
      value: {
        href: "/bc-link",
        text: "British Columbia Link",
      },
    },
    albertaLink: {
      value: {
        href: "/alberta-link",
        text: "Alberta Link",
      },
    },
    ontarioLink: {
      value: {
        href: "/ontario-link",
        text: "Ontario Link",
      },
    },
    quebecLink: {
      value: {
        href: "/quebec-link",
        text: "Quebec Link",
      },
    },
  },
};
