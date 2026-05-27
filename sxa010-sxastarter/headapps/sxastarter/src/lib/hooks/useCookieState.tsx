import { useEffect, useRef, useState } from "react";

type CookieOpts = {
  session?: boolean; // clear when browser closes
  days?: number; // expire in X days
  hours?: number; // expire in X hours
  minutes?: number; // expire in X minutes
  path?: string;
  domain?: string;
  sameSite?: "lax" | "strict" | "none";
  secure?: boolean;
};

type FlagSetArg =
  | number // keep backward-compat: days
  | {
      session?: boolean; // delete on browser close
      days?: number;
      hours?: number;
      minutes?: number;
      path?: string;
      domain?: string;
      sameSite?: "lax" | "strict" | "none";
      secure?: boolean;
    };

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${encodeURIComponent(name)}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

function writeCookie(name: string, value: string, opts: CookieOpts = {}) {
  if (typeof document === "undefined") return;
  const { session = false, days, hours, minutes, path = "/", domain, sameSite = "lax", secure = true } = opts;

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=${path}; SameSite=${sameSite}`;

  if (!session) {
    let maxAge = 0;
    if (days) maxAge += days * 24 * 60 * 60;
    if (hours) maxAge += hours * 60 * 60;
    if (minutes) maxAge += minutes * 60;

    if (maxAge > 0) {
      cookie += `; Max-Age=${maxAge}`;
    } else {
      // fallback: default 30 days
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      cookie += `; Expires=${expires.toUTCString()}`;
    }
  }

  if (domain) cookie += `; Domain=${domain}`;
  if (secure) cookie += `; Secure`;
  document.cookie = cookie;
}
function removeCookie(name: string, opts: CookieOpts = {}) {
  if (typeof document === "undefined") return;
  const { path = "/", domain, sameSite = "lax", secure = true } = opts;
  let cookie = `${encodeURIComponent(name)}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=${path}; SameSite=${sameSite}`;
  if (domain) cookie += `; Domain=${domain}`;
  if (secure) cookie += `; Secure`;
  document.cookie = cookie;
}

export function useCookieState<T>(key: string, initialValue: T, opts?: CookieOpts): [T, (v: T | ((prev: T) => T)) => void, () => void] {
  const isBrowser = typeof window !== "undefined";
  const initRef = useRef(false);

  const getInitial = () => {
    if (!isBrowser) return initialValue;
    const raw = readCookie(key);
    if (raw == null) return initialValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  };

  const [state, setState] = useState<T>(getInitial);

  useEffect(() => {
    // write once after mount to ensure cookie exists
    if (!initRef.current) {
      writeCookie(key, JSON.stringify(state), opts);
      initRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isBrowser) return;
    writeCookie(key, JSON.stringify(state), opts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, state]);

  const remove = () => removeCookie(key, opts);

  return [state, setState, remove];
}

// Small helpers for simple boolean "flags" as cookies
export const cookieFlags = {
  get(name: string) {
    return readCookie(name) === "true";
  },

  // Usage:
  // cookieFlags.set("flag")                      -> 1 day (back-compat)
  // cookieFlags.set("flag", 7)                   -> 7 days
  // cookieFlags.set("flag", { session: true })   -> session cookie
  // cookieFlags.set("flag", { hours: 1 })        -> 1 hour
  // cookieFlags.set("flag", { minutes: 30 })     -> 30 minutes
  set(name: string, arg: FlagSetArg = 1) {
    if (typeof arg === "number") {
      writeCookie(name, "true", { days: arg });
      return;
    }
    // if no TTL fields provided, default to 30 days (or choose your own default)
    const hasTTL = arg.session || arg.days || arg.hours || arg.minutes;
    writeCookie(name, "true", hasTTL ? arg : { days: 30, ...arg });
  },

  clear(name: string) {
    removeCookie(name);
  },

  // convenience helpers (optional)
  setSession(name: string) {
    writeCookie(name, "true", { session: true });
  },
  setForHour(name: string, hours = 1) {
    writeCookie(name, "true", { hours });
  },
  setForMinutes(name: string, minutes: number) {
    writeCookie(name, "true", { minutes });
  },
};
export function getCookieJSON<T>(name: string, fallback: T): T {
  const raw = readCookie(name);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
