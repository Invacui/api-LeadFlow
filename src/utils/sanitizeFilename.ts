export const sanitizeFilename = (name: string): string => {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};
export default sanitizeFilename;
