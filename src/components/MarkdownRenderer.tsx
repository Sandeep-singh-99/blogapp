
'use client'
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  markdown: string;
}


export default function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  return (
    <div className="max-w-full p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm font-sans text-gray-900 dark:text-gray-100">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          // Headings (h1-h6)
          h1: ({ node, ...props }) => (
            <h1
              className="text-4xl font-bold mt-6 mb-4 border-b-2 pb-2 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-3xl font-semibold mt-5 mb-3 border-b-1 pb-1 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-2xl font-medium mt-4 mb-2 text-gray-800 dark:text-gray-200"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className="text-xl font-medium mt-3 mb-2 text-gray-800 dark:text-gray-200"
              {...props}
            />
          ),
          h5: ({ node, ...props }) => (
            <h5
              className="text-lg font-medium mt-2 mb-1 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          h6: ({ node, ...props }) => (
            <h6
              className="text-base font-medium mt-2 mb-1 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),

          // Paragraphs
          p: ({ node, ...props }) => (
            <p
              className="text-base my-4 leading-relaxed text-gray-800 dark:text-gray-200"
              {...props}
            />
          ),

          // Links
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          // Unordered Lists
          ul: ({ node, ...props }) => (
            <ul
              className="my-4 pl-6 list-disc text-gray-800 dark:text-gray-200"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li className="my-1 text-gray-800 dark:text-gray-200" {...props} />
          ),

          // Ordered Lists
          ol: ({ node, ...props }) => (
            <ol
              className="my-4 pl-6 list-decimal text-gray-800 dark:text-gray-200"
              {...props}
            />
          ),

          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 pl-4 my-4 italic text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700"
              {...props}
            />
          ),

          // Code blocks with copy button
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeText = String(children).replace(/\n$/, '');

            if (!inline && match) {
              const [copied, setCopied] = useState(false);

              const handleCopy = () => {
                navigator.clipboard.writeText(codeText).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
                });
              };

              return (
                <div className="relative my-4">
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      borderRadius: '0.375rem',
                      padding: '1rem',
                      margin: 0,
                      fontSize: '0.9rem',
                    }}
                    {...props}
                  >
                    {codeText}
                  </SyntaxHighlighter>
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 px-2 py-1 text-sm font-medium text-gray-100 bg-gray-700 dark:bg-gray-600 rounded hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-200"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              );
            }

            return (
              <code
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-1 py-0.5 rounded font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Horizontal Rule
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-t border-gray-300 dark:border-gray-700" {...props} />
          ),

          // Emphasis (italic)
          em: ({ node, ...props }) => (
            <em className="italic text-gray-800 dark:text-gray-200" {...props} />
          ),

          // Strong (bold)
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-gray-900 dark:text-gray-100" {...props} />
          ),

          // Deleted text (strikethrough)
          del: ({ node, ...props }) => (
            <del className="line-through text-gray-500 dark:text-gray-400" {...props} />
          ),

          // Images
          img: ({ node, ...props }) => (
            <img className="max-w-full h-auto my-4 rounded" {...props} />
          ),

          // Tables
          table: ({ node, ...props }) => (
            <table
              className="w-full my-4 border-collapse border border-gray-300 dark:border-gray-700"
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              className="border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200"
              {...props}
            />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}