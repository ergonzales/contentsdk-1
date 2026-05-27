import { NextApiRequest, NextApiResponse } from "next";
/**
 * This Next.js API route is used to handle Sitecore editor data storage and retrieval by key
 * on serverless deployment architectures (e.g. Vercel) via the `ServerlessEditingDataService`.
 *
 * The `EditingDataMiddleware` expects this dynamic route name to be '[key]' by default, but can
 * be configured to use something else with the `dynamicRouteKey` option.
 */

// Bump body size limit (1mb by default) and disable response limit for Sitecore editor payloads
// See https://nextjs.org/docs/api-routes/request-helpers#custom-config
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "2mb",
    },
    responseLimit: false,
  },
};

// Content SDK v2 no longer uses a separate editing data middleware endpoint.
// Keep the route for backward compatibility and return a clear response.
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(410).json({
    error: "This endpoint is deprecated in Content SDK v2. Use /api/editing/render.",
  });
}
