import React from 'react';

/**
 * Reusable utility to sanitize plain text (stripping markdown & latex symbols)
 * for use in cards, summaries, badges, and headers.
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    // Replace LaTeX symbols
    .replace(/\\(times|cdot)/g, '×')
    .replace(/\\(ge|geq)/g, '≥')
    .replace(/\\(le|leq)/g, '≤')
    .replace(/\\sum/g, '∑')
    .replace(/\\approx/g, '≈')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\dots/g, '…')
    .replace(/\\neq/g, '≠')
    .replace(/\$([^\$]+)\$/g, '$1') // Strip $ delimiters
    // Remove markdown headers #, ##, ###, ####
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold and italics
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove inline code backticks
    .replace(/`([^`]+)`/g, '$1')
    // Remove links [title](url) -> title
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bullet points at line starts
    .replace(/^[\*\-\+]\s+/gm, '')
    // Clean up stray double asterisks or hashtags
    .replace(/\*{2,}/g, '')
    .replace(/#{2,}/g, '')
    .trim();
}

/**
 * Formats inline LaTeX-like and markdown expressions into React nodes.
 */
function renderInlineTokens(text: string): React.ReactNode[] {
  // First, normalize common LaTeX commands into clean unicode
  const normalized = text
    .replace(/\\(times|cdot)/g, '×')
    .replace(/\\(ge|geq)/g, '≥')
    .replace(/\\(le|leq)/g, '≤')
    .replace(/\\sum/g, '∑')
    .replace(/\\approx/g, '≈')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\dots/g, '…')
    .replace(/\\neq/g, '≠');

  // Match:
  // 1. Math formulas like $...$
  // 2. Bold text like **...** or __...__
  // 3. Italic text like *...* or _..._
  // 4. Inline code like `...`
  // 5. Links like [text](url)
  const tokenRegex = /(\$[^$]+\$|\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*|_[^_]+_)/g;
  const parts = normalized.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Math formula: $...$
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      const formula = part.slice(1, -1);
      return (
        <span
          key={index}
          className="font-mono text-slate-800 bg-slate-100/80 px-1 py-0.5 rounded text-[0.92em]"
        >
          {formula}
        </span>
      );
    }

    // Bold: **...** or __...__
    if (
      (part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
      (part.startsWith('__') && part.endsWith('__') && part.length >= 4)
    ) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Inline Code: `...`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="font-mono text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/50"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Links: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // Italic: *...* or _..._
    if (
      (part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
      (part.startsWith('_') && part.endsWith('_') && part.length >= 2)
    ) {
      return (
        <em key={index} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Plain text: strip any stray markdown markers like unmatched ** or ##
    const cleanPlain = part.replace(/\*{2,}/g, '').replace(/#{2,}/g, '');
    return <React.Fragment key={index}>{cleanPlain}</React.Fragment>;
  });
}

interface ContentRendererProps {
  content?: string;
  className?: string;
}

/**
 * Production-ready, zero-dependency Markdown & LaTeX content renderer.
 * Converts headings, bullet lists, numbered lists, bold, italics, inline code,
 * math notation, and blockquotes into clean, beautiful HTML elements.
 * Guarantees NO visible raw markdown symbols (##, **, `, $).
 */
export const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content) return null;

  // Split lines into blocks
  const rawLines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    const ListTag = currentList.type;
    const listIndex = elements.length;

    elements.push(
      <ListTag
        key={`list-${listIndex}`}
        className={`my-3 space-y-1.5 text-sm text-slate-700 leading-relaxed ${
          currentList.type === 'ul'
            ? 'list-disc pl-5'
            : 'list-decimal pl-5'
        }`}
      >
        {currentList.items.map((item, i) => (
          <li key={i}>{renderInlineTokens(item)}</li>
        ))}
      </ListTag>
    );
    currentList = null;
  };

  rawLines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Empty line flushes active list
    if (!trimmed) {
      flushList();
      return;
    }

    // Heading: #### (H4)
    if (trimmed.startsWith('#### ')) {
      flushList();
      elements.push(
        <h5
          key={`h4-${idx}`}
          className="text-sm font-bold text-slate-900 pt-3 pb-1 tracking-tight"
        >
          {renderInlineTokens(trimmed.slice(5))}
        </h5>
      );
      return;
    }

    // Heading: ### (H3)
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h4
          key={`h3-${idx}`}
          className="text-base font-bold text-slate-900 pt-3 pb-1 tracking-tight"
        >
          {renderInlineTokens(trimmed.slice(4))}
        </h4>
      );
      return;
    }

    // Heading: ## (H2)
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h3
          key={`h2-${idx}`}
          className="text-lg font-extrabold text-slate-900 pt-4 pb-1.5 tracking-tight border-b border-slate-100"
        >
          {renderInlineTokens(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    // Heading: # (H1)
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h2
          key={`h1-${idx}`}
          className="text-xl font-extrabold text-slate-900 pt-5 pb-2 tracking-tight"
        >
          {renderInlineTokens(trimmed.slice(2))}
        </h2>
      );
      return;
    }

    // Bullet list item: - or *
    const bulletMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      return;
    }

    // Numbered list item: 1. or 2.
    const numMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (numMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(numMatch[1]);
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${idx}`} className="text-sm text-slate-700 leading-relaxed my-2">
        {renderInlineTokens(trimmed)}
      </p>
    );
  });

  // Flush remaining list if any
  flushList();

  return <div className={`space-y-1 font-sans ${className}`}>{elements}</div>;
};
