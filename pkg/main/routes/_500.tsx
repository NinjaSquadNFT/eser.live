// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
import type { PageProps } from "$fresh/server.ts";
import type { State } from "@/pkg/main/plugins/session.ts";

// deno-lint-ignore no-explicit-any
export const Error500Page = (props: PageProps<any, State>) => {
  return (
    <main>
      <div class="content-area">
        <h1>Sunucu kaynaklı hata</h1>
        <p>500 internal error: {(props.error as Error).message}</p>
        <p>
          <a href="/">Geri dön &#8250;</a>
        </p>
      </div>
    </main>
  );
};

export default Error500Page;
