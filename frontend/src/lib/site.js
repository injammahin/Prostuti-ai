import { FACEBOOK_PAGE } from "@/content/contact"

// Public contact and social links, set in the frontend's .env. Anything left empty is not shown.
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || ""
export const FACEBOOK_URL = import.meta.env.VITE_FACEBOOK_URL || FACEBOOK_PAGE
