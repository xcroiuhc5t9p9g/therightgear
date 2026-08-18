# SECURITY AND INDEXING POLICY

## A. AUTH SECURITY
- **Firebase Project**: automotive-ai-platform
- **Identity Platform**: Manual enablement required for reCAPTCHA Enterprise and TOTP MFA.
- **Email/Password Runtime**: Implemented and functioning.
- **Google Sign-In**: Operational and using Firebase Authentication.
- **Email Verification**: To be fully enforced via custom verification gates in future.
- **Password Policy**: Uses Identity Platform defaults.
- **Account Enumeration Protection**: Minimal explicit rejection feedback.

## B. RECAPTCHA ENTERPRISE
- **Mode**: Audit mode.
- **Integration**: To be fully wired via App Check initialization once Identity Platform enables the ReCaptcha provider.
- **Manual Action**: Founder must activate ReCaptcha Enterprise in Google Cloud and link to Identity Platform.

## C. APP CHECK
- **Implemented**: Foundation set.
- **Provider**: reCAPTCHA Enterprise (requires manual enablement).
- **Enforcement**: Audit/Monitor mode only.
- **Manual Action**: Register App Check in Firebase Console for the web app.

## D. MFA
- **TOTP Status**: Requires Google Cloud project-level enablement.
- **Super Admin/Editor Policy**: TOTP MFA is required where technically enforceable.
- **Server Authorization**: To be strictly enforced via custom Firebase Claims.

## E. INDEXING
- **Robots.txt**: Exists, favors public discovery but blocks GPTBot.
- **Sitemap.xml**: Canonical sitemap deployed.
- **Canonical Origin**: https://therightgear.app
- **Private Routes**: Use noindex/nofollow.
- **Search Console**: Ready for submission.

## F. AI CRAWL POLICY
- **Googlebot**: ALLOW
- **Google-Extended**: ALLOW
- **OAI-SearchBot**: ALLOW
- **GPTBot**: DISALLOW

## G. SECURITY HEADERS
- **CSP Mode**: Report-Only to prevent breaking Firebase Auth popup and external scripts.
- **HSTS / Nosniff / Referrer-Policy**: Implemented via Express server headers.

## H. CLOUDFLARE MANUAL CHECKLIST
- Universal SSL / HTTPS (Enabled)
- Always Use HTTPS (Enabled)
- Bot Fight Mode (Monitor/Enabled cautiously)
- Security Level: Medium
- Browser Integrity Check: Enabled

