import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
    return (
        <Html data-scroll-behavior="smooth">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
                <link rel="preconnect" href="https://dev.visualwebsiteoptimizer.com" />
                <script
                    id="iframeBuster"
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                if(top != self) {
                                    top.onbeforeunload = function() {};
                                    top.location.replace(self.location.href);
                                }
                            })();
                        `,
                    }}
                />
            </Head>
            <body id="cwApp" className="no-js">
                <div
                    id="cwGtmNoScript"
                    dangerouslySetInnerHTML={{
                        __html: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-56FVJBX" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
                    }}
                />
                <Main />
                <NextScript />
                <script
                    id="removeNoJsClass"
                    dangerouslySetInnerHTML={{
                        __html: `if(document && document.body){document.body.classList.remove('no-js');}`,
                    }}
                />
            </body>
        </Html>
    );
}
