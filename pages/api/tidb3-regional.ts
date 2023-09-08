import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const start = Date.now();

export default async function api(request: NextApiRequest,
                                  response: NextApiResponse) {
  const count = Number(request.query.count);
  const time = Date.now();

  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    port: 4000,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: 'test',
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });

  let data = null;
  for (let i = 0; i < count; i++) {
    data = await connection.execute(`
      SELECT emp_no, first_name, last_name
      FROM employees
      LIMIT 10`)
  }

  return response.json({
    data,
    queryDuration: Date.now() - time,
    invocationIsCold: start === time,
  });
}

// convert a query parameter to a number, applying a min and max, defaulting to 1
function toNumber(queryParam: string | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? 1 : Math.min(Math.max(num, min), max);
}
