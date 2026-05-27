import { useState, useEffect } from "react";

function useJavascriptEnabled() {
  const [isJavascriptEnabled, setIsJavascriptEnabled] = useState(false);

  useEffect(() => {
    if (document.getElementById("cwApp")?.classList.contains("no-js")) {
      setIsJavascriptEnabled(false);
    } else {
      setIsJavascriptEnabled(true);
    }
  }, []);
  return isJavascriptEnabled;
}
export default useJavascriptEnabled;
