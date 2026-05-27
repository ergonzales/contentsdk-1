import { NextRequest, NextResponse } from "next/server";
import { defineProxy, MultisiteProxy, RedirectsProxy, PersonalizeProxy } from "@sitecore-content-sdk/nextjs/proxy";
import scConfig from "sitecore.config";
import { siteResolver } from "lib/site-resolver";

const multisite = new MultisiteProxy({
  ...scConfig.multisite,
  sites: siteResolver.sites,
});

const redirects = new RedirectsProxy({
  ...scConfig.api.edge,
  ...scConfig.api.local,
  ...scConfig.redirects,
  sites: siteResolver.sites,
  locales: ["en", "fr"],
});

const personalize = new PersonalizeProxy({
  ...scConfig.api.edge,
  ...scConfig.personalize,
  sites: siteResolver.sites,
  // Keep personalization disabled while in development mode.
  skip: () => process.env.NODE_ENV === "development",
});

const visitorId = {
  async handle(req: NextRequest, res: NextResponse): Promise<NextResponse> {
    const existing = req.cookies.get("cw_vid")?.value;
    if (existing) return res;

    res.cookies.set({
      name: "cw_vid",
      value: crypto.randomUUID(),
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      secure: true,
    });

    return res;
  },
};

// Pages Router proxy order: multisite -> redirects -> personalize
export default function proxy(req: NextRequest) {
  return defineProxy(multisite, redirects, personalize, visitorId).exec(req);
}

export const config = {
  /*
   * Match all paths except for:
   * 1. /api routes
   * 2. /_next (Next.js internals)
   * 3. /sitecore/api (Sitecore API routes)
   * 4. /- (Sitecore media)
   * 5. /healthz (Health check)
   * 6. /feaas-render (FEaaS render)
   * 7. all root files inside /public
   */
  matcher: ["/", "/((?!api/|_next/|feaas-render|healthz|sitecore/api/|-/|favicon.ico|sc_logo.svg).*)"],
};