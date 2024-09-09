import {
  pgTable,
  serial,
  text,
  uniqueIndex,
  uuid,
  timestamp,
  integer
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

export const testResults = pgTable('testresults', {
  id: serial('id').primaryKey(),
  job_id: text('job_id').notNull(),
  url_tested: text('url_tested').notNull(),
  creation_timestamp: timestamp('creation_timestamp').notNull(),
  execution_timestamp: timestamp('execution_timestamp').notNull(),
  rule_id: text('rule_id').notNull(),
  description: text('description').notNull(),
  severity: integer('severity').notNull(),
  tag_name: text('tag_name'),
  location_type: text('location_type'),
  location_spec: text('location_spec')
});