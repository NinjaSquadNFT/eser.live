// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { type Handlers } from "$fresh/server.ts";
import { getCursor } from "@/pkg/main/library/data/cursors.ts";
import { type LoggedInState } from "@/pkg/main/plugins/session.ts";
import { storyRepository } from "@/pkg/main/data/repositories/stories.ts";

const PAGE_SIZE = 10;

export const handler: Handlers<undefined, LoggedInState> = {
  async GET(req, _ctx) {
    const cursor = getCursor(req.url, PAGE_SIZE);
    const result = await storyRepository.findAllWithDetails(
      cursor,
    );

    return Response.json(result);
  },
};
