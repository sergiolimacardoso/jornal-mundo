export interface CurrencyRate {
  code: string;
  name: string;
  valueInBRL: number;
}

const CURRENCIES: { code: string; name: string }[] = [
  { code: "USD", name: "Dólar americano" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "Libra esterlina" },
  { code: "JPY", name: "Iene japonês" },
  { code: "CNY", name: "Yuan chinês" },
  { code: "ARS", name: "Peso argentino" },
];

// Endpoint aberto e gratuito da ExchangeRate-API — sem chave, sem cadastro.
// Atualiza uma vez por hora, o que já casa com o ritmo do resto do jornal.
// Atribuição obrigatória pelos termos de uso: https://www.exchangerate-api.com
export async function getCurrencyRates(): Promise<CurrencyRate[]> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/BRL", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.result !== "success" || !data.rates) return [];

    return CURRENCIES.map(({ code, name }) => {
      const rate = data.rates[code];
      // A API devolve "1 BRL = X moeda", então invertemos para "1 moeda = X BRL".
      const valueInBRL = rate ? 1 / rate : 0;
      return { code, name, valueInBRL };
    }).filter((c) => c.valueInBRL > 0);
  } catch {
    return [];
  }
}
