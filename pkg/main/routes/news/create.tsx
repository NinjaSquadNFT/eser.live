import { Handlers, PageProps } from "$fresh/server.ts";
import { storyRepository } from "@/pkg/main/data/story/repository.ts";
import { assertLoggedIn, type State } from "@/pkg/main/plugins/session.ts";
import { Head } from "@/pkg/main/routes/(common)/(_components)/head.tsx";
import { NewsForm } from "./(_components)/news-form.tsx";
import * as ulid from "jsr:@std/ulid@^1.0.0";

export const handler: Handlers<null, State> = {
  async GET(_req, ctx) {
    await assertLoggedIn(ctx);
    return ctx.render();
  },

  async POST(req, ctx) {
    await assertLoggedIn(ctx);
    const form = await req.formData();

    const story = {
      id: ulid.ulid(),
      kind: "news",
      status: form.get("status"),
      is_featured: form.has("is_featured"),
      slug: form.get("title").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      storyPictureUri: form.get("storyPictureUri"),
      title: form.get("title"),
      description: form.get("description"),
      authorProfileId: ctx.state.user?.id,
      summary: form.get("description"),
      content: form.get("content"),
      publishedAt: form.get("status") === "published" ? new Date() : null,
    };

    await storyRepository.create(story);
    return new Response(null, {
      status: 303,
      headers: { Location: "/news" },
    });
  },
};

export default function(props: PageProps<null, State>) {
  return (
    <>
      <Head title="Create News" href={props.url.href} />
      <main>
        <div class="content-area">
          <h1>Create News</h1>
          <NewsForm />
        </div>
      </main>
    </>
  );
}
