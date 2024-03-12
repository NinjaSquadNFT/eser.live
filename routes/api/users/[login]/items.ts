// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { type Handlers } from "$fresh/server.ts";
import { collectValues, getUser, listQuestionsByUser } from "@/utils/db.ts";
import { getCursor } from "@/utils/http.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const user = await getUser(ctx.params.login);
    if (user === null) throw new Deno.errors.NotFound("User not found");

    const url = new URL(req.url);
    const iter = listQuestionsByUser(ctx.params.login, {
      cursor: getCursor(url),
      limit: 10,
    });
    const values = await collectValues(iter);
    return Response.json({ values, cursor: iter.cursor });
  },
};
