import api from "../../utils/axios";

const getConversations = async () => {
  try {
    const { data } = await api.get("/api/chat/get-conversation");
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getConversations;
