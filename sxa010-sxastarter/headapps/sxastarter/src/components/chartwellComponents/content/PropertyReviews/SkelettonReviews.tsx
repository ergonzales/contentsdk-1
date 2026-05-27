import { StarIcon } from "@heroicons/react/24/outline";

export const SkeletonReviews = () => {
  return (
    <div className="ChartwellContainer SectionPadding  bg-ChartwellWhite">
      <div className="animate-pulse">
        <div className="py-4 px-6">
          {/* Sort by placeholder */}
          <div className="flex justify-between items-center mb-4">
            <div className="w-1/3 h-6 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Reviews placeholder */}
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flow-root mt-6 bg-ChartwellWhite rounded-md shadow-md p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-ChartwellPlum rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                <div className="mt-1 flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon key={rating} className={"text-yellow-400 fill-yellow-400 h-8 w-8 flex-shrink-0"} aria-hidden="true" />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        ))}

        {/* Pagination placeholders */}
        <div className="flex items-center justify-center gap-4 my-8">
          <div className="w-32 h-12 bg-ChartwellPlum-40 rounded"></div>
          <div className="w-32 h-12 bg-ChartwellPlum-40 rounded"></div>
        </div>
      </div>
    </div>
  );
};
