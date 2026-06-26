/** Minimal markdown renderer for blog posts — headers, lists, paragraphs, bold */
export function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={key} className="my-4 list-disc space-y-2 pl-6">
        {listItems.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed">{formatInline(item)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(`list-${index}`);
      return;
    }
    if (trimmed.startsWith('## ')) {
      flushList(`list-${index}`);
      elements.push(
        <h2 key={index} className="text-heading-lg mt-8 mb-3">{trimmed.slice(3)}</h2>,
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      flushList(`list-${index}`);
      elements.push(
        <h1 key={index} className="text-heading-xl mt-8 mb-3">{trimmed.slice(2)}</h1>,
      );
      return;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      listItems.push(trimmed.replace(/^\d+\.\s/, ''));
      return;
    }
    if (trimmed.startsWith('- ')) {
      listItems.push(trimmed.slice(2));
      return;
    }
    flushList(`list-${index}`);
    elements.push(
      <p key={index} className="my-3 text-sm leading-relaxed text-[var(--nike-ash)]">
        {formatInline(trimmed)}
      </p>,
    );
  });
  flushList('list-end');

  return <div>{elements}</div>;
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
