import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "components/ui/button": "src/components/ui/button.tsx",
    "components/ui/card": "src/components/ui/card.tsx",
    "index": "src/index.ts",
    "lib/utils": "src/lib/utils.ts"
},
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".cjs" : ".js",
    };
  },
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
