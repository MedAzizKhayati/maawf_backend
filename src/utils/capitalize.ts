export default function capitalize(str: string) {
  // remove extra spaces from beginning and end and in the middle
  if (!str) return str;
  str = str.trim().replace(/\s+/g, ' ');
  const words = str.split(' ');
  const capitalizedWords = words.map(word => word[0].toUpperCase() + word.slice(1));
  return capitalizedWords.join(' ');
}
