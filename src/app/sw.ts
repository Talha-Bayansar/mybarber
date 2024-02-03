import { installSerwist } from "@serwist/sw";

installSerwist({
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  navigateFallback: "/offline",
});
