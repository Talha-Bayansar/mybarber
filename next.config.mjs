import withPWAInit from "@ducanh2912/next-pwa";
import withNextIntlInit from "next-intl/plugin";

const withNextIntl = withNextIntlInit();

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
  fallbacks: {
    document: "/offline",
  },
  cacheStartUrl: true,
});

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "eu.ui-avatars.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "eu-central-1.storage.xata.sh",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA(withNextIntl(config));
