export function dedupeTexts(texts = []) {
  return [
    ...new Set(
      texts
        .map(t => t?.trim())
        .filter(Boolean)
        .map(t => t.toLowerCase())
    ),
  ];
}