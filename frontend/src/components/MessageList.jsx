import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import LoadingAnimation from "./LoadingAnimation";
import { useEffect, useRef } from "react";
import { Icon } from "lucide-react";
import { starNorth } from "@lucide/lab";

function MessageList() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages, isLoading } = useSelector((state) => state.message);

  const bottomRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef?.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, [messages?.length, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-[#09090b] font-sans">
      {messages.length == 0 || !selectedConversation ? (
        <div className="h-full flex flex-col items-center justify-center gap-6 text-center pb-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-2 shadow-inner border border-white/10">
              <Icon iconNode={starNorth} size={32} className="text-zinc-200" />
            </div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">
              bratAI
            </h1>
            <p className="text-[15px] text-zinc-400 max-w-[320px] leading-relaxed">
              How can I help you today?
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4 max-w-[500px]">
            {[
              "Write a Netflix clone",
              "Explain Redis",
              "Build a dashboard",
            ].map((s) => (
              <button
                key={s}
                className="text-[13px] font-medium text-zinc-300 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 pb-48 max-w-4xl mx-auto">
          {messages.map((msg, i) => {
            return (
              <div key={i}>
                <MessageBubble
                  role={msg?.role}
                  content={msg?.content}
                  images={msg?.images || []}
                />
              </div>
            );
          })}

          {isLoading && <LoadingAnimation />}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
