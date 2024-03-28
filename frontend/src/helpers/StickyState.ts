import React from "react";

export const useStickyState = <T>(defaultValue: T, key: string) => {
  const [value, setValue] = React.useState(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (_e) {
      window.localStorage.removeItem(key);
      return defaultValue;
    }
  });
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
};

export default useStickyState;
