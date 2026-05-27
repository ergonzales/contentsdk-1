import { useState } from "react";
// import { ChartwellModal } from "components/chartwellComponents/ui/modal/ChartwellModal";
import dynamic from "next/dynamic";
import { useI18n } from "next-localization";
import { Gallery } from "../GallerySection/Gallery";
export const GalleryChatBotModal = ({ DAMImages, setOpen, isGalleryOpen, VideoId }: { DAMImages: Array<any>; setOpen: (open: boolean) => void; isGalleryOpen: boolean; VideoId: string }) => {
  const DynamicChartwellModal = dynamic(() => import("components/chartwellComponents/ui/modal/ChartwellModal").then((mod) => mod.ChartwellModal), { ssr: false });
  const [isGallery, setIsGallery] = useState<boolean>(true);
  const { t: dictionary } = useI18n();

  return (
    <DynamicChartwellModal styles="bg-ChartwellWhite flex items-center justify-center  " CloseBTNPosition={"m-[1%]"} open={isGalleryOpen} setOpen={setOpen} isBackButton={true}>
      <div className="ChartwellContainer flex flex-col  ">
        <ul className="flex justify-between px-8 mb-4">
          <li>
            <ul className=" flex items-center  gap-8 ">
              <li>
                <button
                  className={` px-6 py-2 rounded-xl  border text-ChartwellPlum border-ChartwellPlum ${
                    isGallery ? "bg-ChartwellPlum text-ChartwellWhite" : " hover:bg-ChartwellPlum/80 hover:text-ChartwellWhite"
                  } ease-in-out duration-300 `}
                  type="button"
                  onClick={() => setIsGallery(true)}
                >
                  {dictionary("GalleryChatBot")}
                </button>
              </li>
              {VideoId && (
                <li onClick={() => setIsGallery(false)}>
                  <button
                    className={` px-6 py-2 rounded-xl border text-ChartwellPlum border-ChartwellPlum  ${
                      !isGallery ? "bg-ChartwellPlum text-ChartwellWhite" : " hover:bg-ChartwellPlum/80 hover:text-ChartwellWhite"
                    } ease-in-out duration-300 `}
                    onClick={() => setIsGallery(false)}
                    type="button"
                  >
                    {dictionary("Video3DTitle")}
                  </button>
                </li>
              )}
            </ul>
          </li>
        </ul>

        {isGallery ? (
          <Gallery DAMImages={DAMImages} initialInView={true} />
        ) : (
          <iframe
            className={` mx-auto w-full min-h-[310px] sm:min-h-[420px] md:min-h-[475px] xl:min-h-[620px] z-50 drop-shadow-[10px_11px_3px_rgba(0,0,0,0.25)] `}
            src={`https://my.matterport.com/show/?m=${VideoId}`}
            allow="autoplay; fullscreen"
            title={"Embedded Video"}
            aria-label={"Video Player"}
            allowFullScreen
          ></iframe>
        )}
      </div>
    </DynamicChartwellModal>
  );
};
