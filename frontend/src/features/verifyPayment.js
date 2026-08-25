import api from "../../utils/axios";

const verifyPayment = async (payload) => {
  try {
    const { data } = await api.post("/api/billing/verify", payload);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default verifyPayment;
