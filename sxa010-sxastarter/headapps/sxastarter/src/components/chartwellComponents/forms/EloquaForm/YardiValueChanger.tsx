import { useEffect } from "react";

export const YardiValueChanger = () => {
  useEffect(() => {
    //only on book a tour forms
    const batElqForm = document.querySelector("[name^='bookatour']") as HTMLFormElement;

    // const contactElqForm =
    //   lang == "en" ? (document.querySelector("[name='contact_general']") as HTMLFormElement) : (document.querySelector("[name='copycontact_general-638215698605412086']") as HTMLFormElement);
    // const subsElqForm =
    //   lang == "en"
    //     ? (document.querySelector("[name='copycontact_general-638223305060534254']") as HTMLFormElement)
    //     : (document.querySelector("[name='tact_general-638215698605412086-638223305102593675']") as HTMLFormElement);

    const updateYardiId = () => {
      const livingOptionSelected = document.querySelector("[name='dropdownMenu']") as HTMLSelectElement;
      const residenceSelectElement = document.querySelector("[name='residenceofInterest1']") as HTMLSelectElement;

      const selectedResidence = residenceSelectElement.options[residenceSelectElement.selectedIndex].value;
      const selectedLivingOption = livingOptionSelected.options[livingOptionSelected.selectedIndex].value;

      if (selectedLivingOption == "MC" && selectedResidence == "11280") {
        residenceSelectElement.value = "11279";
      }
      if (selectedLivingOption != "MC" && selectedResidence == "11279") {
        residenceSelectElement.value = "11280";
      }
    };

    if (batElqForm) (document.querySelector("input.submit-button-style") as HTMLInputElement).addEventListener("click", updateYardiId);
  });
};
