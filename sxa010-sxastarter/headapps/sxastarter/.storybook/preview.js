import "../styles/global.css";
import { SitecoreContext } from '@sitecore-content-sdk/nextjs';
import 'tailwindcss/tailwind.css';
import './../../sxastarter/src/assets/sass/_app.scss';
import { RouterContext } from "next/dist/shared/lib/router-context"
export const parameters = {
  nextRouter: {
    Provider: RouterContext.Provider,
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}




import * as NextImage from "next/legacy/image";

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
configurable: true,
value: (props) => typeof props.src === 'string' ? (
<OriginalNextImage {...props} unoptimized blurDataURL={props.src} />
) : (
<OriginalNextImage {...props} unoptimized />
),
});


const mockSitecoreContext = {
  context: {
    pageEditing: false,
    language: 'en'
  },
  updateSitecoreContext: () => { },
};

export const mockComponentFactory = function (componentName) {
  const components = new Map();

  const component = components.get(componentName);

  // check that component should be dynamically imported
  if (component?.element) {
    // return next.js dynamic import
    return component.element();
  }

  return component?.default || component;
};

export const decorators = [
  (Story) => (
    <SitecoreContext context={mockSitecoreContext} componentFactory={mockComponentFactory}>
      <Story />
    </SitecoreContext>
  ),
];
