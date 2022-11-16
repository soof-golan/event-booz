export const apiUrl = !import.meta.env.DEV ? import.meta.env.VITE_REGISTER_API_URL : import.meta.env.VITE_DEV_REGISTER_API_URL;
export const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
export const closingTime: number = new Date(import.meta.env.VITE_FORM_CLOSING_TIME).getTime();
