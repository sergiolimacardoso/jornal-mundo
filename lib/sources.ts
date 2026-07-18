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
  { section: "Mundo", name: "BBC News", url: "http://feeds.bbci.co.uk/news/world/rss.xml" },
  { section: "Mundo", name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
  { section: "Mundo", name: "NPR", url: "https://feeds.npr.org/1004/rss.xml" },
  { section: "Economia", name: "BBC News", url: "http://feeds.bbci.co.uk/news/business/rss.xml" },
  { section: "Tecnologia", name: "BBC News", url: "http://feeds.bbci.co.uk/news/technology/rss.xml" },
  { section: "Ciência", name: "BBC News", url: "http://feeds.bbci.co.uk/news/science_and_environment/rss.xml" },
];

export const SECTION_ORDER: Section[] = ["Brasil", "Mundo", "Economia", "Tecnologia", "Ciência"];
