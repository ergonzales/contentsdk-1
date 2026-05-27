
import Leaf from "../../../../../public/canada-maple-leaf.svg";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";
const MapleLeaf = () => {
  const { sitecoreContext } = useSitecoreContext();
  const language = sitecoreContext?.language;
  const altText = language == "en" ? "Proudly Canadian" : "Fièrement canadien";
  return (
    <span className="ml-0 md:mx-4 lg:mr-4 lg:flex ml-auto grow items-center justify-end" title={altText}>
      <img src={`${Leaf.src}`} style={{ width: "26px", height: "26px", display: "block" }} alt={altText} />
    </span>
  );
};
export default MapleLeaf;
