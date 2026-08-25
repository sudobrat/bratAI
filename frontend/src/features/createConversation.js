import api from "../../utils/axios";

const createConversation = async () => {
  try {
    const { data } = await api.get("/api/chat/create-conversation");
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default createConversation;
