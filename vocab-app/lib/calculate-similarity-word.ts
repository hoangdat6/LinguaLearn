// Hàm tính tỷ lệ giống nhau giữa hai chuỗi (Levenshtein distance)
export const similarity = (a: string, b: string) => {
  if (!a.length && !b.length) return 1;
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  const distance = matrix[b.length][a.length];
  return 1 - distance / Math.max(a.length, b.length);
}

// Hàm làm mờ từ đúng trong example, trả về cả example đã che và từ bị che
export const maskWordInExample = (example: string, word: string) => {
  const words = example.split(/(\W+)/);
  let maxSim = 0;
  let maxIndex = -1;
  for (let i = 0; i < words.length; i++) {
    const sim = similarity(words[i].toLowerCase(), word.toLowerCase());
    if (sim > maxSim) {
      maxSim = sim;
      maxIndex = i;
    }
  }
  let masked = "";
  let maskedWord = "";
  if (maxIndex !== -1) {
    maskedWord = words[maxIndex];
    words[maxIndex] = "...";
  }
  masked = words.join("");
  return { masked, maskedWord };
}

