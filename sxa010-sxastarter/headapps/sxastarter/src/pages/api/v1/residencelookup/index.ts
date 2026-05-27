import { getResidencesByName } from "lib/database-operations/graphql/ResidenceLookup";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const { residencequery } = query;
  // if (!language || language === "") {
  //   res.status(400).json({ message: "Language or provinceid is not set" });
  //   return;
  // }

  try {
    const data = await getResidencesByName(residencequery as string);
    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ error: e });
  }
}
