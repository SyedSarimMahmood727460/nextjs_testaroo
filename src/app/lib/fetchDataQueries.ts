import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './data';

// No need to manually set up the client, @vercel/postgres handles it
export const db = drizzle(sql);

export const getCustomers = async () => {
  try {
    return await db.select().from(schema.customers);
  } catch (error) {
    console.error('Error in getCustomers:', error);
    throw error;
  }
};

export const insertTestData = async (id: number, name: string) => {
  try {
    await db.insert(schema.test).values({
      id: id,
      name: name,
    });
  } catch (error) {
    console.error('Error in insertTestData:', error);
    throw error;
  }
};