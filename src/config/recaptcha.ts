// Google reCAPTCHA configuration
export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEbUjQ3JbP9PUb' // Test key (replace with your actual site key)
export const RECAPTCHA_ENABLED = import.meta.env.VITE_RECAPTCHA_ENABLED !== 'false'

// Note: The above test key is provided by Google for testing purposes.
// For production, you need to:
// 1. Go to https://www.google.com/recaptcha/admin/create
// 2. Register your site and get a site key
// 3. Add the site key to your .env file as VITE_RECAPTCHA_SITE_KEY=your_site_key
// 4. Set VITE_RECAPTCHA_ENABLED=true in production