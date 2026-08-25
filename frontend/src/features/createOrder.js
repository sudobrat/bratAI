import api from "../../utils/axios";

const createOrder = async (plan) => {
  try {
    const { data } = await api.post("/api/billing/create", { plan });
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default createOrder;
