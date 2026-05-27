import { useEffect, useState, useCallback } from "react";
import { ArrowUp } from "lucide-react";
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const SCROLL_THRESHOLD = 1600;

  const toggleVisibility = useCallback(() => {
    if (typeof window !== "undefined" && window.scrollY > SCROLL_THRESHOLD) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", toggleVisibility);
      toggleVisibility();
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", toggleVisibility);
      }
    };
  }, [toggleVisibility]);

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={` fixed bottom-28 right-8 z-20 bg-ChartwellWhite text-ChartwellBlue border border-ChartwellBlue  
        rounded-full w-12 h-12 cursor-pointer flex items-center justify-center  transition-opacity duration-30  ease-in-out 
        group
        ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <ArrowUp className="h-6 w-6 lg:group-hover:scale-125  duration-300 ease-in-out" />
    </button>
  );
};

export default ScrollToTopButton;
