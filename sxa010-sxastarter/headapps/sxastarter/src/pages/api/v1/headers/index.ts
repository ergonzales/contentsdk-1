import { GetSearchHeader } from "lib/database-operations/graphql/Headers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const { language, searchterm } = query;
  if (!language || language === "") {
    res.status(400).json({ message: "Error" });
    return;
  }
  try {
    const data = await GetSearchHeader(language as string, searchterm as string);
    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ message: "Error" });
  }
}
