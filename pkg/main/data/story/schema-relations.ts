// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { relations } from "drizzle-orm/relations";
import { storySchema } from "./schema.ts";
import { profileSchema } from "../profile/schema.ts";

export const storyRelations = relations(storySchema, ({ one }) => ({
  authorProfile: one(profileSchema, {
    fields: [storySchema.authorProfileId],
    references: [profileSchema.id],
  }),
}));
