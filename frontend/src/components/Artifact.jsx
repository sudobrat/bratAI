import {
  Check,
  Code2,
  Copy,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  X,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, easeInOut, motion } from "motion/react";
import Editor from "@monaco-editor/react";

function Artifact() {
  const [collapsed, setCollapsed] = useState(false);
  const { artifacts } = useSelector((state) => state.message);
  const [tab, setTab] = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!artifacts || artifacts.length === 0) return null;

  const file = artifacts[0]?.files[activeFile];
  const hmtlFile = artifacts[0]?.files?.find((f) => f.name.includes(".html"));
  const cssFile = artifacts[0]?.files?.find((f) => f.name.includes(".css"));
  const jsFile = artifacts[0]?.files?.find((f) => f.name.includes(".js"));
  const canPreview = Boolean(hmtlFile);

  const previewDoc = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      ${cssFile?.content || ""}
    </style>
    </head>
  <body>
    ${hmtlFile?.content || ""}
    <script>
    ${jsFile?.content || ""}
    </script>
  </body>
  </html>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(file?.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const detectLanguage = (fileName = "") => {
    const name = fileName.toLowerCase();
    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    if (name.endsWith(".js")) return "javascript";
    if (name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".ts")) return "typescript";
    if (name.endsWith(".tsx")) return "typescript";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".py")) return "python";
    if (name.endsWith(".java")) return "java";
    if (name.endsWith(".cpp")) return "cpp";
    if (name.endsWith(".c")) return "c";
    return "plaintext";
  };

  const PanelContent = ({ onClose }) => {
    return (
      <>
        {!collapsed ? (
          <div className="flex flex-col h-full bg-[#09090b] w-full overflow-hidden font-sans border-l border-white/5 shadow-2xl">
            <div className="h-16 px-4 border-b border-white/5 flex items-center gap-3 shrink-0 bg-white/5 backdrop-blur-md">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer shrink-0"
                onClick={() => (onClose ? onClose() : setCollapsed(true))}
              >
                {onClose ? <X size={16} /> : <PanelRightClose size={18} />}
              </button>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white/10 border border-white/10 shrink-0 shadow-inner">
                  <Code2 className="text-white" size={14} />
                </div>
                <div className="text-[14px] font-semibold text-white truncate tracking-tight">
                  {artifacts[0]?.title}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer"
                  onClick={handleCopy}
                >
                  {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>

              {canPreview && (
                <div className="flex items-center gap-1 bg-black/40 border border-white/10 p-1 rounded-xl">
                  <button
                    onClick={() => setTab("code")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all duration-200 ${tab === "code" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white"}`}
                  >
                    <Code2 size={14} /> Code
                  </button>
                  <button
                    onClick={() => setTab("preview")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all duration-200 ${tab === "preview" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white"}`}
                  >
                    <Eye size={14} /> Preview
                  </button>
                </div>
              )}
            </div>

            {tab === "code" && (
              <div className="flex h-auto border-b border-white/5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0 bg-white/5 px-2 pt-2">
                {artifacts[0]?.files?.map((f, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFile(index)}
                    className={`px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-all duration-200 relative cursor-pointer rounded-t-lg mx-0.5 ${activeFile === index ? "text-white bg-white/10 shadow-sm" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                  >
                    {f?.name}
                    {activeFile === index && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-md" />
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-hidden relative">
              {tab === "preview" && canPreview ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full p-4 bg-zinc-900/50"
                >
                  <div className="w-full h-full rounded-2xl relative overflow-hidden bg-white shadow-lg border border-white/10">
                    <iframe
                      title="preview"
                      srcDoc={previewDoc}
                      sandbox="allow-scripts"
                      className="w-full h-full absolute inset-0 bg-white"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full absolute inset-0 bg-[#09090b]"
                >
                  <Editor
                    beforeMount={(monaco) => {
                      monaco.editor.defineTheme('modernTheme', {
                        base: 'vs-dark',
                        inherit: true,
                        rules: [
                          { background: '09090b' },
                        ],
                        colors: {
                          'editor.background': '#09090b',
                          'editor.lineHighlightBackground': '#ffffff0a',
                          'editorLineNumber.foreground': '#52525b',
                          'editorIndentGuide.background': '#ffffff1a',
                        }
                      });
                    }}
                    theme="modernTheme"
                    language={detectLanguage(file?.name)}
                    value={file?.content || ""}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: "JetBrains Mono, monospace",
                      wordWrap: "on",
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      padding: { top: 24, bottom: 24 },
                      lineNumbers: "on",
                      renderLineHighlight: "all",
                    }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex h-full bg-[#09090b] flex-col items-center py-6 gap-4 w-full font-sans border-l border-white/5 text-zinc-400">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-xl hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer shrink-0"
              onClick={() => setCollapsed(false)}
            >
              <PanelRightOpen size={20} />
            </button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className="text-[12px] font-semibold text-zinc-500 tracking-widest uppercase whitespace-nowrap"
                style={{
                  writingMode: "vertical-lr",
                  transform: "rotate(180deg)",
                }}
              >
                {artifacts[0]?.title}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-28 right-4 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black text-[13px] font-semibold shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200 font-sans"
      >
        <Code2 size={16} />
        View Code
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden fixed inset-y-0 right-0 z-50 w-[90vw] max-w-[440px] border-l border-white/10 overflow-hidden shadow-2xl"
            >
              <PanelContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ width: 440 }}
        animate={{ width: collapsed ? 72 : 440 }}
        transition={{
          duration: 0.3,
          ease: easeInOut,
        }}
        className="hidden lg:flex h-full flex-col overflow-hidden shrink-0 z-20 shadow-2xl relative"
      >
        <PanelContent />
      </motion.div>
    </>
  );
}

export default Artifact;
