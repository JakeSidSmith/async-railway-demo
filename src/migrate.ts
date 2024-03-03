import pg from "pg";

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const pgClient = new pg.Client({
  connectionString: DATABASE_URL,
});

await pgClient.connect();

await pgClient.query(`
  CREATE TABLE IF NOT EXISTS counter (
    count INT
  )
`);

await pgClient.query(`
  INSERT INTO counter (count)
  SELECT 0
  WHERE NOT EXISTS (SELECT * FROM counter)
`);

await pgClient.end();
