# esbuild-plugin-rewrite-relative-import-extensions

This plugin rewrites `.jsx`, `.ts` and `.tsx` imports to `.js` for transform
mode (bundle: false). Please see https://github.com/evanw/esbuild/issues/2435.

It rewrites paths the same way
[__rewriteRelativeImportExtension](https://github.com/microsoft/TypeScript/blob/main/src/compiler/factory/emitHelpers.ts#L1456)
from Typescript does!

## Install

```ts
import { context } from "npm:esbuild";
import { expandGlobSync } from "jsr:@std/fs";
import { rewriteRelativeImportExtensionsPlugin } from "jsr:@onyx/esbuild-plugin-rewrite-relative-import-extensions";

const src = "public/src";

const entryPoints = [
  ...expandGlobSync(`${src}/**/*.{ts,jsx,tsx}`),
].map((entry) => entry.path);

const ctx = await context({
  bundle: false,
  entryPoints,
  jsx: "automatic",
  outdir: src,
  plugins: [rewriteRelativeImportExtensionsPlugin()],
  sourcemap: "inline",
});

await ctx.watch();

console.log("Watching files ✨");
```

If you get issues with the output generation, use `outbase: src`.
