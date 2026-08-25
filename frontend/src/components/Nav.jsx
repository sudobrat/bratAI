import { MessageSquare } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

function Nav() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  return (
    <>
      {selectedConversation && (
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl z-10 sticky top-0 font-sans transition-all duration-300">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 shadow-sm">
            <MessageSquare size={16} className="text-zinc-200" />
          </div>
          <div className="text-[15px] font-semibold text-white tracking-tight">
            {selectedConversation?.title || "New Chat"}
          </div>
          <div className="text-[11px] font-medium text-black bg-white px-2.5 py-1 rounded-full shadow-sm ml-2">
            {messages?.length} Messages
          </div>
        </div>
      )}
    </>
  );
}

export default Nav;
