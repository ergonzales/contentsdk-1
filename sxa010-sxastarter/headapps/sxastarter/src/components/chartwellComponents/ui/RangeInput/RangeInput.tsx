import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Dispatch } from "react";
import { debounce } from "lib/helpers/utils/debounce";

export const RangeInput = ({ setDistance }: { setDistance: Dispatch<React.SetStateAction<number>> }) => {
  const distanceHandler = (value: number | number[]) => {
    setDistance(Array.isArray(value) ? value[0] : value);
  };

  const debouncedRangeInput = debounce(distanceHandler, 300);

  const marks = [
    {
      value: 5,
      label: "5 km",
    },
    {
      value: 25,
      label: "25 km",
    },
    {
      value: 50,
      label: "50 km",
    },
  ];

  return (
    <div className="">
      <div className="">
        <Box sx={{ width: 260 }}>
          <Slider
            onChange={(_: any, value: any) => debouncedRangeInput(value)}
            defaultValue={25}
            max={50}
            min={5}
            aria-label="Distance"
            marks={marks}
            valueLabelDisplay="auto"
            sx={{
              color: "white",
              "& .MuiSlider-mark": {
                backgroundColor: "white",
                height: "8px",
                width: "2px",
                "&.MuiSlider-markActive": {
                  backgroundColor: "white",
                },
              },
              "& .MuiSlider-markLabel": {
                color: "white",
                fontSize: "0.8rem",
              },
              "& .MuiSlider-valueLabel": {
                border: "1px solid black",
                backgroundColor: "white",
                color: "black",
              },
            }}
          />
        </Box>
      </div>
    </div>
  );
};
