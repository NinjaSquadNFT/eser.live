// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { sessionSchema } from "./schema.ts";

export type Session = typeof sessionSchema.$inferSelect;
export type SessionPartial = typeof sessionSchema.$inferInsert;
