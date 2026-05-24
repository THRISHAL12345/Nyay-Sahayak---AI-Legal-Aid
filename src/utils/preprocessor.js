export function preprocessText(rawText) {
  let cleaned = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  const sections = cleaned.split(/\[PAGE \d+\]/g)
    .filter(s => s.trim().length > 0)
    .map((text, idx) => ({
      sectionId: idx + 1,
      page: idx + 1,
      text: text.trim(),
      paragraphs: text.trim()
        .split(/\n\n+/)
        .filter(p => p.trim().length > 10)
        .map((para, pIdx) => ({
          paragraphId: pIdx + 1,
          text: para.trim()
        }))
    }));

  let numberedText = '';
  sections.forEach(section => {
    numberedText += `\n[PAGE ${section.page}]\n`;
    section.paragraphs.forEach(para => {
      numberedText += `[P${section.page}.${para.paragraphId}] ${para.text}\n\n`;
    });
  });

  const words = numberedText.split(' ');
  if (words.length > 5000) {
    numberedText = words.slice(0, 5000).join(' ') + '\n\n[... दस्तावेज़ काटा गया / Document truncated ...]';
  }

  return { numberedText, sections };
}
