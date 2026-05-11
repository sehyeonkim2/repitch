import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MobileHeader } from "../components/MobileHeader";
import { Icon } from "../components/Icon";
import { useApp } from "../state/AppContext";

const InfluencerChatList = () => {
  const navigate = useNavigate();
  const { chatRooms } = useApp();
  const rooms = Object.values(chatRooms).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader title="Chat" view="influencer" />
      <main className="flex-1 px-4 py-3 pb-24">
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
              <Icon name="chat_bubble_outline" size={36} className="!text-on-surface-variant" />
            </div>
            <p className="font-label-sm text-label-sm text-on-surface">아직 채팅방이 없어요</p>
            <p className="text-caption text-on-surface-variant mt-1 max-w-[240px]">
              역제안서를 보내고 기업에서 수락하면 채팅방이 자동으로 생성됩니다
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {rooms.map((room, i) => {
              const lastMsg = room.messages[room.messages.length - 1];
              return (
                <motion.button
                  key={room.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  type="button"
                  onClick={() => navigate(`/influencer/chat/${room.id}`)}
                  className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.07)] text-left active:scale-[0.98] transition-all"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-surface-container-high bg-surface-container shrink-0">
                    <img
                      src={room.influencer.avatarUrl}
                      alt={room.influencer.handle}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-label-sm text-label-sm text-on-surface">
                        @{room.influencer.handle}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        {new Date(room.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    <p className="text-caption text-on-surface-variant truncate">
                      {lastMsg?.text ?? "채팅을 시작해보세요"}
                    </p>
                  </div>
                  <Icon
                    name="arrow_forward_ios"
                    size={14}
                    className="!text-on-surface-variant/50 shrink-0"
                  />
                </motion.button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default InfluencerChatList;
