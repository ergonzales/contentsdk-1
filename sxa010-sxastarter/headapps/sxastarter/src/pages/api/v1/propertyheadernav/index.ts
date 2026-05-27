import { PropertyNavItems } from "lib/database-operations/graphql/PropertyHeaderNav";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const { language, itemid } = query;
  if (!language || language === "") {
    res.status(400).json({ message: "Error" });
    return;
  }
  try {
    const data = await PropertyNavItems(language as string, itemid as string);
    res.status(200).json({ data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
