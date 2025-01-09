/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: "@mdx-js/loader",
          options: {
            providerImportSource: "@mdx-js/react",
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;
