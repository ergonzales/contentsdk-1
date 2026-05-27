const getSitecoreApiHost = () => {
  return process.env.SITECORE_API_HOST || process.env.NEXT_PUBLIC_SITECORE_API_HOST || '';
};

/**
 * @param {import('next').NextConfig} nextConfig
 */
const corsHeaderPlugin = (nextConfig = {}) => {
  const sitecoreApiHost = getSitecoreApiHost();

  if (!sitecoreApiHost) {
    return nextConfig;
  }
  return Object.assign({}, nextConfig, {
    async headers() {
      const extendHeaders =
        typeof nextConfig.headers === 'function' ? await nextConfig.headers() : [];
      return [
        ...(await extendHeaders),
        {
          source: '/_next/:path*',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: sitecoreApiHost.replace(/\/$/, ''),
            },
          ],
        },
      ];
    },
  });
};

module.exports = corsHeaderPlugin;
