// Gera um resumo curto em português usando a API da Anthropic (Claude Haiku).
// Totalmente opcional: se a variável de ambiente ANTHROPIC_API_KEY não estiver
// configurada, ou se a chamada falhar por qualquer motivo, retorna null e o
// site simplesmente usa a descrição original da notícia — nunca quebra o build.
export async function summarizeWithAI(title: string, description: string): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !description) return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 150,
        messages: [
          {
            role: "user",
            content:
              "Resuma a notícia abaixo em no máximo 2 frases curtas, em português do Brasil, " +
              "de forma neutra e objetiva. Não invente nenhuma informação que não esteja no texto. " +
              "Responda apenas com o resumo, sem introduções.\n\n" +
              `Título: ${title}\n\nTexto: ${description}`,
          },
        ],
      }),
      // Fica em cache junto com o resto da página (1 hora), então não gera
      // uma chamada nova a cada visita — só quando a edição é renovada.
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const block = data?.content?.find((b: { type: string; text?: string }) => b.type === "text");
    const text = block?.text?.trim();
    return text || null;
  } catch {
    return null;
  }
}
