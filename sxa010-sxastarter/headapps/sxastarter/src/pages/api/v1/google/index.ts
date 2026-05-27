import fs from "fs";
import path from "path";
import cron from "node-cron";
import axios from "axios";

// Function to fetch place details
async function fetchPlaceDetails(placeId: string, API_KEY: string) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}&reviews_no_translations=true`;
  const response = await axios.get(url);
  if (response.status !== 200) throw new Error(`Failed to fetch data: ${response.statusText}`);
  return response.data;
}

// Function to ensure the directory exists
function ensureDirectoryExistence(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Function to update file with place details
function updateFile(fileName: string, data: any) {
  const dir = path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "reviews");
  ensureDirectoryExistence(dir);
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data));
  console.log("File updated successfully.");
}

// Handler
export default async function handler(req: any, res: any) {
  const { place_id } = req.query;
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  if (!place_id || !API_KEY) {
    return res.status(400).json({ error: "Missing required parameters: place_id or server configuration" });
  }

  const fileName = `${place_id}.json`;
  const filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "reviews", fileName);

  try {
    // Schedule cron job only once
    if (!(global as any).cronJobScheduled) {
      (global as any).cronJobScheduled = true;
      cron.schedule("0 0 1-7,15-21 * * 1", async () => {
        try {
          const data = await fetchPlaceDetails(place_id, API_KEY);
          updateFile(fileName, { data });
        } catch (error) {
          console.error("Error in cron job:", (error as any).message);
        }
      });
    }

    // Return cached data if available
    if (fs.existsSync(filePath)) {
      const dataFs = fs.readFileSync(filePath, "utf-8");
      const reviews = JSON.parse(dataFs);
      return res.status(200).json(reviews);
    }

    // Fetch data and cache it
    const data = await fetchPlaceDetails(place_id, API_KEY);
    updateFile(fileName, { data });
    return res.status(200).json({ data });
  } catch (error) {
    console.error("Error handling request:", (error as any).message);
    return res.status(500).json({ error: (error as any).message });
  }
}
