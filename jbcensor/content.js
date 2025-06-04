const censoredWords = [
  { base: "job", censorIndex: 1 },
  { base: "work", censorIndex: 1 },
  { base: "bagger", censorIndex: 1 },
  { base: "tracka", censorIndex: 1 },
  { base: "tracker", censorIndex: 1 }
];

const prefixes = ["re", "pre", "un", "a-", "t-", "de"];
const suffixes = ["s", "es", "ed", "ing", "er", "less", "ness", "ful", "ment", "ly", "able", "al", "est", "y"];

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildRegex(base) {
  const prefixPattern = `(?:${prefixes.map(escapeRegex).join('|')})?`;
  const suffixPattern = `(?:${suffixes.map(escapeRegex).join('|')})*`;
  return new RegExp(`${prefixPattern}${escapeRegex(base)}${suffixPattern}`, 'gi');
}

function getBaseIndex(full, base) {
  const lowerFull = full.toLowerCase();
  const lowerBase = base.toLowerCase();
  return lowerFull.indexOf(lowerBase);
}

function censorText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.textContent;
    for (const { base, censorIndex } of censoredWords) {
      const regex = buildRegex(base);
      text = text.replace(regex, match => {
        const baseStart = getBaseIndex(match, base);
        const indexToCensor = baseStart + censorIndex;
        if (indexToCensor < match.length) {
          const chars = match.split('');
          chars[indexToCensor] = '*';
          return chars.join('');
        }
        return match;
      });
    }
    node.textContent = text;
  } else {
    node.childNodes.forEach(censorText);
  }
}

censorText(document.body);
