import { neon, neonConfig } from "@neondatabase/serverless";
import { NextRequest as Request, NextResponse as Response } from "next/server";
import {NextApiRequest, NextApiResponse} from "next";

neonConfig.fetchConnectionCache = true;

const start = Date.now();

export default async function api(request: NextApiRequest,
                                  response: NextApiResponse) {
  const count = Number(request.query.count);
  const time = Date.now();

  const sql = neon(process.env.NEON_DATABASE_URL);

  let data = null;
  for (let i = 0; i < count; i++) {
    data = await sql`
      SELECT "emp_no", "first_name", "last_name" 
      FROM "employees" 
      LIMIT 10`;
  }

  return response.json({
    data,
    queryDuration: Date.now() - time,
    invocationIsCold: start === time,
  });
}
