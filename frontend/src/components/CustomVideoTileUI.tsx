import React, { useState } from "react";
import {
  useParticipantViewContext,
  VideoPlaceholderProps,
  useCall,
} from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/clerk-react";
import { MicOff, Pin, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClassroom } from "@/contexts/ClassroomContext";

/**
 * Extracts up to two capitalized initials from a display name.
 */
export const getParticipantInitials = (name?: string): string => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

/**
 * Connection quality signal indicator bars.
 */
export const ConnectionQualityBars = ({
  quality,
}: {
  quality?: string | number;
}) => {
  const isPoor =
    quality === "poor" || quality === "bad" || quality === 3 || quality === 4;
  const isGood = quality === "good" || quality === 2;
  const isExcellent =
    quality === "excellent" || quality === 1 || quality === 0;

  return (
    <div
      className="flex items-end gap-0.5 h-3 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-sm"
      title={`Connection: ${quality ?? "Good"}`}
    >
      <span
        className={cn(
          "w-0.5 h-1 rounded-full",
          isPoor ? "bg-amber-400" : "bg-emerald-400"
        )}
      />
      <span
        className={cn(
          "w-0.5 h-2 rounded-full",
          isPoor
            ? "bg-white/20"
            : isGood || isExcellent
            ? "bg-emerald-400"
            : "bg-white/20"
        )}
      />
      <span
        className={cn(
          "w-0.5 h-3 rounded-full",
          isExcellent ? "bg-emerald-400" : "bg-white/20"
        )}
      />
    </div>
  );
};

/**
 * CustomVideoPlaceholder
 * Displayed inside ParticipantView when a participant's camera is turned off.
 * Features:
 * - Gradient ocean glass backdrop
 * - Profile avatar with fallback initials
 * - Pulsing neon cyan/emerald active speaker ring when participant speaks
 * - Animated bouncing equalizer audio wave bars
 * - Hand raised golden floating badge & glow
 * - Name label
 */
export const CustomVideoPlaceholder: React.FC<VideoPlaceholderProps> = ({
  participant,
  style,
  className,
}) => {
  const [imageError, setImageError] = useState(false);
  const { raisedHands } = useClassroom();
  const isSpeaking = participant.isSpeaking;
  const isHandRaised = raisedHands.has(participant.userId);
  const displayName = participant.name || participant.userId || "Participant";
  const initials = getParticipantInitials(displayName);

  return (
    <div
      style={style}
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center select-none overflow-hidden",
        "bg-gradient-to-br from-[#030a16] via-[#061527] to-[#020712]",
        className
      )}
    >
      {/* Radial glow when speaking or hand raised */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300 pointer-events-none",
          isSpeaking
            ? "opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/25 via-blue-600/10 to-transparent"
            : isHandRaised
            ? "opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-orange-600/10 to-transparent"
            : "opacity-0"
        )}
      />

      {/* Avatar Container with Active Speaker Ring or Hand Raised Ring */}
      <div className="relative z-10 flex flex-col items-center px-4">
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full transition-all duration-300",
            "w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32",
            isSpeaking
              ? "ring-4 ring-cyan-400 ring-offset-4 ring-offset-[#030a16] shadow-[0_0_35px_rgba(0,220,255,0.7)] scale-105 active-speaker-ring"
              : isHandRaised
              ? "ring-4 ring-amber-400 ring-offset-4 ring-offset-[#030a16] shadow-[0_0_30px_rgba(245,158,11,0.6)] hand-raised-glow"
              : "ring-2 ring-white/10 shadow-xl"
          )}
        >
          {participant.image && !imageError ? (
            <img
              src={participant.image}
              alt={displayName}
              onError={() => setImageError(true)}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-700 via-cyan-600 to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider shadow-inner">
              {initials}
            </div>
          )}

          {/* Active audio ripple halo */}
          {isSpeaking && (
            <span className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-25 pointer-events-none" />
          )}

          {/* Hand raised badge on avatar */}
          {isHandRaised && (
            <span className="absolute -top-1.5 -right-1.5 z-20 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-base shadow-[0_0_15px_rgba(245,158,11,0.85)] border-2 border-[#030a16] animate-hand-bounce">
              ✋
            </span>
          )}
        </div>

        {/* Dynamic Equalizer Waves when speaking, or Hand Raised label */}
        {isSpeaking ? (
          <div className="flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 shadow-[0_0_12px_rgba(0,220,255,0.3)]">
            <span className="w-1 h-2 bg-cyan-400 rounded-full audio-bar-1" />
            <span className="w-1 h-3.5 bg-cyan-300 rounded-full audio-bar-2" />
            <span className="w-1 h-4 bg-cyan-400 rounded-full audio-bar-3" />
            <span className="w-1 h-2 bg-cyan-300 rounded-full audio-bar-1" />
            <span className="text-[11px] font-semibold text-cyan-300 ml-1 tracking-wide">
              Speaking
            </span>
          </div>
        ) : isHandRaised ? (
          <div className="flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            <span className="text-xs">✋</span>
            <span className="text-[11px] font-bold text-amber-300 tracking-wide">
              Hand Raised
            </span>
          </div>
        ) : (
          <p className="mt-3 text-xs sm:text-sm font-medium text-neutral-300/80 max-w-[200px] truncate text-center">
            {displayName}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * CustomParticipantViewUI
 * Overlaid on every participant's video tile inside ParticipantView.
 * Features:
 * - Active Speaker neon glowing border around the entire tile
 * - Hand raised golden glowing border & floating ✋ badge
 * - Speaking indicator badge with live animated audio waves (top-left)
 * - Red muted microphone badge (top-left)
 * - Pinned status badge (top-right)
 * - Connection quality bars (top-right)
 * - Bottom identity pill with Name, (You) tag, and Host badge
 */
export const CustomParticipantViewUI = () => {
  const { participant } = useParticipantViewContext();
  const call = useCall();
  const { user } = useUser();
  const { raisedHands } = useClassroom();

  const isSpeaking = participant.isSpeaking;
  const isHandRaised = raisedHands.has(participant.userId);
  const isLocal =
    participant.isLocalParticipant || participant.userId === user?.id;
  const isHost =
    call?.state.createdBy?.id === participant.userId ||
    call?.state.custom?.creatorId === participant.userId;
  const isPinned = !!participant.pin;

  // Audio track status: muted if no audioStream or audio track not published
  const isMuted = !participant.audioStream;
  const displayName = participant.name || participant.userId || "Participant";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl transition-all duration-200">
      {/* 1. Tile Border & Glow: Active Speaker or Hand Raised */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl pointer-events-none transition-all duration-200 z-20",
          isSpeaking
            ? "ring-2 sm:ring-4 ring-cyan-400 ring-offset-1 ring-offset-[#020813] shadow-[inset_0_0_24px_rgba(0,220,255,0.35),0_0_24px_rgba(0,220,255,0.45)] active-speaker-ring"
            : isHandRaised
            ? "ring-2 sm:ring-4 ring-amber-400 ring-offset-1 ring-offset-[#020813] shadow-[inset_0_0_20px_rgba(245,158,11,0.3),0_0_20px_rgba(245,158,11,0.4)] hand-raised-glow"
            : "ring-1 ring-white/10"
        )}
      />

      {/* 2. Top-Left: Audio & Speaking Status Badges */}
      <div className="absolute top-2.5 left-2.5 z-30 flex items-center gap-1.5 pointer-events-auto">
        {isSpeaking ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-950/85 backdrop-blur-md border border-cyan-400/50 text-cyan-300 text-xs font-semibold shadow-[0_0_15px_rgba(0,220,255,0.4)]">
            <span className="flex items-center gap-0.5 h-3">
              <span className="w-0.5 h-1.5 bg-cyan-300 rounded-full audio-bar-1" />
              <span className="w-0.5 h-3.5 bg-cyan-300 rounded-full audio-bar-2" />
              <span className="w-0.5 h-2 bg-cyan-300 rounded-full audio-bar-3" />
            </span>
            <span className="text-[11px] tracking-wide">Speaking</span>
          </div>
        ) : isMuted ? (
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-red-950/80 backdrop-blur-md border border-rose-500/40 text-rose-300 text-[11px] font-medium shadow-md">
            <MicOff className="w-3 h-3 text-rose-400" />
            <span className="hidden sm:inline">Muted</span>
          </div>
        ) : null}

        {/* ✋ Hand Raised Badge on Tile */}
        {isHandRaised && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-950/90 backdrop-blur-md border border-amber-400/70 text-amber-300 text-xs font-semibold shadow-[0_0_16px_rgba(245,158,11,0.5)] animate-hand-bounce">
            <span className="text-sm leading-none">✋</span>
            <span className="text-[11px] tracking-wide font-bold">Hand Raised</span>
          </div>
        )}
      </div>

      {/* 3. Top-Right: Connection & Pinned Badges */}
      <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5 pointer-events-auto">
        {isPinned && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-cyan-500/20 backdrop-blur-md border border-cyan-400/50 text-cyan-300 text-[10px] font-medium shadow-sm">
            <Pin className="w-3 h-3 fill-cyan-400 text-cyan-400" />
            <span>Pinned</span>
          </div>
        )}
        <ConnectionQualityBars quality={participant.connectionQuality} />
      </div>

      {/* 4. Bottom-Left: Name & Role Badges Pill */}
      <div className="absolute bottom-2.5 left-2.5 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#040e1c]/85 backdrop-blur-md border border-[rgba(0,180,255,0.2)] shadow-xl max-w-[calc(100%-20px)] pointer-events-auto">
        <span className="text-xs font-semibold text-white truncate max-w-[120px] sm:max-w-[180px]">
          {displayName}
        </span>

        {isLocal && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/25 text-blue-300 border border-blue-500/40 flex-shrink-0">
            You
          </span>
        )}

        {isHost && (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/25 text-amber-300 border border-amber-500/40 flex-shrink-0">
            <ShieldCheck className="w-2.5 h-2.5" />
            Host
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomParticipantViewUI;
