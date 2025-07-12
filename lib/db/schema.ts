import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey(),
});

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),

  // File/Folder Info
  name: text("name").notNull(),
  path: text("path").notNull(),
  size: integer("size").notNull(),
  type: varchar("type", { enum: ["FILE", "FOLDER"] }).notNull(),

  // Storage Info
  fileUrl: text("file_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),

  // Owner Info
  owner: text("owner").notNull(),
  parentId: uuid("parent_id"),

  // Boolean Flags
  isFolder: boolean("is_folder").default(false).notNull(),
  isStarred: boolean("is_starred").default(false).notNull(),
  isTrash: boolean("is_trash").default(false).notNull(),

  // Time Stamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const filesRealtions = relations(files, ({ one, many }) => ({
  parent: one(files, {
    fields: [files.parentId], // FK (id of another file/folder)
    references: [files.id], // another file/folder id (files pk)
  }),

  children: many(files), // Other file/folder whose parentId == id (files pk)
}));

// Types
export const File = typeof files.$inferSelect;
export const NewFile = typeof files.$inferInsert