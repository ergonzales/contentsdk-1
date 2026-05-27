import { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Pagination from "components/chartwellComponents/content/ResourceList/Pagination";

export default {
  title: "Feature/Resource Cards/Pagination",
  component: Pagination,
  argTypes: {},
} as Meta<typeof Pagination>;

const Template: StoryFn<typeof Pagination> = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const handlePageChange = (pageNumber: number) => {
    action(`Page changed to ${pageNumber}`)();
    setCurrentPage(pageNumber);
  };
  const handleNext = () => {
    setCurrentPage(1);
  };
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onChange={handlePageChange}
      backText={{ value: "Back" }}
      nextText={{ value: "Next" }}
      onBack={handleNext}
      onNext={handleNext}
      hasBack={true}
      hasNext={true}
      setNumber={0}
    />
  );
};

export const Default = Template.bind({});

Default.args = {};
