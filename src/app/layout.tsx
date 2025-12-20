import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cisco Training & Certification Courses | Koenig Solutions - Platinum Learning Partner",
  description: "Master Cisco networking with expert-led CCNA, CCNP, and CCIE certification training. Koenig Solutions is a Cisco Platinum Learning Partner offering flexible scheduling, hands-on labs, and guaranteed exam readiness. Accept Cisco Learning Credits (CLCs).",
  keywords: "CCNA training, CCNP certification, CCIE training, Cisco courses, Cisco Learning Credits, CLC, network certification, IT training, Koenig Solutions",
  openGraph: {
    title: "Cisco Training & Certification | Koenig Solutions",
    description: "Expert-led Cisco certification training from a Platinum Learning Partner. CCNA, CCNP, CCIE courses with hands-on labs and flexible scheduling.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cisco Training & Certification | Koenig Solutions",
    description: "Expert-led Cisco certification training from a Platinum Learning Partner.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
