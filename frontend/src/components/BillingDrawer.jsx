import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Crown, X } from "lucide-react";
import { useSelector } from "react-redux";
import createOrder from "../features/createOrder.js";
import verifyPayment from "../features/verifyPayment.js";

function BillingDrawer({ open, onClose }) {
  const { userData } = useSelector((state) => state.user);

  const handleUpgrade = async (plan) => {
    try {
      const data = await createOrder(plan);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data?.order?.amount,
        currency: data?.order?.currency,
        order_id: data?.order?.id,
        name: "bratAI",
        description: `${data?.plan?.name} Plan`,
        handler: async (response) => {
          try {
            const data = await verifyPayment(response);
            onClose();
          } catch (error) {
            console.log(error);
          }
        },
        theme: {
          color: "#09090b",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {" "}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-md transition-opacity"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed right-0 top-0 z-50 h-screen w-full md:w-[400px] bg-zinc-900/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col font-sans"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div>
                <div className="text-white text-xl font-semibold tracking-tight flex items-center gap-2">
                  Billing
                </div>
                <div className="text-zinc-400 text-[12px] font-medium mt-1">Manage plans & credits</div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={18} className="text-zinc-400 hover:text-white" />
              </button>
            </div>

            <div className="p-5 pb-2">
              <div className="rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 p-4 relative overflow-hidden shadow-lg">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <p className="text-zinc-400 text-[11px] font-medium uppercase tracking-wider mb-1">Current Plan</p>
                    <h3 className="text-white text-xl font-semibold capitalize tracking-tight">
                      {userData?.plan || "free"}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
                    <Crown size={20} className="text-amber-400" />
                  </div>
                </div>

                <div className="mt-5 relative z-10">
                  <div className="flex justify-between text-[12px] font-medium text-white mb-1.5">
                    <span>Credits</span>
                    <span>
                      {userData.credits || 0} / {userData.totalCredits || 100}
                    </span>
                  </div>

                  <div className="h-1.5 rounded-full bg-black/50 overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500 relative"
                      style={{
                        width: `${
                          ((userData?.credits || 0) /
                            (userData?.totalCredits || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 flex-1 overflow-auto space-y-3 pb-5">
              <div className="text-zinc-400 text-[11px] font-medium uppercase tracking-wider mb-2 mt-2">
                Available Upgrades
              </div>
              
              <div className="rounded-3xl border border-white/5 p-5 bg-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden">
                <h3 className="text-white font-semibold text-base tracking-tight">Starter</h3>
                <p className="text-white text-2xl font-bold mt-1 tracking-tight">₹199<span className="text-[13px] text-zinc-400 font-medium">/mo</span></p>
                <p className="text-zinc-400 text-[13px] mt-1">500 Credits per month</p>
                <button
                  onClick={() => handleUpgrade("starter")}
                  className="mt-4 w-full rounded-2xl bg-white/10 hover:bg-white text-white hover:text-black py-2.5 font-medium text-sm transition-all shadow-sm cursor-pointer"
                >
                  Upgrade to Starter
                </button>
              </div>
              
              <div className="rounded-3xl border border-white/20 p-5 bg-gradient-to-br from-zinc-800 to-zinc-900 transition-all relative overflow-hidden shadow-xl transform hover:-translate-y-1">
                <div className="absolute top-4 right-4 bg-white text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">Popular</div>
                <h3 className="text-white font-semibold text-base tracking-tight mt-1">Pro</h3>
                <p className="text-white text-2xl font-bold mt-1 tracking-tight">₹499<span className="text-[13px] text-zinc-400 font-medium">/mo</span></p>
                <p className="text-zinc-300 text-[13px] mt-1">1000 Credits per month</p>
                <button
                  onClick={() => handleUpgrade("pro")}
                  className="mt-4 w-full rounded-2xl bg-white hover:bg-zinc-200 text-black py-2.5 font-medium text-sm transition-all shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BillingDrawer;
