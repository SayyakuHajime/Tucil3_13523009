import { Baloo_2, Poppins } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600"],
  display: "swap",
});

// Metadata for all pages
export const metadata = {
  title: "Rush Hour Solver",
  description: "Solve Rush Hour puzzles using different pathfinding algorithms",
  icons: {
    icon: [
      { url: "/img/rushhour_logo.png" },
      { url: "/favicon.ico" }
    ],
    apple: { url: "/img/rushhour_logo.png" },
  },
  manifest: "/manifest.json",
  applicationName: "Rush Hour Solver",
  appleWebApp: { capable: true, title: "Rush Hour Solver", statusBarStyle: "default" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${baloo.variable} ${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}