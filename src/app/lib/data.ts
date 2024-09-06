
import {
    pgTable,
    serial,
    text,
    uniqueIndex,
    uuid,
  } from 'drizzle-orm/pg-core';
   
  export const customers = pgTable(
    'customers',
    {
      id: serial('id').primaryKey(),
      name: text('name').notNull(),
      email: text('email').notNull(),
      image_url: text('image_url').notNull(),
    },
    (customers) => {
      return {
        uniqueIdx: uniqueIndex('unique_idx').on(customers.email),
      };
    },
  );

  export const test = pgTable('test', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
  });