"use client";

import { showSuccess } from "@/utils/toast";
import Image from "next/image";
import React, { useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm"; 
import remarkBreaks from "remark-breaks"; 


interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
}

interface MarkdownRendererProps {
  markdown: string;
  className?: string;
}


const CodeBlock: React.FC<CodeBlockProps> = ({
  inline,
  className,
  children,
}) => {
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children ?? "").trim();

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      showSuccess({ message: "Copied to clipboard!" });
    } catch (err) {
      console.error("Failed to copy code to clipboard:", err);
    }
  }, [code]);

  if (inline) {
    return (
      <code
        className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm text-gray-800 dark:text-gray-200 font-mono"
        aria-label="Inline code"
      >
        {children ?? ""}
      </code>
    );
  }

  if (!match) {
    return <code className={className}>{children ?? ""}</code>;
  }

  return (
    <div className="relative my-4 group">
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Copy code to clipboard"
      >
        Copy
      </button>
      <SyntaxHighlighter
        style={dracula}
        language={match[1]}
        PreTag="pre"
        className="rounded-lg !mt-0 !mb-0 !p-4"
        customStyle={{ margin: 0 }}
        aria-label={`Code block in ${match[1]} language`}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};


const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  markdown,
  className,
}) => {
  return (
    <article
      className={`prose dark:prose-invert max-w-none ${className || ""}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]} 
        components={{
          h1: ({ ...props }) => (
            <h1
              className="text-3xl font-bold text-gray-900 dark:text-white mt-6 mb-4 pt-4 border-b border-gray-200 dark:border-gray-700 pb-2"
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3 pt-4 border-b border-gray-200 dark:border-gray-700 pb-1"
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className="text-xl font-bold text-gray-900 dark:text-white mt-5 mb-2 pt-3"
              {...props}
            />
          ),
          h4: ({ ...props }) => (
            <h4
              className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-2 pt-2"
              {...props}
            />
          ),
          p: ({ ...props }) => (
            <p
              className="text-gray-700 dark:text-gray-300 leading-7 my-4"
              {...props}
            />
          ),
          img: ({ src, alt, width, height, ...props }: ImageProps) => {
            const imageWidth = width ? Number(width) : 800;
            const imageHeight = height ? Number(height) : 800;

            return (
              <figure className="my-6">
                <Image
                  loader={({ src }) => src}
                  src={src || ""}
                  alt={alt || "Image from markdown content"}
                  width={imageWidth}
                  height={imageHeight}
                  className="rounded-lg max-w-full h-auto"
                  loading="lazy"
                  {...props}
                />
                {alt && (
                  <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
          a: ({ ...props }) => (
            <a
              className="text-blue-600 dark:text-blue-400 hover:underline visited:text-purple-600 dark:visited:text-purple-400"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          ul: ({ ...props }) => (
            <ul
              className="list-disc list-outside pl-6 my-4 text-gray-700 dark:text-gray-300 space-y-2"
              {...props}
            />
          ),
          ol: ({ ...props }) => (
            <ol
              className="list-decimal list-outside pl-6 my-4 text-gray-700 dark:text-gray-300 space-y-2"
              {...props}
            />
          ),
          li: ({ ...props }) => <li className="my-1 pl-1" {...props} />,
          code: CodeBlock,
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-4 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50"
              {...props}
            />
          ),
          em: ({ ...props }) => <em className="italic" {...props} />,
          strong: ({ ...props }) => <strong className="font-bold" {...props} />,
          hr: ({ ...props }) => (
            <hr
              className="my-8 border-t border-gray-300 dark:border-gray-600"
              {...props}
            />
          ),
          table: ({ ...props }) => (
            <table
              className="my-4 w-full border-collapse border border-gray-300 dark:border-gray-600"
              {...props}
            />
          ),
          thead: ({ ...props }) => (
            <thead className="bg-gray-100 dark:bg-gray-800" {...props} />
          ),
          th: ({ ...props }) => (
            <th
              className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold"
              {...props}
            />
          ),
          td: ({ ...props }) => (
            <td
              className="border border-gray-300 dark:border-gray-600 px-4 py-2"
              {...props}
            />
          ),
          // Deleted text
          del: ({ ...props }) => <del className="line-through" {...props} />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownRenderer;
