/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
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
