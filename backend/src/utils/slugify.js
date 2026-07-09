export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Ensure a slug is unique in the given model (appends -2, -3, ... if needed)
export async function uniqueSlug(Model, base, excludeId = null) {
  let slug = slugify(base) || "item";
  let candidate = slug;
  let n = 2;
  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Model.findOne(query);
    if (!existing) return candidate;
    candidate = `${slug}-${n++}`;
  }
}
