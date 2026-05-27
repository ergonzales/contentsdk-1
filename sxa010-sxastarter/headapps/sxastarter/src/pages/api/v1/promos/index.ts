import { GetCultureSpecificPromos } from "lib/database-operations/graphql/Promos";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const { language, itemid, fieldname } = query;
  if (!language || language === "") {
    res.status(400).json({ message: "Error" });
    return;
  }
  try {
    const data = await GetCultureSpecificPromos(language as string, itemid as string, fieldname as string);
    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ message: "Error" });
  }
}
