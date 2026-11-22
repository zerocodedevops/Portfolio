interface SanitizeConfig {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
}

function sanitize(dirty: string, config?: SanitizeConfig): string {
  if (!dirty) return "";
  const allowedTags = new Set((config?.ALLOWED_TAGS || []).map((t) => t.toLowerCase()));
  if (allowedTags.size === 0) {
    return dirty.replace(/<[^>]*>?/gm, "");
  }
  return dirty.replace(/<\/?([a-zA-Z0-9-]+)(\s[^>]*)?>/gm, (match, tagName: string) => {
    return allowedTags.has(tagName.toLowerCase()) ? match : "";
  });
}

const DOMPurify = { sanitize };
export default DOMPurify;
