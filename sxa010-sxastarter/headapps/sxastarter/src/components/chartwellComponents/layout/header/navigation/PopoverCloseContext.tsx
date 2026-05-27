// PopoverCloseContext.tsx
import React, { createContext, useContext, useState } from "react";

const PopoverCloseContext = createContext<{ closeSignal: number; triggerClose: () => void }>({
  closeSignal: 0,
  triggerClose: () => {},
});

export const usePopoverClose = () => useContext(PopoverCloseContext);

export const PopoverCloseProvider = ({ children }: { children: React.ReactNode }) => {
  const [closeSignal, setCloseSignal] = useState(0);
  const triggerClose = () => setCloseSignal((s) => s + 1);
  return <PopoverCloseContext.Provider value={{ closeSignal, triggerClose }}>{children}</PopoverCloseContext.Provider>;
};
