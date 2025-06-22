// Cyrillic to Latin character mapping for transliteration
const cyrillicToLatin = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
  'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
  'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
  'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
  'я': 'ya',
  // Mongolian specific characters
  'ө': 'o', 'ү': 'u', 'ң': 'n'
};

// Function to detect if text contains Cyrillic characters
const hasCyrillic = (text) => {
  return /[а-яёөүң]/i.test(text);
};

// Function to transliterate Cyrillic to Latin
const transliterateCyrillic = (text) => {
  return text.toLowerCase().split('').map(char => {
    return cyrillicToLatin[char] || char;
  }).join('');
};

// Function to generate slug from title
export const generateSlug = (title) => {
  if (!title) return '';

  let slug = title.trim();

  // If title contains Cyrillic, use Cyrillic slug but preserve English words
  if (hasCyrillic(slug)) {
    // Generate Cyrillic slug but keep English words
    slug = slug
      .toLowerCase()
      .replace(/[^а-яёөүңa-z0-9\s-]/g, '') // Keep Cyrillic letters, English letters, numbers, spaces, hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove multiple hyphens
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .trim();
  } else {
    // Generate English slug
    slug = slug
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Keep only letters, numbers, spaces, hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove multiple hyphens
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .trim();
  }

  return slug;
};

// Function to generate English fallback slug
export const generateEnglishSlug = (title) => {
  if (!title) return '';

  let slug = title.trim();

  // Transliterate Cyrillic to Latin
  if (hasCyrillic(slug)) {
    slug = transliterateCyrillic(slug);
  }

  // Generate English slug
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Keep only letters, numbers, spaces, hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple hyphens
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .trim();

  return slug;
};

// Function to generate both Cyrillic and English slugs
export const generateBothSlugs = (title) => {
  const cyrillicSlug = generateSlug(title);
  const englishSlug = generateEnglishSlug(title);
  
  return {
    slug: cyrillicSlug, // Primary slug (Cyrillic if available)
    englishSlug: englishSlug, // English fallback
    isCyrillic: hasCyrillic(title)
  };
}; 