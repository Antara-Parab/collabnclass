import { useState } from "react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/clerk-react";
import { X, Search, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface CustomParticipantsListProps {
  onClose?: () => void;
  embedded?: boolean;
}

const CustomParticipantsList = ({
  onClose,
  embedded = false,
}: CustomParticipantsListProps) => {
  const { user } = useUser();
  const { useParticipants, useLocalParticipant } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const [searchQuery, setSearchQuery] = useState("");

  const getParticipantDisplayName = (participant: any) => {
    if (participant.userId === user?.id) {
      return user?.username || user?.fullName || user?.firstName || "Me";
    }

    if (participant.name) return participant.name;

    return participant.userId || "Unknown User";
  };

  const getParticipantImage = (participant: any) => {
    if (participant.userId === user?.id) {
      return user?.imageUrl;
    }

    return participant.image;
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const allParticipants = localParticipant
    ? [
        localParticipant,
        ...participants.filter((p) => p.userId !== localParticipant.userId),
      ]
    : participants;

  const filteredParticipants = allParticipants.filter((participant) => {
    const name = getParticipantDisplayName(participant).toLowerCase();
    return name.includes(searchQuery.toLowerCase().trim());
  });

  const content = (
    <div className="flex flex-col h-full w-full min-h-0">
      {/* Standalone Header */}
      {!embedded && (
        <div className="flex items-center justify-between p-4 border-b border-light-4 dark:border-dark-4">
          <h2 className="text-lg font-semibold text-dark-2 dark:text-white">
            Participants ({allParticipants.length})
          </h2>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-dark-2 dark:text-white hover:bg-light-3 dark:hover:bg-dark-3"
            >
              <X size={20} />
            </Button>
          )}
        </div>
      )}

      {/* Embedded Search Filter & Meta Header */}
      <div className="p-3 border-b border-[rgba(0,180,255,0.12)] bg-[#020b16]/40 space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
          <span>Active Members</span>
          <span className="font-semibold text-cyan-400">
            {allParticipants.length} connected
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search participants..."
            className="pl-9 h-8 text-xs bg-[#061527]/80 border-[rgba(0,180,255,0.18)] text-white placeholder:text-neutral-500 rounded-xl focus-visible:ring-1 focus-visible:ring-cyan-400"
          />
        </div>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
        {filteredParticipants.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-neutral-400 text-xs">
            <p>No participants match "{searchQuery}"</p>
          </div>
        ) : (
          filteredParticipants.map((participant, index) => {
            const displayName = getParticipantDisplayName(participant);
            const participantImage = getParticipantImage(participant);
            const isLocal = participant.userId === user?.id;
            const isCallHost = index === 0; // Primary caller/host convention

            return (
              <div
                key={participant.userId || index}
                className="flex items-center space-x-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.04] hover:border-[rgba(0,180,255,0.2)] transition-all"
              >
                {/* Avatar */}
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold overflow-hidden shadow-inner flex-shrink-0">
                  {participantImage ? (
                    <img
                      src={participantImage}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(displayName)}</span>
                  )}
                  {/* Online indicator dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#040e1c]" />
                </div>

                {/* Name & Badges */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-white truncate">
                      {displayName}
                    </p>
                    {isLocal && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 flex-shrink-0">
                        You
                      </span>
                    )}
                    {isCallHost && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 flex-shrink-0">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Host
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate">
                    {participant.userId ? `@${participant.userId.slice(0, 14)}` : "Participant"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="fixed right-10 flex flex-col h-[calc(100vh-86px)] w-[350px] bg-light-1 dark:bg-dark-1 border-l border-light-4 dark:border-dark-4 transition-colors">
      {content}
    </div>
  );
};

export default CustomParticipantsList;
