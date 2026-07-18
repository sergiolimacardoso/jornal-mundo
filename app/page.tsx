import { getHeadlinesBySection } from "@/lib/rss";
import { SECTION_ORDER } from "@/lib/sources";
import { summarizeWithAI } from "@/lib/summarize";
import { getCurrencyRates } from "@/lib/currency";
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
  const [bySection, currencies] = await Promise.all([getHeadlinesBySection(), getCurrencyRates()]);
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
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
        <div className="container">
          <a className="navbar-brand brand-logo fs-3" href="#">
            O Correio Global
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {SECTION_ORDER.map((s) => (
                <li className="nav-item" key={s}>
                  <a className="nav-link" href={`#${s}`}>
                    {s}
                  </a>
                </li>
              ))}
            </ul>
            <span className="d-none d-lg-block">
              <EditionStamp />
            </span>
          </div>
        </div>
      </nav>

      {/* Currency ticker */}
      {currencies.length > 0 && (
        <div className="bg-black text-white py-2">
          <div className="container d-flex align-items-center gap-3 ticker-strip">
            <span className="badge bg-secondary flex-shrink-0">Mercado</span>
            {currencies.map((c) => (
              <span key={c.code} className="small flex-shrink-0">
                <strong>{c.code}</strong>{" "}
                <span className="ticker-value">
                  {c.valueInBRL.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </span>
            ))}
            <a
              href="https://www.exchangerate-api.com"
              target="_blank"
              rel="noopener noreferrer"
              className="small text-white-50 text-decoration-none ms-auto flex-shrink-0"
            >
              Cotações: ExchangeRate-API
            </a>
          </div>
        </div>
      )}

      <div className="container py-4">
        {/* Dateline */}
        <div className="d-flex justify-content-between align-items-center text-uppercase small text-muted mb-3">
          <span>Edição digital</span>
          <span>{formatDate()}</span>
        </div>

        {/* Breaking news */}
        {breaking && (
          <a
            href={breaking.link}
            target="_blank"
            rel="noopener noreferrer"
            className="alert alert-danger d-flex align-items-center gap-3 text-decoration-none text-dark mb-4"
            role="alert"
          >
            {breaking.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={breaking.image} alt="" className="thumb-sm rounded" style={{ width: 48, height: 48 }} />
            )}
            <span className="badge bg-danger flex-shrink-0">Última hora</span>
            <span className="flex-grow-1">
              <strong>{breaking.title}</strong>
              {breakingAISummary && <span className="fst-italic"> — {breakingAISummary}</span>}
            </span>
            <span className="small text-muted flex-shrink-0">
              {breaking.source}
              {breaking.pubDate ? ` · ${formatTime(breaking.pubDate)}` : ""}
            </span>
          </a>
        )}

        {/* Featured lead story */}
        {lead && (
          <div className="card mb-5 border-0 shadow-sm">
            <div className="row g-0">
              {lead.image && (
                <div className="col-md-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={lead.image} alt="" className="thumb-lead rounded-start h-100" />
                </div>
              )}
              <div className={lead.image ? "col-md-6" : "col-12"}>
                <div className="card-body h-100 d-flex flex-column">
                  <span className="badge bg-danger-subtle text-danger-emphasis mb-2 align-self-start">
                    Manchete · Mundo
                  </span>
                  <a href={lead.link} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                    <h2 className="card-title brand-logo fs-3 text-dark">{lead.title}</h2>
                  </a>
                  <p className="card-text text-muted">
                    {leadAISummary ? (
                      <>
                        <span className="badge border border-secondary text-secondary ai-badge me-1">
                          Resumo por IA
                        </span>
                        {leadAISummary}
                      </>
                    ) : (
                      lead.description &&
                      `${lead.description.slice(0, 280)}${lead.description.length > 280 ? "…" : ""}`
                    )}
                  </p>
                  <p className="card-text mt-auto">
                    <small className="text-muted text-uppercase">
                      Fonte: {lead.source} {lead.pubDate ? `· ${formatTime(lead.pubDate)}` : ""}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sections */}
        {SECTION_ORDER.map((section) => {
          const items =
            section === "Mundo" ? restMundo : bySection[section].slice(0, section === "Brasil" ? 8 : 6);
          return (
            <section id={section} key={section} className="mb-5">
              <h2 className="border-bottom border-danger border-2 pb-2 mb-3 text-danger-emphasis text-uppercase fs-5">
                {section}
              </h2>
              {items.length === 0 && <p className="text-muted fst-italic">Sem manchetes disponíveis no momento.</p>}
              <div className="row row-cols-1 row-cols-md-2 g-3">
                {items.map((h, i) => (
                  <div className="col" key={`${section}-${i}`}>
                    <a
                      href={h.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex gap-3 text-decoration-none text-dark"
                    >
                      {h.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={h.image} alt="" className="thumb-sm rounded" />
                      ) : (
                        <div className="thumb-sm rounded bg-secondary-subtle flex-shrink-0" />
                      )}
                      <span>
                        <span className="d-block fw-semibold lh-sm">{h.title}</span>
                        <small className="text-muted text-uppercase">
                          {h.source}
                          {h.pubDate ? ` · ${formatTime(h.pubDate)}` : ""}
                        </small>
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="bg-dark text-white-50 py-4">
        <div className="container small">
          O Correio Global reúne manchetes de fontes públicas (G1, BBC News Brasil, Agência Brasil, CNN Brasil e GE)
          e atualiza a cada hora. As matérias completas estão nos sites originais dos veículos.
        </div>
      </footer>
    </>
  );
}
