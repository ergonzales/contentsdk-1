const path = require("path");
const redirects = require("./src/cw-redirects") || [];

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://vimeo.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://dam.chartwell.com https://vimeo.com;
  frame-ancestors 'self';
  frame-src https://player.vimeo.com;
  connect-src 'self' https://vimeo.com;
`;

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Allow specifying a distinct distDir when concurrently running app in a container
  distDir: process.env.NEXTJS_DIST_DIR || ".next",

  sassOptions: {
    includePaths: [path.join(__dirname, "src/assets/sass"), path.join(__dirname, "node_modules")],
    quietDeps: true,
    silenceDeprecations: ["import", "legacy-js-api"],
  },

    // Enable Turbopack only for local/dev runs. Disable in CI/production by
    // default so builds use the stable webpack/production pipeline.
    // Toggle with `ENABLE_TURBOPACK=true` when needed.

  i18n: {
    // These are all the locales you want to support in your application.
    // These should generally match (or at least be a subset of) those in Sitecore.
    locales: ["en", "fr"],
    // This is the locale that will be used when visiting a non-locale
    // prefixed path e.g. `/about`.
    defaultLocale: process.env.DEFAULT_LANGUAGE || process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || "en",
  },

  // Enable React Strict Mode
  reactStrictMode: true,

  async redirects() {
    return redirects;
  },

  // Disable the X-Powered-By header. Follows security best practices.
  poweredByHeader: false,

  // use this configuration to ensure that only images from the whitelisted domains
  // can be served from the Next.js Image Optimization API
  // see https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "edge*.**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "xmc-*.**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "dam.chartwell.com",
        port: "",
      },
    ],
  },

  async rewrites() {
    return [
      // healthz check
      {
        source: "/healthz",
        destination: "/api/healthz",
      },
      // robots route
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
      // sitemap route
      {
        source: "/sitemap:id([\\w-]{0,}).xml",
        destination: "/api/sitemap",
      },
      // feaas api route
      {
        source: "/feaas-render",
        destination: "/api/editing/feaas/render",
      },
    ];
  },

  webpack: (config, options) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@sass": path.resolve(__dirname, "src/assets/sass"),
      "next/image": path.resolve(__dirname, "src/lib/next-image-shim.tsx"),
    };

    if (!options.isServer) {
      // Add a loader to strip out getComponentServerProps from components in the client bundle
      config.module.rules.unshift({
        test: /src\\components\\.*\.tsx$/,
        use: ["@sitecore-content-sdk\\nextjs\\component-props-loader"],
      });
    } else {
      // Force use of CommonJS on the server for FEAAS SDK since Content SDK also uses CommonJS entrypoint to FEAAS SDK.
      // This prevents issues arising due to FEAAS SDK's dual CommonJS/ES module support on the server (via conditional exports).
      // See https://nodejs.org/api/packages.html#dual-package-hazard.
      config.externals = [
        {
          "@sitecore-feaas/clientside/react": "commonjs @sitecore-feaas/clientside/react",
          "@sitecore/byoc": "commonjs @sitecore/byoc",
          "@sitecore/byoc/react": "commonjs @sitecore/byoc/react",
        },
        ...config.externals,
      ];
    }

    return config;
  },
};

const isProdOrCI = process.env.NODE_ENV === "production" || !!process.env.CI;
const enableTurbopack = !isProdOrCI && process.env.ENABLE_TURBOPACK !== "false";

// Rebuild the config object with turbopack gated behind the flag.
if (enableTurbopack) {
  nextConfig.experimental = { turbopackFileSystemCacheForDev: true };
  nextConfig.turbopack = {
    resolveAlias: {
      "next/image": "./src/lib/next-image-shim.tsx",
    },
  };
} else {
  // Ensure keys exist but do not enable turbopack behavior in prod/CI.
  nextConfig.experimental = nextConfig.experimental || {};
}

module.exports = nextConfig;
