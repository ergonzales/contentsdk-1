import Head from 'next/head';
import client from 'lib/sitecore-client';
import { LayoutServiceData, HTMLLink } from '@sitecore-content-sdk/nextjs';

/**
 * Component to render `<link>` elements for Sitecore styles
 */
const SitecoreStyles = ({
  layoutData,
  enableStyles,
  enableThemes,
}: {
  layoutData: LayoutServiceData;
  enableStyles?: boolean;
  enableThemes?: boolean;
}) => {
  const styleLinks = client.getHeadLinks(layoutData, { enableStyles, enableThemes });

  if (styleLinks.length === 0) {
    return null;
  }

  return (
    <Head>
      {styleLinks.map(({ rel, href }: HTMLLink) => (
        <link rel={rel} key={href} href={href} />
      ))}
    </Head>
  );
};

export default SitecoreStyles;
