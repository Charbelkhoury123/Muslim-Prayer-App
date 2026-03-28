/**
 * White-label brand configuration.
 * 
 * To rebrand the app for a different client, modify ONLY this file.
 * All screens, components, and metadata reference these constants.
 */
export const Brand = {
  /** Display name shown in headers, splash, and About screen */
  name: 'Aqimo',

  /** Tagline used in onboarding and marketing */
  tagline: 'Establish the Prayer.',

  /** Arabic transliteration shown in the Meaning screen */
  arabicName: 'أَقِيمُو',

  /** App version — keep in sync with app.json */
  version: '1.0.0',

  /** Support / feedback email */
  supportEmail: 'support@aqimo.app',

  /** Website URL */
  website: 'https://aqimo.app',

  /** Privacy policy URL */
  privacyUrl: 'https://aqimo.app/privacy',

  /** Terms of service URL */
  termsUrl: 'https://aqimo.app/terms',

  /** Copyright line */
  copyright: `© ${new Date().getFullYear()} Aqimo. All rights reserved.`,

  /** Developer / studio credit */
  developer: 'Built with purpose.',
} as const;
