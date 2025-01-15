/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import unpluginIcons from "unplugin-icons/webpack";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  webpack(config) {
    config.plugins.push(
      unpluginIcons({
        compiler: "jsx",
        jsx: "react",
      }),
    );
    return config;
  },
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'a.ltrbxd.com',
    }, {
      protocol: 'https',
      hostname: 'image.tmdb.org',
    }, {
      protocol: 'https',
      hostname: '**',
    }]
  },
};

export default config;
