// Cookie utility functions

export const setCookie = (name, value, days = 7) => {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  // Set cookie - don't use Secure on HTTP/localhost
  const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  document.cookie = cookieString;
  
  // Verify it was set immediately
  const verify = getCookie(name);
  if (verify !== value) {
    console.error(`Cookie ${name} was not set correctly. Expected: ${value}, Got: ${verify}`);
    console.error('Cookie string:', cookieString);
    console.error('All cookies:', document.cookie);
  } else {
    console.log(`Cookie ${name} set successfully`);
  }
};

export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  
  // Cookie might be HttpOnly, so document.cookie might be empty
  // But we'll try to read it anyway
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const value = c.substring(nameEQ.length, c.length);
      return value || null;
    }
  }
  return null;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

