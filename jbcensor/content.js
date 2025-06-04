const censoredWords = [
  { base: "job", variants: ["job", "jobs", "jobless"], censorIndex: 1 },
  { base: "work", variants: ["work", "works", "worked", "working", "worker", "workplace"], censorIndex: 1 },
  { base: "apple bagger", variants: ["bagger", "bagga", "apple"], censorIndex: 1 },
  { base: "ticket tracker", variants: ["ticket", "tracker", "tracka"], censorIndex: 1 },
  { base: "a-bagger", variants: ["a-bagga", "t-tracker", "t-tracka"], censorIndex: 3 },
];

function censorText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.textContent;
    for (const { variants, censorIndex } of censoredWords) {
      for (const variant of variants) {
        const regex = new RegExp(`\\b${variant}\\b`, 'gi');
        text = text.replace(regex, match => {
          if (match.length > censorIndex) {
            const chars = match.split('');
            chars[censorIndex] = '*';
            return chars.join('');
          }
          return match;
        });
      }
    }
    node.textContent = text;
  } else {
    node.childNodes.forEach(censorText);
  }
}

censorText(document.body);
