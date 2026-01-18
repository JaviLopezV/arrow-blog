// animalGame.utils.ts
export type Lang = "es" | "en";

export function normalizeWord(s: string) {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getLanguageLabel(lang: Lang, locale: string) {
  try {
    const dn = new Intl.DisplayNames([locale], { type: "language" });
    const label = dn.of(lang) ?? lang;
    return label.charAt(0).toUpperCase() + label.slice(1);
  } catch {
    return lang;
  }
}
