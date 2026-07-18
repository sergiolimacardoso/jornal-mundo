export type Section = "Brasil" | "Mundo" | "Economia" | "Tecnologia" | "Ciência";

export interface FeedSource {
  section: Section;
  name: string;
  url: string;
}

// Fontes RSS públicas, sem necessidade de chave de API.
// Para trocar ou adicionar fontes, edite esta lista.
export const FEED_SOURCES: FeedSource[] = [
  { section: "Brasil", name: "G1", url: "https://g1.globo.com/rss/g1/brasil/" },
  { section: "Brasil", name: "Agência Brasil", url: "https://agenciabrasil.ebc.com.br/rss.xml" },
  { section: "Brasil", name: "CNN Brasil", url: "https://www.cnnbrasil.com.br/feed/" },
  { section: "Mundo", name: "BBC News Brasil", url: "https://www.bbc.com/portuguese/index.xml" },
  { section: "Mundo", name: "G1", url: "https://g1.globo.com/rss/g1/mundo/" },
  { section: "Economia", name: "G1", url: "https://g1.globo.com/rss/g1/economia/" },
  { section: "Economia", name: "CNN Brasil", url: "https://www.cnnbrasil.com.br/economia/feed/" },
  { section: "Tecnologia", name: "G1", url: "https://g1.globo.com/rss/g1/tecnologia/" },
  { section: "Ciência", name: "G1", url: "https://g1.globo.com/rss/g1/ciencia-e-saude/" },
];

export const SECTION_ORDER: Section[] = ["Brasil", "Mundo", "Economia", "Tecnologia", "Ciência"];
