import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { reviewsPath } = req.query;

  const allowedBase = path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
  const safePath = path.normalize(reviewsPath as string).replace(/^(\.\.(\/|\\|$))+/, "");
  const directoryPath = path.join(/*turbopackIgnore: true*/ process.cwd(), safePath);

  if (!directoryPath.startsWith(allowedBase + path.sep) && directoryPath !== allowedBase) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const files = await new Promise<any[]>((resolve, reject) => {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            files
              .map((file) => {
                const filePath = path.join(directoryPath, file);
                const fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                return { placeId: fileContent?.data?.result?.place_id, name: fileContent?.data?.result?.name, totalReviews: fileContent?.data?.result?.user_ratings_total, content: fileContent };
              })
              .map((file) => ({ placeId: file.placeId, name: file.name, totalReviews: file.totalReviews, reviews: file.content.data.result.reviews })) // Map files to an array of file names
          );
        }
      });
    });

    res.status(200).json({ files });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
