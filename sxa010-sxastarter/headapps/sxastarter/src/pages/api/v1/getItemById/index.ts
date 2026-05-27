import { getItemById } from "components/chartwellComponents/gqlQueryLib/getItemById";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, language, ownFields } = req.query;

  if (typeof id !== "string" || !id.trim()) {
    res.status(400).json({ error: "Invalid or missing id parameter" });
    return;
  }

  try {
    const lang = typeof language === "string" ? language : "en";
    const ownFieldsBool = ownFields === "true";
    const data = await getItemById(id, lang, ownFieldsBool);
    if (!data) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) });
  }
}
