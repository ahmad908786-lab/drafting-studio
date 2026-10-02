import Script from "next/script";

/** GA4 property for draftingstudio.org. Override with NEXT_PUBLIC_GA_ID if it changes. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-RWVNFRS0F6";

/**
 * Google tag (gtag.js). Loaded only on the public site layout — not /admin or
 * /portal, so staff and client sessions don't pollute traffic numbers — and
 * only in production, so `npm run dev` doesn't send hits.
 */
export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production" || !GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
