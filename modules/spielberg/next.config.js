const withPWA = require("next-pwa");

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ["aposcar.blob.core.windows.net"],
  },
  pwa: {
    dest: "public",
    dynamicStartUrlRedirect: "/login",
  },
});
