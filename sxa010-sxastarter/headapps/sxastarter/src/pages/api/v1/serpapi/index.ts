export default async function handler(req: any, res: any) {
  const { place_id, sort_by, next_page_token } = req.query;
  // const API_KEY = config.serpApiKey;
  const API_KEY = process.env.SERP_API_KEY || "";

  try {
    const url = `https://serpapi.com/search.json?engine=google_maps_reviews&place_id=${place_id}&sort_by=${sort_by}&next_page_token=${next_page_token}&api_key=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);

    const responseData = await response.json();

    return res.status(200).json(responseData);
  } catch (error: any) {
    // console.error(`Error fetching data from Google Maps API: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
}
