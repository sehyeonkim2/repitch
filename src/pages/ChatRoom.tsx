import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MobileHeader } from "../components/MobileHeader";
import { Icon } from "../components/Icon";
import { useApp } from "../state/AppContext";

const ChatRoom = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { chatRooms, sendMessage } = useApp();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const room = id ? chatRooms[id] : null;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room?.messages.length]);

  if (!room) {
    return (
      <div className="flex flex-col min-h-full">
        <MobileHeader title="Chat" back={() => navigate("/brand/chat")} view="brand" />
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
          <Icon name="chat_error" size={48} className="!text-on-surface-variant" />
          <p className="font-body-md text-body-md text-on-surface mt-4">채팅방을 찾을 수 없습니다</p>
        </main>
      </div>
    );
  }

  const handleSend = () => {
    if (!text.trim() || !id) return;
    sendMessage(id, text.trim(), "brand");
    setText("");
  };

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader
        title={`@${room.influencer.handle}`}
        back={() => navigate("/brand/chat")}
        view="brand"
        subtitle={room.influencer.bio}
      />

      <main className="flex-1 px-4 py-4 pb-24 space-y-3">
        <AnimatePresence initial={false}>
          {room.messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.18 }}
              className={`flex items-end gap-2 ${msg.sender === "brand" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "influencer" && (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-surface-container-high bg-surface-container shrink-0">
                  <img
                    src={room.influencer.avatarUrl}
                    alt={room.influencer.handle}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div className="max-w-[72%]">
                <div
                  className={`px-4 py-2.5 text-[13px] leading-relaxed ${
                    msg.sender === "brand"
                      ? "bg-on-surface text-surface rounded-2xl rounded-br-sm"
                      : "bg-white text-on-surface shadow-[0_2px_8px_rgba(0,0,0,0.07)] rounded-2xl rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <div
                  className={`text-[10px] text-on-surface-variant mt-1 ${
                    msg.sender === "brand" ? "text-right" : "text-left"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </main>

      {/* Sticky chat input */}
      <div className="sticky bottom-0 z-20 bg-background px-4 pb-5 pt-3">
        <div className="flex items-center gap-2 bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant/70">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="메시지를 입력하세요..."
            className="flex-1 bg-transparent outline-none text-[13px] text-on-surface placeholder:text-on-surface-variant"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim()}
            className="w-8 h-8 rounded-full bg-on-surface text-surface flex items-center justify-center disabled:opacity-30 transition-opacity shrink-0 active:scale-[0.95]"
          >
            <Icon name="send" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
