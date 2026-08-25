import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useEffect } from "react";
import getMessages from "../features/getMessages";
import { useDispatch, useSelector } from "react-redux";
import { setArtifacts, setMessages } from "../redux/messageSlice";

function ChatArea() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMessage = async () => {
      if (selectedConversation) {
        if (selectedConversation.title == "New Chat") {
          return;
        }
        const data = await getMessages(selectedConversation?._id);
        dispatch(setMessages(data));
        const latestArtifactMsg = [...data]
          .reverse()
          .find((msg) => msg.artifacts && msg.artifacts.length > 0);

        dispatch(setArtifacts(latestArtifactMsg?.artifacts || []));
      }
    };
    getMessage();
  }, [selectedConversation?._id]);

  return (
    <div className="flex flex-1 min-w-0 flex-col relative h-screen bg-[#09090b]">
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  );
}

export default ChatArea;
