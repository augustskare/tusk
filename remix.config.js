/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  future: {
    unstable_vanillaExtract: true,
  },
  serverDependenciesToBundle: [
    /^hast.*/,
    /^vfile.*/,
    "unist-util-stringify-position",
    "property-information",
    "web-namespaces",
    "space-separated-tokens",
    "comma-separated-tokens",
  ],
};
