import type { NextConfig } from "next";
import path from "node:path";

// Pin the workspace root to THIS project directory. Without this, Next/Turbopack
// walks up the tree, finds ~/yarn.lock + ~/package.json, and treats /home/jay as
// the workspace root - which makes it resolve modules from the wrong node_modules
// and breaks imports like 'lucide-react', 'framer-motion', and 'tailwindcss'.
const projectRoot = path.resolve(
  process.cwd().includes("healthcare-management-system-requirements-NEXT")
    ? process.cwd()
    : __dirname
);

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
