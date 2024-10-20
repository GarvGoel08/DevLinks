import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const InstrumentalSansItalic = localFont({
  src: "./fonts/InstrumentSans-Italic-VariableFont_wdth,wght.ttf",
  variable: "--font-instrumental-sans-italic",
  weight: "100 900",
});
const InstrumentalSans = localFont({
  src: "./fonts/InstrumentSans-VariableFont_wdth,wght.ttf",
  variable: "--font-instrumental-sans",
  weight: "100 900",
});

export const metadata = {
  title: "DevLinks",
  description: "Links for developers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{overflow: 'visible'}}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${InstrumentalSans.variable} ${InstrumentalSansItalic.variable} antialiased ` }
      >
        {children}
      </body>
    </html>
  );
}
