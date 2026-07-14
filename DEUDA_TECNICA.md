# Deuda técnica

Registro de decisiones que conviene revisar más adelante.

- **F1-i18n:** `next.config.ts` usa `experimental.globalNotFound` +
  `src/app/global-not-found.tsx` para servir el 404 de marca en URLs totalmente
  inexistentes (requerido al tener dos root layouts). API experimental de
  Next 16 — revisar en cada upgrade de Next que siga soportada; si se
  estabiliza, migrar a la API estable.
