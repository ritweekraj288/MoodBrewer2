// "use client";

// import { useState } from "react";

// export default function Home() {
//   const [text, setText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const [error, setError] = useState("");

//   const handleSubmit = async () => {
//     if (!text.trim()) return;

//     setLoading(true);
//     setError("");
//     setResult(null);

//     try {
//       const res = await fetch("http://127.0.0.1:8000/recommend", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text }),
//       });

//       if (!res.ok) {
//         throw new Error("Server error");
//       }

//       const data = await res.json();
//       setResult(data);
//     } catch (err) {
//       setError("Failed to get recommendation");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main style={{ maxWidth: 600, margin: "60px auto", padding: 20 }}>
//       <h1>☕ Coffee + Snack Recommender</h1>

//       <textarea
//         placeholder="Describe your time, mood and taste..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         rows={4}
//         style={{ width: "100%", marginTop: 10 }}
//       />

//       <button
//         onClick={handleSubmit}
//         disabled={loading}
//         style={{ marginTop: 15, padding: "10px 20px" }}
//       >
//         {loading ? "Recommending..." : "Get Recommendation"}
//       </button>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {result && (
//         <div
//           style={{
//             marginTop: 30,
//             padding: 24,
//             borderRadius: 12,
//             background: "linear-gradient(135deg, #fff7ed, #ffedd5)",
//             boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//           }}
//         >
//           <h2 style={{ marginBottom: 6 }}>
//             ☕ Your Perfect Coffee + Snack Combo
//           </h2>

//           <p style={{ color: "#555", marginBottom: 18 }}>
//             Carefully chosen based on your time, mood, and taste — a combo that
//             truly matches your personality.
//           </p>

//           {/* Combo line */}
//           <div
//             style={{
//               fontSize: 18,
//               fontWeight: 600,
//               marginBottom: 16,
//               padding: 12,
//               background: "#ffffff",
//               borderRadius: 8,
//               textAlign: "center",
//             }}
//           >
//             {result.beverage} <span style={{ color: "#999" }}>+</span>{" "}
//             {result.food}
//           </div>

//           {/* Details */}
//           <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <div>
//               <p style={{ margin: 4 }}>
//                 <b>☕ Drink:</b> ₹{result.beverage_price}
//               </p>
//               <p style={{ margin: 4 }}>
//                 <b>🥐 Snack:</b> ₹{result.food_price}
//               </p>
//             </div>

//             <div style={{ textAlign: "right" }}>
//               <p style={{ margin: 4 }}>
//                 <b>🔥 Style:</b> {result.predicted_temperature}
//               </p>
//               <p style={{ margin: 4, fontSize: 20 }}>
//                 <b>Total:</b> ₹{result.total_amount}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }
"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, X, Zap, Coffee } from "lucide-react";

type Recommendation = {
  input_text: string;
  predicted_temperature: string;
  beverage: string;
  beverage_price: number;
  food: string;
  food_price: number;
  total_amount: number;
};

export default function BrewAIRecommender() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  async function send() {
    if (!text.trim()) return;

    try {
      setLoading(true);
      setReply(null);

      const res = await axios.post(
        "http://127.0.0.1:8000/recommend",
        { text }
      );

      setReply(res.data);
    } finally {
      setLoading(false);
    }
  }

  function closePopup() {
    setReply(null);
  }

  return (
    <div
      ref={containerRef}
      className="rounded-2xl p-8 space-y-8 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(26,17,16,0.98), rgba(42,24,16,0.95))",
        border: "1px solid rgba(184,115,51,0.3)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
      }}
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mx-auto w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(184,115,51,0.3), rgba(212,165,116,0.3))",
            border: "2px solid rgba(184,115,51,0.5)",
          }}
        >
          <Coffee size={36} color="#D4A574" />
        </motion.div>

        <h1
          className="text-4xl font-bold"
          style={{
            background:
              "linear-gradient(135deg, #FFFEF9, #D4A574, #FFFEF9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.15em",
          }}
        >
          BREW AI
        </h1>

        <p className="text-sm text-[#D4A574] opacity-80">
          Describe your mood, time & cravings — we’ll brew your perfect combo ☕🥐
        </p>
      </div>

      {/* Input Box */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Example: I feel tired in the evening and want something sweet..."
        rows={4}
        className="w-full p-4 rounded-lg text-sm outline-none"
        style={{
          background: "rgba(26,17,16,0.7)",
          border: "1px solid rgba(184,115,51,0.4)",
          color: "#FFFEF9",
        }}
      />

      {/* Button */}
      <motion.button
        onClick={send}
        disabled={loading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 font-bold flex items-center justify-center gap-3"
        style={{
          background:
            "linear-gradient(135deg, #B87333, #CD7F32, #D4A574)",
          color: "#000",
          letterSpacing: "0.15em",
        }}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            BREWING...
          </>
        ) : (
          <>
            <Zap />
            GET MY COMBO
          </>
        )}
      </motion.button>

      {/* Result Popup */}
      <AnimatePresence>
        {reply && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] p-6 z-50"
            style={{
              background:
                "linear-gradient(135deg, rgba(26,17,16,0.98), rgba(42,24,16,0.95))",
              border: "2px solid rgba(184,115,51,0.5)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.9)",
            }}
          >
            {/* Close */}
            <button
              onClick={closePopup}
              className="absolute top-3 right-3"
            >
              <X color="#D4A574" />
            </button>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles color="#D4A574" />
                <h3 className="text-xl font-bold text-[#D4A574]">
                  Your Perfect Coffee + Snack
                </h3>
              </div>

              {/* Combo Line */}
              <div
                className="text-center text-lg font-semibold p-3 rounded"
                style={{
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                ☕ {reply.beverage} <span className="opacity-60">+</span> 🥐{" "}
                {reply.food}
              </div>

              {/* Details */}
              <div className="flex justify-between text-sm text-[#D4A574]">
                <div className="text-right">
                  <p>Style: {reply.predicted_temperature}</p>
                  <p className="text-lg font-bold">
                    Total: ₹{reply.total_amount}
                  </p>
                </div>
              </div>

              <p className="text-xs opacity-70">
                This combo is crafted based on your personality, mood, and time
                of day.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
