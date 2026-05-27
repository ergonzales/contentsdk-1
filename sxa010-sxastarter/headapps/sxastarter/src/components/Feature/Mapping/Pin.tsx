import * as React from "react";

export type PinProps = {
  name: string;
};

function Pin(props: PinProps) {
  return <img alt={props.name} src="/stories/Map Banner/chartwell_pin.svg" height="50px" width="50px" />;
}
export default React.memo(Pin);
