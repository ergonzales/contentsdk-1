import { TranslateBlogTag } from "lib/database-operations/graphql/TranslateBlogTags";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;

  const { language } = query;
  if (!language || language === "") {
    res.status(400).json({ message: "Error" });
    return;
  }
  try {
    const data = await TranslateBlogTag(language as string);
    res.status(200).json({ data });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}
