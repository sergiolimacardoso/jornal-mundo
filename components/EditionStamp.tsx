"use client";

import { useEffect, useState } from "react";

function getCountdown() {
  const now = new Date();
  const next = new Date(now);
  next.setMinutes(0, 0, 0);
  next.setHours(now.getHours() + 1);
  const diffMs = next.getTime() - now.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);
  return { minutes, seconds };
}

export default function EditionStamp() {
  const [countdown, setCountdown] = useState(getCountdown());

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getCountdown();
      setCountdown(next);
      // Quando bate a hora cheia, recarrega a página para buscar a nova edição.
      if (next.minutes === 59 && next.seconds === 59) {
        window.location.reload();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="badge text-bg-light border edition-stamp fs-6 px-3 py-2" title="Tempo até a próxima edição">
      🕐 Próxima edição em {countdown.minutes}m {String(countdown.seconds).padStart(2, "0")}s
    </span>
  );
}
