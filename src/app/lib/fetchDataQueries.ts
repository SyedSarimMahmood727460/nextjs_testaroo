import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './data';


export const db = drizzle(sql);

export const getCustomers = async () => {
  return await db.select().from(schema.customers);
};

export const insertTestData = async (name: string) => {
  await db.insert(schema.test).values({
    name: name,
  });
};


