import { defineConfig } from "tsup";

export default defineConfig({
  target: "es6", // 트랜스파일 대상
  // format: ["esm", "cjs"], // ESM + CommonJS 포맷 지원
  format: ["esm"], // ESM + CommonJS 포맷 지원
  outExtension: (_) => ({ js: ".mjs" }),
  entry: ["src/index.ts"], // 루트 entry 파일
  outDir: "dist", // 출력 디렉토리

  platform: "node",
  external: ["prettier"], //번들에 포함하지 않을 외부 라이브러리 지정

  dts: true, // 타입 선언 파일(.d.ts) 생성
  minify: true, // JS 파일을 압축(minify) 해서 더 작게 만듭니다.
  sourcemap: true, // 소스맵 생성
  clean: true, // 빌드 전 dist 폴더 정리
  treeshake: true, //사용하지 않는 코드를 제거합니다. 기본은 true지만 명시
});
