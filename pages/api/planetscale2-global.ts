import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import { NextRequest as Request, NextResponse as Response } from "next/server";
import {NextApiRequest, NextApiResponse} from "next";

interface EmployeeTable {
  emp_no: number;
  first_name: string;
  last_name: string;
}

interface Database {
  employees: EmployeeTable;
}

const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  }),
});

const start = Date.now();

export default async function api(request: NextApiRequest,
                                  response: NextApiResponse) {
  const count = Number(request.query.count);
  const time = Date.now();


  let data = null;
  for (let i = 0; i < count; i++) {
    data = await db
    .selectFrom("employees")
    .select(["emp_no", "first_name", "last_name"])
    .limit(10)
    .execute();
  }

  return response.json(
      {
        data,
        queryDuration: Date.now() - time,
        invocationIsCold: start === time,
      }
  );
}

// convert a query parameter to a number
// also apply a min and a max
function toNumber(queryParam: string | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? null : Math.min(Math.max(num, min), max);
}
