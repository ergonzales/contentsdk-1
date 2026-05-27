import { Fragment, JSX, useState, useEffect } from "react";
import { usePopoverClose } from "./PopoverCloseContext";
import { Popover, Transition } from "@headlessui/react";
import NavDropDownItem from "./NavDropDownItem";

const NavDropDown = ({ navItem }: { navItem: any }): JSX.Element => {
  const { closeSignal } = usePopoverClose();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false); // Close when signal changes
  }, [closeSignal]);

  return (
    <>
      <Transition
        key={`transition${navItem.Id}`}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover className="absolute z-10 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 left-1/2  -translate-x-1/3" key={`panel${navItem.name}`} data-open={open}>
          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="relative grid gap-0 bg-white px-2 py-3 sm:p-2 dropdownContainer">
              <NavDropDownItem item={navItem} parent={navItem.Id} key={`navDropDownItem${navItem.Id}`}></NavDropDownItem>
              {navItem.Children?.map((item: any, index: any) => (
                // <NavDropDownItem item={item} parent={navItem.Id} key={`navDropDownItem${index}`} styles={styles}></NavDropDownItem>
                <NavDropDownItem item={item} parent={navItem.Id} key={`navDropDownItem${index}`}></NavDropDownItem>
              ))}
              {/* {(navItem.Id == "cababb8f-012e-4de7-aead-911ca47eed29" || navItem.Id == "c4d2401e-d9d3-4900-b8dc-66cd915f9b0e") &&
                AboutUsExternalLinks &&
                AboutUsExternalLinks.map((item: any, index: any) => {
                  const itm = { Id: item.id, Href: item.fields.Url.value, NavigationTitle: item.fields.Title, Styles: navItem.Styles, target: item.fields.Target?.fields?.TargetType?.value };
                  // return <NavDropDownItem item={itm} parent={navItem.Id} key={`navDropDownItem${index}`} styles={styles}></NavDropDownItem>;
                  return <NavDropDownItem item={itm} parent={navItem.Id} key={`navDropDownItem${index}`}></NavDropDownItem>;
                })} */}
            </div>
          </div>
        </Popover>
      </Transition>
    </>
  );
};
export default NavDropDown;
