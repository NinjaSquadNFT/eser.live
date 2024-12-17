// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import { useSignal } from "@preact/signals";
import type { Handlers, PageProps } from "$fresh/server.ts";
import { storyRepository } from "@/pkg/main/data/story/repository.ts";
import { ensureMediaTypes, type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import NewsFormIsland from "./(_islands)/news-form-island.tsx";

type HandlerResult = {
  success?: boolean;
  error?: string;
};

export const handler: Handlers<HandlerResult, State> = {
  async POST(req, ctx) {
    ensureMediaTypes(req, ["application/json", "text/html"]);

    try {
      return new Response("", {
        status: 303,
        headers: { Location: "/news/" },
      });
    } catch (error) {
      return ctx.render({ error: error.message });
    }
  },
};

export default function NewNewsPage(props: PageProps<HandlerResult, State>) {
  return (
    <>
      <Head title="Yeni Haber" href={props.url.href} />
      <main>
        <div class="content-area">
          <h1 class="text-2xl font-bold mb-4">
            <a href="/news/" class="link link-primary">Haberler</a> / Yeni Haber
          </h1>
          {props.data?.error && <div class="alert alert-error mb-4">{props.data.error}</div>}
          <NewsFormIsland />
        </div>
      </main>
    </>
  );
}
