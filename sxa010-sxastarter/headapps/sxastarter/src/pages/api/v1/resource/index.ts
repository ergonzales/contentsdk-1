import { getResourceCards } from "lib/database-operations/graphql/Resource";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const { language, endCursor, personalizationCategory, category } = query;
  if (!language || language === "") {
    res.status(400).json({ message: "Language is not set" });
    return;
  }
  try {
    const data = await getResourceCards(language as string, endCursor as string, personalizationCategory as string, category as string);

    res.status(200).json({ data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
