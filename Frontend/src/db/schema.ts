import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const auditHistory = pgTable("audit_history", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  status: integer("status"),
  responseTime: integer("response_time"),
  title: text("title"),
  metaDescription: text("meta_description"),
  h1Count: integer("h1_count"),
  missingAltImages: integer("missing_alt_images"),
  wordCount: integer("word_count"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
