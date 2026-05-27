// const API_KEY = "864825cd9dc732cd92cd24e16694fd276047e1055db9645be04c1e99ee6ac63a";
// const API_KEY = "f035fdd0e8dd53e8cf56719cb98fa59d75648341ad6e01d456b7192cd37c4577"; //over 100 request

// import scConfig from 'sitecore.config';

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
