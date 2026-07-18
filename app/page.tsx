import { getHeadlinesBySection } from "@/lib/rss";
import { SECTION_ORDER } from "@/lib/sources";
import { summarizeWithAI } from "@/lib/summarize";
import EditionStamp from "@/components/EditionStamp";

// Regera a página no máximo a cada hora (ISR) — é o que garante
// que o conteúdo publicado na Vercel se atualiza sozinho.
export const revalidate = 3600;

function formatDate(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function formatTime(pubDate: string): string {
  if (!pubDate) return "";
  const d = new Date(pubDate);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(d);
}

export default async function Home() {
  const bySection = await getHeadlinesBySection();
  const allMundo = bySection["Mundo"];
  const lead = allMundo[0];
  const restMundo = allMundo.slice(1, 6);

  const allHeadlines = SECTION_ORDER.flatMap((s) => bySection[s]);
  const breaking = allHeadlines
    .filter((h) => h.pubDate && !isNaN(new Date(h.pubDate).getTime()))
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())[0];

  // Resumo por IA só para a manchete e a última hora (mantém o custo mínimo).
  // Se não houver ANTHROPIC_API_KEY configurada, cai automaticamente na
  // descrição original do feed — o site nunca depende disso para funcionar.
  const [leadAISummary, breakingAISummary] = await Promise.all([
    lead ? summarizeWithAI(lead.title, lead.description) : Promise.resolve(null),
    breaking ? summarizeWithAI(breaking.title, breaking.description) : Promise.resolve(null),
  ]);

  return (
    <main className="wrap">
      <header className="masthead">
        <div className="masthead-top">
          <span>Edição digital</span>
          <span>{formatDate()}</span>
        </div>
        <div className="masthead-main">
          <div className="title-block">
            <p className="eyebrow">Notícias do mundo, sem parar</p>
            <h1>O Correio Global</h1>
            <p className="tagline">Atualizado automaticamente a cada hora, direto das principais agências.</p>
          </div>
          <EditionStamp />
        </div>
      </header>

      <nav className="section-nav">
        {SECTION_ORDER.map((s) => (
          <a key={s} href={`#${s}`}>
            {s}
          </a>
        ))}
      </nav>

      {breaking && (
        <a className="breaking" href={breaking.link} target="_blank" rel="noopener noreferrer">
          {breaking.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="breaking-img" src={breaking.image} alt="" />
          )}
          <span className="breaking-tag">Última hora</span>
          <span className="breaking-text">
            {breaking.title}
            {breakingAISummary && <span className="breaking-ai"> — {breakingAISummary}</span>}
          </span>
          <span className="breaking-source">
            {breaking.source}
            {breaking.pubDate ? ` · ${formatTime(breaking.pubDate)}` : ""}
          </span>
        </a>
      )}

      {lead && (
        <section className="lead">
          <p className="kicker">Manchete · Mundo</p>
          {lead.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="lead-img" src={lead.image} alt="" />
          )}
          <a href={lead.link} target="_blank" rel="noopener noreferrer">
            <h2>{lead.title}</h2>
          </a>
          {leadAISummary ? (
            <p>
              <span className="ai-badge">Resumo por IA</span> {leadAISummary}
            </p>
          ) : (
            lead.description && (
              <p>
                {lead.description.slice(0, 320)}
                {lead.description.length > 320 ? "…" : ""}
              </p>
            )
          )}
          <p className="byline">
            Fonte: {lead.source} {lead.pubDate ? `· ${formatTime(lead.pubDate)}` : ""}
          </p>
        </section>
      )}

      <div className="sections">
        {SECTION_ORDER.map((section) => {
          const items =
            section === "Mundo" ? restMundo : bySection[section].slice(0, section === "Brasil" ? 8 : 6);
          return (
            <div className={`section-col${section === "Brasil" ? " featured" : ""}`} id={section} key={section}>
              <h2 className="section-heading">{section}</h2>
              {items.length === 0 && <p className="empty-note">Sem manchetes disponíveis no momento.</p>}
              {items.map((h, i) => (
                <article className="headline" key={`${section}-${i}`}>
                  <a href={h.link} target="_blank" rel="noopener noreferrer" className="headline-row">
                    {h.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="headline-img" src={h.image} alt="" />
                    )}
                    <span>
                      <h3>{h.title}</h3>
                      <p className="meta">
                        {h.source}
                        {h.pubDate ? ` · ${formatTime(h.pubDate)}` : ""}
                      </p>
                    </span>
                  </a>
                </article>
              ))}
            </div>
          );
        })}
      </div>

      <footer>
        O Correio Global reúne manchetes de fontes públicas (G1, BBC News Brasil, Agência Brasil, CNN Brasil e GE)
        e atualiza a cada hora. As matérias completas estão nos sites originais dos veículos.
      </footer>
    </main>
  );
}
