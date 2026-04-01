/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    // adapterPath: import.meta.resolve("next-bun-compile"),
  },
  output: "standalone",
}

export default nextConfig
