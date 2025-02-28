'use client'
import { showSuccess } from "@/utils/toast";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

// Custom Code Block Component with Copy Button
const CodeBlock = ({ inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children).trim();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      showSuccess({message: "Copied to clipboard!"});
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return !inline && match ? (
    <div className="relative my-6">
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
      >
        Copy
      </button>
      <SyntaxHighlighter style={dracula} language={match[1]} PreTag="div">
        {code}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm">
      {children}
    </code>
  );
};

// Custom ReactMarkdown Component
const MarkdownRenderer = ({ markdown }) => {
  return (
    <ReactMarkdown
      components={{
        // Headings
        h1: ({ ...props }) => (
          <h1
            className="text-4xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-l-4 border-blue-500 pl-4"
            {...props}
          />
        ),
        h2: ({ ...props }) => (
          <h2
            className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3 border-b-2 border-gray-200 dark:border-gray-700 pb-1"
            {...props}
          />
        ),
        // Paragraphs
        p: ({ ...props }) => (
          <p
            className="text-gray-700 dark:text-gray-300 leading-relaxed my-5 text-lg"
            {...props}
          />
        ),
        // Images
        img: ({ ...props }) => (
          <img
            className="rounded-xl max-w-full h-auto my-6 shadow-md"
            {...props}
          />
        ),
        // Links
        a: ({ ...props }) => (
          <a
            className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline underline-offset-4 transition-colors duration-200"
            {...props}
          />
        ),
        // Lists
        ul: ({ ...props }) => (
          <ul
            className="list-disc list-outside pl-6 my-5 text-gray-700 dark:text-gray-300"
            {...props}
          />
        ),
        ol: ({ ...props }) => (
          <ol
            className="list-decimal list-outside pl-6 my-5 text-gray-700 dark:text-gray-300"
            {...props}
          />
        ),
        // Code Blocks with Syntax Highlighting
        code: CodeBlock,
        // Blockquotes
        blockquote: ({ ...props }) => (
          <blockquote
            className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-6"
            {...props}
          />
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
