import fs from "node:fs";
import path from "node:path";
import type { Plugin, PluginBuild } from "esbuild";
import { rewriteRelativeImportExtension } from "./rewriteRelativeImportExtension.ts";

export interface RewriteRelativeImportPluginExtensionsOptions {
  /** If set to `true` paths ending with `.tsx` and `.jsx` will be `.jsx` instead. */
  preserveJsx?: boolean;
}

/** Please see https://github.com/evanw/esbuild/issues/2435 */
export function rewriteRelativeImportExtensionsPlugin(
  options: RewriteRelativeImportPluginExtensionsOptions = {},
): Plugin {
  return {
    name: "rewrite-relative-import-extensions",
    setup(build: PluginBuild) {
      const write = build.initialOptions.write;
      build.initialOptions.write = false;

      build.onEnd((result) => {
        const files = result.outputFiles ?? [];

        for (const file of files) {
          let output = file.text;

          const matches = output.matchAll(
            /(?<=(?:import|export\s*[*{])[^"']+["'])([^"']+)(?=["'])/g,
          );

          for (const match of matches) {
            output = output.replaceAll(match[0], (m, index) => {
              if (match.index !== index) {
                return m;
              }

              return rewriteRelativeImportExtension(m, options.preserveJsx);
            });
          }

          if (write === undefined || write) {
            fs.mkdirSync(path.dirname(file.path), { recursive: true });
            fs.writeFileSync(file.path, output);
          }
        }
      });
    },
  };
}
