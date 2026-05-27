import { getAllProvince } from "lib/database-operations/graphql/Province";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const { language } = query;
  if (!language || language === "") {
    res.status(400).json({ message: "Language is not set" });
    return;
  }

  try {
    const data = await getAllProvince(language as string);
    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ error: e });
  }
}
