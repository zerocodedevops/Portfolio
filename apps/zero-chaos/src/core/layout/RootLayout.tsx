import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ContactFloat } from "../components/WhatsAppFloat";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout = ({ children }: RootLayoutProps) => {
  const location = useLocation();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (location.hash) {
        document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return (
    <div className="zc-page flex min-h-screen flex-col">
      <Header clientName="ZeroChaos" />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ContactFloat />
    </div>
  );
};
