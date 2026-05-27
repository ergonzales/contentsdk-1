import React, { Dispatch, SetStateAction, useCallback } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useI18n } from "next-localization";
import Button from "components/Common/Button";

type Props = {
  children?: React.ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  styles?: string;
  CloseBTNPosition?: string;
  setMaxDistance?: Dispatch<SetStateAction<number>>;
  setIsPopupActive?: Dispatch<SetStateAction<boolean>>;
  isBackButton?: boolean;
};

export const ChartwellModal = ({
  children,
  open,
  setOpen,
  setMaxDistance,
  setIsPopupActive,
  styles = "flex items-center justify-center ",
  CloseBTNPosition = "m-[0.5%]",
  isBackButton = false,
}: Props) => {
  const { t: dictionary } = useI18n();

  const handleClose = useCallback(() => {
    setOpen(false);
    setIsPopupActive?.(false);
    setMaxDistance?.(25);
  }, [setOpen, setIsPopupActive, setMaxDistance]);

  return (
    <Transition show={open}>
      <Dialog as="div" onClose={handleClose}>
        <div className="fixed inset-0 z-999 overflow-y-hidden chartwellModal justify-center bg-[rgba(0,0,0,0.5)]">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel className={`relative w-screen h-screen transform ${styles} overflow-hidden transition-all`} onClick={() => setMaxDistance?.(25)}>
              <div className={`absolute top-0 right-0 block modalClose ${CloseBTNPosition}`}>
                {isBackButton ? (
                  <Button additionalClass="px-6 py-2" color="blue-fill-200" onClick={handleClose}>
                    <div className="flex items-center gap-2">
                      <ArrowLeftIcon className="h-5 w-5 fill-ChartwellGrey" aria-hidden="true" />
                      <span className="sr-only">Back</span>
                      <p className="!m-0">{dictionary("Back")}</p>
                    </div>
                  </Button>
                ) : (
                  <button
                    type="button"
                    className="rounded-md md:mr-6 p-2 text-[#333] !bg-[#f6f6f6] hover:!bg-ChartwellBlue hover:text-[#fff] focus:bg-ChartwellBlue-100 focus:border-ChartwellBlue-100 shadow-md focus:outline-none focus:ring-2 focus:ChartwellBlue-100 focus:ring-offset-2 chartwellFAB"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                )}
              </div>
              {children}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
