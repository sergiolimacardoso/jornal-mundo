"use client";

import { useEffect } from "react";

// Carrega o JS do Bootstrap (usado só pelo botão "hambúrguer" do menu no
// celular) depois que a página já está pronta e visível, para não atrasar
// a primeira renderização. Vem do pacote instalado localmente — não faz
// nenhuma requisição a um CDN externo.
export default function BootstrapClient() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}
