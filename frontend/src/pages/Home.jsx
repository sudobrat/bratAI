import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import api from "../../utils/axios";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";

import { Icon } from "lucide-react";
import { starNorth } from "@lucide/lab";

function Home() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token });
      dispatch(setUserData(data));
    } catch (err) {
      console.log(err);
    }
  };

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    await handleLogin(token);
  };

  return (
    <div className="h-screen flex bg-[#09090b] text-zinc-50 overflow-hidden font-sans selection:bg-white/20 selection:text-white">
      <SideBar />
      <ChatArea />
      <Artifact />
      {!userData && (
        <div className="fixed inset-0 flex z-50 items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="w-[380px] bg-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-2xl p-8 flex flex-col gap-6 rounded-3xl">
            <div className="flex flex-col gap-1.5 text-center items-center pb-2">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-2 shadow-inner border border-white/10">
                <Icon
                  iconNode={starNorth}
                  size={24}
                  className="text-zinc-200"
                />
              </div>
              <h2 className="text-[22px] font-semibold text-white tracking-tight">
                Welcome to bratAI
              </h2>
              <p className="text-[14px] text-zinc-400">
                Sign in to continue your journey
              </p>
            </div>
            <button
              onClick={googleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 text-sm font-medium text-black bg-white hover:bg-zinc-200 transition-all duration-200 cursor-pointer rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <FcGoogle size={18} /> Continue with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
