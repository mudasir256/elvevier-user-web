import { MongoClient, Db } from "mongodb";

const MONGO_URI = process.env.MONGO_URI!;
const DB_NAME = process.env.DB_NAME || "elvevier";

let cached: { client: MongoClient; db: Db } | null = null;

export async function getDb(): Promise<Db> {
  if (cached) return cached.db;

  const client = new MongoClient(MONGO_URI, {
    tls: true,
    serverSelectionTimeoutMS: 10000,
  });
  await client.connect();
  const db = client.db(DB_NAME);
  cached = { client, db };
  return db;
}
