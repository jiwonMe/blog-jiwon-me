import { defineConfig } from "tsup";
import { glob } from "glob";
import path from "path";

// src 디렉토리에서 TypeScript 파일들을 자동으로 찾아서 entry 생성
function generateEntries() {
  const entries: Record<string, string> = {};
  
  // 모든 .ts, .tsx 파일을 찾기 (index.ts 제외하고 개별 컴포넌트들)
  const files = glob.sync("src/**/*.{ts,tsx}", {
    ignore: ["src/**/*.d.ts", "src/**/*.test.{ts,tsx}", "src/**/*.stories.{ts,tsx}"]
  });
  
  files.forEach((file) => {
    // src/ 제거하고 확장자 제거
    const relativePath = path.relative("src", file);
    const entryKey = relativePath.replace(/\.(ts|tsx)$/, "");
    
    entries[entryKey] = file;
  });
  
  return entries;
}

export default defineConfig({
  entry: generateEntries(),
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
  onSuccess: async () => {
    console.log("✅ Build completed successfully!");
    console.log("📦 Generated entries:");
    const entries = generateEntries();
    Object.entries(entries).forEach(([key, value]) => {
      console.log(`   ${key} -> ${value}`);
    });
  },
});
