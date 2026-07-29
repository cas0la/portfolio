// Tokens de movimento — consumidos por Motion (JS) nas seções (Fase 4).
// Espelham os easings/durações definidos em src/index.css.

export const ease = {
  entrance: [0.16, 1, 0.3, 1] as [number, number, number, number],
  standard: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
}

export const duration = {
  fast: 0.2,
  base: 0.5,
  slow: 0.8,
}

export const stagger = 0.08
