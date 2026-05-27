import { siteSearch } from "components/chartwellComponents/gqlQueryLib/PropertyHeaderNav";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const { q, language } = query;
  if (!language || language === "") {
    res.status(400).json({ message: "Error" });
    return;
  }

  try {
    const data = await siteSearch(q as string, language as string);
    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ message: "Error" });
  }
}
