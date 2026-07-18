import type { Metadata } from "next";
import { Piazzolla } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";

// next/font baixa e auto-hospeda a fonte durante o build: nenhuma requisição
// ao Google Fonts acontece no navegador do visitante, o que elimina uma
// conexão externa a mais no carregamento.
const piazzolla = Piazzolla({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-piazzolla",
});

export const metadata: Metadata = {
  title: "O Correio Global — Edição contínua",
  description: "As principais notícias do mundo, atualizadas a cada hora.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-bs-theme="light" className={piazzolla.variable}>
      <body>
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}
