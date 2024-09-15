// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.
// Copied from std/_tools/check_license.ts

import * as fsWalk from "@std/fs/walk";

const EXTENSIONS = [".ts", ".tsx"];
const EXCLUDED_PATTERNS = [
  /node_modules\/*$/,
  /_fresh\/*$/,
  /test\/coverage\/*$/,
  /content\/*$/,
  /temp\/*$/,
  /static\/*$/,
  /pkg\/old\-/,
  /fresh.gen.ts/,
];

const ROOT = new URL("../../", import.meta.url);
const CHECK = Deno.args.includes("--check");
const BASE_YEAR = "2023";
// const CURRENT_YEAR = new Date().getFullYear();
const RX_COPYRIGHT =
  /\/\/ Copyright ([0-9]{4})-present Eser Ozvataf and other contributors\. All rights reserved\. Apache-2.0 license\.\n/;
const COPYRIGHT =
  `// Copyright ${BASE_YEAR}-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.`;

let failed = false;

for await (
  const { path } of fsWalk.walk(ROOT, {
    exts: EXTENSIONS,
    skip: EXCLUDED_PATTERNS,
    includeDirs: false,
  })
) {
  const content = await Deno.readTextFile(path);
  const match = content.match(RX_COPYRIGHT);

  if (!match) {
    if (CHECK) {
      console.error(`Missing copyright header: ${path}`);
      failed = true;
    } else {
      const contentWithCopyright = COPYRIGHT + "\n" + content;
      await Deno.writeTextFile(path, contentWithCopyright);
      console.log("Copyright header automatically added to " + path);
    }
  } else if (match[1] !== BASE_YEAR) {
    if (CHECK) {
      console.error(`Incorrect copyright year: ${path}`);
      failed = true;
    } else {
      const index = match.index ?? 0;
      const contentWithoutCopyright = content.replace(match[0], "");
      const contentWithCopyright = contentWithoutCopyright.substring(0, index) + COPYRIGHT + "\n" +
        contentWithoutCopyright.substring(index);
      await Deno.writeTextFile(path, contentWithCopyright);
      console.log("Copyright header automatically updated in " + path);
    }
  }
}

if (failed) {
  console.info(`Copyright header should be "${COPYRIGHT}"`);
  Deno.exit(1);
}
