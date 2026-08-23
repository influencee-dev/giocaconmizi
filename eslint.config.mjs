import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      // Generato da Next a ogni build
      "next-env.d.ts",
      // Il plugin WordPress Gestiamo Horeca vive nello stesso repo: fuori dal lint JS.
      "assets/**",
      "modules/**",
      "includes/**",
      "docker/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
