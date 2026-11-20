/** Texto de cada célula (`td`) de cada linha do `tbody`, como matriz de strings. */
export function tableRows(root: ParentNode): string[][] {
  return Array.from(root.querySelectorAll('tbody tr')).map((row) =>
    Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim() ?? ''),
  );
}
