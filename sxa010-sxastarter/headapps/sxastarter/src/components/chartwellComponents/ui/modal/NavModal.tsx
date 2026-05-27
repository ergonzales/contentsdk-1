import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Transition, TransitionChild } from "@headlessui/react";
type Props = {
  children?: React.ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  style?: string;
};
export const NavModal = ({ children, open }: Props) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);
  return (
    <Transition show={open}>
      <TransitionChild enter="ease-in-out duration-300" enterFrom="translate-y-[-100%]" enterTo="translate-y-0" leave="ease-in duration-300" leaveFrom="translate-y-0" leaveTo="translate-y-[-100%]">
        <div className={`fixed  bottom-0 left-0 right-0  z-999 overflow-y-auto`}>{children}</div>
      </TransitionChild>
    </Transition>
  );
};
