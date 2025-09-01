// Function to normalize product names for better comparison
export const normalizeProductName = (name: string): string => {
  return name
    .toLowerCase()
    // Remove common phrases and units
    .replace(/each film coated tablet contains/g, '')
    .replace(/excipients q\.s\./g, '')
    .replace(/ip|mg/g, '')
    // Remove special characters and extra spaces
    .replace(/[+,\.]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Levenshtein distance algorithm to calculate string similarity
export const calculateSimilarity = (str1: string, str2: string): number => {
  const s1 = normalizeProductName(str1);
  const s2 = normalizeProductName(str2);

  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  const matrix = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= s2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }

  const maxLength = Math.max(s1.length, s2.length);
  const distance = matrix[s2.length][s1.length];
  return (maxLength - distance) / maxLength;
};

// Check if two product names are similar (e.g., 80% threshold)
export const areProductsSimilar = (name1: string, name2: string, threshold: number = 0.8): boolean => {
  return calculateSimilarity(name1, name2) >= threshold;
};