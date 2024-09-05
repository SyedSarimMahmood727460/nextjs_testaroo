import { drizzle } from 'drizzle-orm/vercel-postgres';
import { db } from '@vercel/postgres';
import * as schema from './data';
export const client = drizzle(db, { schema });

 
export const getCustomers = async () => {
  return client.query.customers.findMany();
};

export const insertTestData = async (id: number, name: string) => {
  await client.insert(schema.test).values({
    id: id,
    name: name,
  });
};
