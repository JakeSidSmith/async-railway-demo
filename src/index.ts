import express from "express";
import pg from "pg";

const { DATABASE_URL, PORT } = process.env;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

if (!PORT) {
  throw new Error("PORT is not set");
}

const pgClient = new pg.Client({
  connectionString: DATABASE_URL,
});

await pgClient.connect();

const expressApp = express();

const createHtml = (count: string | number) => `<html>
  <body>
    <form method="post">
      <p>Count: ${count}</p>
      <button type="submit">Increment</button>
    </form>
  </body>
</html>`;

expressApp.get("/", async (_req, res) => {
  const {
    rows: [{ count }],
  } = await pgClient.query("SELECT count FROM counter");

  res.send(createHtml(count));
});

expressApp.post("/", async (_req, res) => {
  await pgClient.query("UPDATE counter SET count = count + 1");

  const {
    rows: [{ count }],
  } = await pgClient.query("SELECT count FROM counter");

  res.send(createHtml(count));
});

expressApp.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
