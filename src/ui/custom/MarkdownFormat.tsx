import Markdown from 'react-markdown';

import remarkGfm from 'remark-gfm';

import { replaceUnicode } from '@/utils/replaceUnicode';

export const MarkdownFormat = ({ children }: { children: string | null }) => {
  if (!children) {
    return null;
  }

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className={`my-2`}>{children}</p>,
        ul: ({ children }) => (
          <ul className={`my-2 ml-6 list-disc space-y-1`}>{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className={`my-2 ml-6 list-decimal space-y-1`}>{children}</ol>
        ),
        pre: ({ children }) => (
          <pre
            className={
              'my-2 overflow-x-auto rounded-md bg-gray-100 p-4 text-sm'
            }
          >
            {children}
          </pre>
        ),
        code: ({ children }) => (
          <code className={`rounded bg-gray-200 px-1 font-mono text-sm`}>
            {children}
          </code>
        ),
        blockquote: ({ children }) => (
          <blockquote className={`my-2 border-l-4 border-gray-300 pl-4 italic`}>
            {children}
          </blockquote>
        ),
        h1: ({ children }) => (
          <h1 className={`my-4 scroll-mt-20 text-3xl font-bold`}>{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className={`my-4 scroll-mt-20 text-2xl font-bold`}>{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className={`my-4 scroll-mt-20 text-xl font-bold`}>{children}</h3>
        ),
        table: ({ children }) => (
          <div className="my-2 overflow-x-auto">
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b bg-gray-100">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-3 py-1.5 text-left text-xs font-medium">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-t px-3 py-1.5">{children}</td>
        ),
        a: ({ children, href }) => (
          <a
            className={`text-blue-600 hover:underline`}
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            {children}
          </a>
        ),
      }}
    >
      {replaceUnicode(children)}
    </Markdown>
  );
};
