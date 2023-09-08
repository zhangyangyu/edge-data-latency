import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '@tidbcloud/serverless';

const start = Date.now();

export default async function api( request: NextApiRequest,
                                   response: NextApiResponse) {
  const count = Number(request.query.count);
  const time = Date.now();

  const conn = connect({url: process.env.TiDB_DATABASE_URL})

  let data = null;
  for (let i = 0; i < count; i++) {
    data = await conn.execute(`
      SELECT emp_no, first_name, last_name
      FROM employees
      LIMIT 10`)
  }


  return response.json({
    data,
    queryDuration: Date.now() - time,
    invocationIsCold: start === time,
    invocationRegion: (req.headers.get("x-vercel-id") ?? "").split(":")[1] || null,
  });
}

// convert a query parameter to a number, applying a min and max, defaulting to 1
function toNumber(queryParam: string | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? 1 : Math.min(Math.max(num, min), max);
}
