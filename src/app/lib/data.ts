import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  foreignKey,
  index
} from 'drizzle-orm/pg-core';


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

export const userErrorCounts = pgTable('user_error_counts', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  job_id: text('job_id').notNull(),
  error_count: integer('error_count').notNull(),
}, (table) => {
  return {
    userIdIdx: index('idx_user_error_counts_user_id').on(table.user_id),
    jobIdIdx: index('idx_user_error_counts_job_id').on(table.job_id)
  };
});