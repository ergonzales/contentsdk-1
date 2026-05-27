import { getAllResidence } from "lib/database-operations/graphql/Residence";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const { language, provinceid } = query;
  if (!language || language === "" || !provinceid || provinceid === "") {
    res.status(400).json({ message: "Language or residenceitemids is not set" });
    return;
  }

  try {
    const data = await getAllResidence(provinceid as string, language as string);
    res.status(200).json({ data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
