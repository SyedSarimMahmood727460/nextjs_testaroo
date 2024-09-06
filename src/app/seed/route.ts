import { db } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from 'drizzle-orm';
const drizzleDb = drizzle(db);


async function seedUsers() {
    await drizzleDb.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  
    await drizzleDb.execute(sql`
      CREATE TABLE IF NOT EXISTS test (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);
  }
  
export async function GET() {
  try {
    const client = await db.connect();

    await client.sql`BEGIN`;
    await seedUsers();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ message: 'Database not seeded successfully' });
  }
}
