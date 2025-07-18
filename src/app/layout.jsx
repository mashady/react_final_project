import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ReduxProvider } from "../providers";
import Providers from "./providers";
import ChatBotButton from "@/components/chatBot/ChatBotButton";
import { TranslationProvider } from "@/TranslationContext";
import LayoutClient from "@/components/LayoutClient";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "Homyfy - Find your perfect property match",
  description: "Generated by create next app",
  icons: {
    icon: "/fav2.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body>
        <TranslationProvider>
          <LayoutClient>
            <Providers>
              <ReduxProvider>
                <Navbar />
                {children}
                <ChatBotButton />
                <Footer />
              </ReduxProvider>
            </Providers>
          </LayoutClient>
        </TranslationProvider>
      </body>
    </html>
  );
}
