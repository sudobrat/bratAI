import {
  Coins,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftIcon,
  PanelRight,
  PenSquare,
  Plus,
  X,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addConversation,
  setConversations,
  setSelectConversation,
} from "../redux/conversationSlice";
import createConversation from "../features/createConversation";
import getConversations from "../features/getConversations";
import logOut from "../features/logOut";
import { setUserData } from "../redux/userSlice";
import BillingDrawer from "./BillingDrawer";

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const getConv = async () => {
      const data = await getConversations();
      dispatch(setConversations(data));
    };
    getConv();
  }, [userData?._id]);

  const handleCreateConv = async () => {
    const data = await createConversation();
    dispatch(addConversation(data));
  };

  if (collapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center w-[72px] h-screen bg-[#09090b] border-r border-white/5 py-6 gap-3 shrink-0 text-zinc-400">
        <button
          className="flex items-center justify-center w-10 h-10 rounded-xl hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer mb-2"
          onClick={() => setCollapsed(false)}
        >
          <PanelRight size={20} />
        </button>

        <button
          className="flex items-center justify-center w-10 h-10 rounded-xl hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
          onClick={() => {
            dispatch(setSelectConversation(null));
          }}
        >
          <Plus size={20} />
        </button>

        <div className="flex-1 overflow-y-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-6 w-full flex flex-col items-center">
          {conversations.map((conv, i) => {
            const isActive = selectedConversation?._id == conv?._id;
            return (
              <div
                key={`${conv}-${i}`}
                onClick={() => dispatch(setSelectConversation(conv))}
                className={`flex items-center justify-center w-10 h-10 cursor-pointer mb-2 rounded-xl transition-all duration-200
        ${
          isActive
            ? "bg-white/10 text-white shadow-sm"
            : "bg-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
        }`}
              >
                <MessageSquare size={18} />
              </div>
            );
          })}
        </div>

        <div className="relative shrink-0 mt-auto">
          {userData?.avatar && !imageError ? (
            <img
              className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-sm"
              src={userData?.avatar}
              alt={"image"}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shadow-sm">
              <User size={18} className="text-zinc-400" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-white/10 text-zinc-200 hover:text-white hover:bg-zinc-800 shadow-md transition-all duration-200 cursor-pointer"
        onClick={() => {
          setMobileOpen(true);
        }}
      >
        <Menu size={18} />
      </button>
      {mobileOpen && (
        <div
          onClick={() => {
            setMobileOpen(false);
          }}
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] h-screen shrink-0 bg-[#09090b] border-r border-white/5 transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"} `}
      >
        <div className="flex flex-col h-full text-zinc-200">
          <div className="flex items-center gap-3 px-5 py-6">
            <div className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer">
              <PanelLeftIcon size={18} onClick={() => setCollapsed(true)} />
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
            >
              <X size={18} />
            </button>

            <span className="text-[17px] font-semibold text-white tracking-tight flex-1 truncate flex items-center gap-2">
              bratAI
            </span>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
              onClick={() => {
                dispatch(setSelectConversation(null));
              }}
            >
              <PenSquare size={16} />
            </button>
          </div>

          <div className="px-4 pb-2">
            <button
              className="w-full flex items-center justify-center gap-2 text-[14px] font-medium text-black bg-white hover:bg-zinc-200 rounded-xl py-2.5 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
              onClick={() => {
                dispatch(setSelectConversation(null));
              }}
            >
              <Plus size={16} />
              New chat
            </button>
          </div>

          <div className="px-5 pt-6 pb-2 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            Recent
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {conversations.length === 0 ? (
              <div className="px-2 py-4 text-center text-zinc-500 text-[13px]">
                No recent conversations
              </div>
            ) : (
              conversations.map((conv, i) => {
                const isActive = selectedConversation?._id == conv?._id;
                return (
                  <div
                    key={`${conv}-${i}`}
                    onClick={() => dispatch(setSelectConversation(conv))}
                    className={`flex items-center gap-3 cursor-pointer mb-1 px-3 py-2.5 rounded-xl transition-all duration-200
          ${
            isActive
              ? "bg-white/10 text-white font-medium"
              : "bg-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
          }`}
                  >
                    <MessageSquare size={16} className={`shrink-0 ${isActive ? "text-white" : "text-zinc-500"}`} />
                    <span
                      className={`text-[14px] truncate`}
                    >
                      {conv?.title || "New Chat"}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 mt-auto">
            {userData ? (
              <div className="flex items-center gap-3 cursor-pointer rounded-2xl bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 px-3 py-3 transition-all duration-200">
                <div className="relative shrink-0">
                  {userData?.avatar && !imageError ? (
                    <img
                      className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-sm"
                      src={userData?.avatar}
                      alt={"image"}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-sm">
                      <User size={18} className="text-zinc-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-white truncate">
                    {userData?.name || "User"}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 capitalize">
                    {userData.plan} Plan
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    className="flex items-center justify-center w-7 h-7 rounded-lg bg-transparent text-zinc-400 cursor-pointer hover:bg-white/10 hover:text-amber-400 transition-all duration-200"
                    onClick={() => setShowBilling(true)}
                  >
                    <Coins size={14} />
                  </button>
                  <button
                    className="flex items-center justify-center w-7 h-7 rounded-lg bg-transparent text-zinc-400 cursor-pointer hover:bg-white/10 hover:text-red-400 transition-all duration-200"
                    onClick={() => {
                      logOut();
                      dispatch(setUserData(null));
                    }}
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button className="w-full flex items-center justify-center gap-2 text-[14px] font-medium text-white bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-xl py-2.5 cursor-pointer transition-all duration-200">
                Log In
              </button>
            )}
          </div>
        </div>
      </div>
      <BillingDrawer
        open={showBilling}
        onClose={() => {
          setShowBilling(false);
        }}
      />
    </>
  );
}

export default SideBar;
