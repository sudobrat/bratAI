import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessageSquare,
  Mic,
  MicOff,
  Paperclip,
  Presentation,
  Send,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import sendMessage from "../features/sendMessage.js";
import {
  addMessage,
  setArtifacts,
  setIsLoading,
} from "../redux/messageSlice.js";
import createConversation from "../features/createConversation.js";
import {
  addConversation,
  setConversationTitle,
  setSelectConversation,
} from "../redux/conversationSlice.js";
import updateConversation from "../features/updateConversation.js";

function ChatInput() {
  const [value, setValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Auto");
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { isLoading } = useSelector((state) => state.message);
  const [selectedFile, setSelectedFile] = useState(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.speechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let index = event.resultIndex;
        index < event.results.length;
        index++
      ) {
        transcript += event.results[index][0].transcript;
      }
      setValue(transcript);
    };

    recognition.onspeechend = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (error) => {
      console.log(error);
    };
    recognitionRef.current = recognition;
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser!");
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const dispatch = useDispatch();
  const handleSendMsg = async () => {
    dispatch(setIsLoading(true));
    let conversation = selectedConversation;

    if (!conversation) {
      const conv = await createConversation();
      dispatch(setSelectConversation(conv));
      dispatch(addConversation(conv));
      conversation = conv;
    }

    if (conversation.title == "New Chat") {
      await updateConversation({
        conversationId: conversation._id,
        title: value,
      });

      dispatch(
        setConversationTitle({
          conversationId: conversation._id,
          title: value.slice(0, 30),
        }),
      );
    }

    const formData = new FormData();
    formData.append("prompt", value.trim());
    formData.append("conversationId", conversation?._id);
    formData.append("agent", selectedAgent.toLowerCase());
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    dispatch(
      addMessage({
        role: "user",
        content: value.trim(),
      }),
    );
    setValue("");
    const data = await sendMessage(formData);
    dispatch(setIsLoading(false));
    setSelectedFile(null);
    dispatch(setArtifacts(data?.artifacts || []));
    dispatch(
      addMessage({
        role: "assistant",
        content: data?.answer,
        images: data?.images,
      }),
    );
  };

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto",
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat",
    },
    {
      id: "coding",
      icon: Code2,
      label: "Coding",
    },
    {
      id: "pdf",
      icon: FileText,
      label: "PDF",
    },
    {
      id: "ppt",
      icon: Presentation,
      label: "PPT",
    },
    {
      id: "vision",
      icon: ImageIcon,
      label: "Vision",
    },
    {
      id: "search",
      icon: Globe,
      label: "Search",
    },
  ];

  return (
    <div className="w-full px-4 md:px-8 pb-6 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent font-sans pt-4 absolute bottom-0 left-0">
      <div
        className={`max-w-4xl mx-auto flex flex-col gap-3 bg-zinc-900/80 backdrop-blur-xl border transition-all duration-300 rounded-[32px] p-4 ${listening ? "border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-white/10 shadow-2xl"}`}
      >
        <div className="flex w-full gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1">
          {agents.map((agent) => {
            const isActive = selectedAgent === agent.label;
            const Icon = agent.icon;
            return (
              <div
                key={agent.label}
                onClick={() => setSelectedAgent(agent.label)}
                className={`cursor-pointer flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${isActive ? "bg-white text-black shadow-md" : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"}`}
              >
                <Icon
                  size={15}
                  className={isActive ? "text-black" : "text-zinc-400"}
                />
                {agent.label}
              </div>
            );
          })}
        </div>

        {selectedFile && (
          <div className="px-2">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-3 py-2 shadow-sm">
              {selectedFile?.type === "application/pdf" ? (
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <FileText size={20} className="text-red-400" />
                </div>
              ) : (
                selectedFile.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    className="h-10 w-10 rounded-xl object-cover shadow-sm"
                  />
                )
              )}

              <div className="flex-1">
                <p className="text-[13px] font-medium text-white max-w-[150px] truncate">
                  {selectedFile?.name}
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {Math.ceil(selectedFile.size / 1024)}KB
                </p>
              </div>
              <button
                className="ml-2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => {
                  setSelectedFile(null);
                  fileRef.current.value = "";
                }}
              >
                <X size={14} className="text-zinc-400 hover:text-white" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-end gap-2 px-2 pb-1">
          <textarea
            placeholder={listening ? "Listening..." : "Ask bratAI anything..."}
            onChange={(e) => setValue(e.target.value)}
            value={value}
            className="w-full bg-transparent outline-none resize-none text-[15px] text-white placeholder:text-zinc-500 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50 py-2.5 max-h-[150px]"
            rows={1}
            style={{ minHeight: "44px" }}
          />

          <div className="flex items-center gap-2 mb-1 shrink-0">
            <input
              type="file"
              accept=".pdf, image/*"
              hidden
              ref={fileRef}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedFile(file);
                }
              }}
            />

            <button
              className="flex items-center justify-center w-10 h-10 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
              onClick={() => fileRef.current.click()}
            >
              <Paperclip size={18} />
            </button>
            <button
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 cursor-pointer ${
                listening
                  ? "bg-red-500/20 text-red-500 animate-pulse hover:bg-red-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
              onClick={toggleMic}
            >
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button
              disabled={!value && isLoading}
              className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all duration-200 ${value.trim() ? "bg-white text-black shadow-lg hover:scale-105" : "bg-white/5 text-zinc-500 cursor-not-allowed"}`}
              onClick={handleSendMsg}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
