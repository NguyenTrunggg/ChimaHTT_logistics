// utils/slugify.ts
// Chuyển chuỗi thành slug URL-friendly

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function generateUniqueSlug(text: string): string {
  const baseSlug = slugify(text);
  const timestamp = Date.now();
  return `${baseSlug}-${timestamp}`;
}
