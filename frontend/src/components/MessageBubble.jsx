import { Check, Copy, ExternalLink, X } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function MessageBubble({ role, content, images }) {
  const isUser = role === "user";
  const [lightBox, setLightBox] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} font-sans w-full`}>
      <div
        className={`w-fit max-w-[92vw] md:max-w-[75%] px-5 py-4 break-words overflow-hidden leading-relaxed shadow-sm ${
          isUser
            ? "bg-zinc-800 text-white rounded-[24px] rounded-tr-[8px] shadow-md border border-white/5"
            : "bg-transparent text-zinc-200 rounded-[24px] border border-transparent"
        }`}
      >
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2 mb-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                loading="lazy"
                onError={(e) => e.currentTarget.remove()}
                className="w-40 h-28 rounded-2xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition-opacity shadow-sm"
                onClick={() => setLightBox(img)}
              />
            ))}
          </div>
        )}
        <div className={`prose prose-invert max-w-none ${isUser ? 'prose-p:text-white prose-headings:text-white prose-strong:text-white' : 'prose-p:text-zinc-200 prose-headings:text-white prose-strong:text-zinc-100'}`}>
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-semibold mt-6 mb-4 tracking-tight">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold mt-5 mb-3 tracking-tight">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold mt-4 mb-2 tracking-tight">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 last:mb-0 whitespace-pre-wrap break-words">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 space-y-2 my-4 last:mb-0">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 space-y-2 my-4">{children}</ol>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-6 rounded-xl border border-white/10 bg-white/5">
                  <table className="min-w-full text-sm">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border-b border-white/10 px-4 py-3 text-left font-semibold text-white">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border-b border-white/5 px-4 py-3">{children}</td>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  {children}
                  <ExternalLink size={14} />
                </a>
              ),
              code: ({ className, children }) => {
                const value = String(children).trim();

                if (!className) {
                  return (
                    <code className={`px-1.5 py-0.5 rounded-md font-mono text-[13px] ${isUser ? 'bg-black/30 text-zinc-100' : 'bg-white/10 text-zinc-200'}`}>
                      {value}
                    </code>
                  );
                }

                const language = className?.replace("language-", "");

                return (
                  <div className="my-5 overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] shadow-md font-mono">
                    <div className="flex items-center justify-between bg-white/5 border-b border-white/5 px-4 py-2.5">
                      <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                        {language}
                      </span>
                      <button
                        className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 hover:text-white transition-colors"
                        onClick={() => copyCode(value)}
                      >
                        {copiedCode == value ? (
                          <>
                            <Check size={14} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <SyntaxHighlighter
                      language={language}
                      style={oneDark}
                      wrapLongLines
                      showLineNumbers
                      customStyle={{
                        margin: 0,
                        padding: "16px",
                        background: "transparent",
                        fontSize: "13px",
                        border: "none"
                      }}
                    >
                      {value}
                    </SyntaxHighlighter>
                  </div>
                );
              },
              img: ({ src }) => {
                if (!src) return null;
                return (
                  <img
                    src={src}
                    onClick={() => setLightBox(src)}
                    loading="lazy"
                    onError={(e) => e.currentTarget.remove()}
                    className="w-40 h-28 rounded-2xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition-opacity shadow-sm my-4"
                  />
                );
              },
            }}
          >
            {content}
          </Markdown>
        </div>
      </div>

      {lightBox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 transition-opacity">
          <button
            className="absolute top-6 right-6 text-zinc-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 cursor-pointer transition-all"
            onClick={() => setLightBox(null)}
          >
            <X size={20} />
          </button>
          <img
            src={lightBox}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl shadow-2xl object-contain border border-white/10"
          />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
