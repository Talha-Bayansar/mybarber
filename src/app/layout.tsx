import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { type Metadata } from "next";
import { cn } from "~/lib";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MyBarber",
  description: "Official MyBarber PWA",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["My", "Barber", "MyBarber", "Hair", "Haircut", "Reservation"],
  authors: [
    { name: "Talha Bayansar" },
    {
      name: "Talha Bayansar",
      url: "https://www.linkedin.com/in/talha-bayansar-17039a19a/",
    },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    startupImage: [
      {
        media:
          "screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
        url: "/splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_landscape.png",
      },
      {
        media:
          "screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
        url: "/splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_landscape.png",
      },
      {
        media:
          "screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
        url: "/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png",
      },
      {
        media:
          "screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
        url: "/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png",
      },
      {
        media:
          "screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
        url: "/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png",
      },
      {
        media:
          "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
        url: "/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png",
      },
      {
        media:
          "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/iPhone_11__iPhone_XR_landscape.png",
      },
      {
        media:
          "screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
        url: "/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png",
      },
      {
        media:
          "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png",
      },
      {
        media:
          "screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png",
      },
      {
        media:
          "screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/12.9__iPad_Pro_landscape.png",
      },
      {
        media:
          "screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png",
      },
      {
        media:
          "screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/10.9__iPad_Air_landscape.png",
      },
      {
        media:
          "screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/10.5__iPad_Air_landscape.png",
      },
      {
        media:
          "screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/10.2__iPad_landscape.png",
      },
      {
        media:
          "screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png",
      },
      {
        media:
          "screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
        url: "/splash_screens/8.3__iPad_Mini_landscape.png",
      },
      {
        media:
          "screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
        url: "/splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png",
      },
      {
        media:
          "screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
        url: "/splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png",
      },
      {
        media:
          "screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
        url: "/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png",
      },
      {
        media:
          "screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
        url: "/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png",
      },
      {
        media:
          "screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
        url: "/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png",
      },
      {
        media:
          "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
        url: "/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png",
      },
      {
        media:
          "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/iPhone_11__iPhone_XR_portrait.png",
      },
      {
        media:
          "screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
        url: "/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png",
      },
      {
        media:
          "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png",
      },
      {
        media:
          "screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png",
      },
      {
        media:
          "screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/12.9__iPad_Pro_portrait.png",
      },
      {
        media:
          "screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png",
      },
      {
        media:
          "screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/10.9__iPad_Air_portrait.png",
      },
      {
        media:
          "screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/10.5__iPad_Air_portrait.png",
      },
      {
        media:
          "screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/10.2__iPad_portrait.png",
      },
      {
        media:
          "screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png",
      },
      {
        media:
          "screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
        url: "/splash_screens/8.3__iPad_Mini_portrait.png",
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  shrinkToFit: "no",
  viewPortFit: "cover",
  userScalable: "no",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "bg-background flex min-h-screen w-full font-sans antialiased",
            inter.variable,
          )}
        >
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
