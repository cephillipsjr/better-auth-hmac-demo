import { pgTable, time, date, serial, varchar, integer, text, jsonb, boolean } from 'drizzle-orm/pg-core';

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }).notNull(),
  age: integer('age').notNull(),
  fatherName: varchar('father_name', { length: 200 }).notNull(),
  role: varchar('role', { length: 100 }).notNull(),
  birthDate: date('birth_date').notNull(),
  startTime: time('start_time'),
  gender: varchar('gender', { length: 50 }).notNull(),
  status: integer('status').notNull(),
  contact: varchar('contact', { length: 50 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  location: text('location').notNull(),
  about: text('about').notNull(),
  skills: jsonb('skills').notNull().$type<string[]>(),
  contactPublic: boolean('contact_public').notNull().default(false),
  availableToHire: boolean('available_to_hire').notNull().default(false)
});
