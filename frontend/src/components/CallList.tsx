import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import Loader from "./Loader";
import { useGetCalls } from "@/hooks/useGetCalls";
import MeetingCard from "./MeetingCard";
import { useToast } from "./ui/use-toast";
import AttendanceModal from "./AttendanceModal";
import { Radio, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CallListProps {
  type: "ended" | "upcoming" | "recordings";
}

const CallList = ({ type }: CallListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getToken } = useAuth();
  const { liveCalls, upcomingCalls, endedCalls, callRecordings, isLoading } =
    useGetCalls();

  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [upcomingFilter, setUpcomingFilter] = useState<"all" | "live" | "scheduled">("all");
  const [attendanceModal, setAttendanceModal] = useState<{
    isOpen: boolean;
    meetingId: string;
    meetingTitle: string;
  }>({
    isOpen: false,
    meetingId: "",
    meetingTitle: "",
  });

  const handleViewAttendance = (meetingId: string, meetingTitle: string) => {
    setAttendanceModal({
      isOpen: true,
      meetingId,
      meetingTitle,
    });
  };

  const calls = useMemo(() => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings;
      case "upcoming": {
        if (upcomingFilter === "live") return liveCalls;
        if (upcomingFilter === "scheduled") return upcomingCalls;
        // All: Live calls first, followed by upcoming
        return [...liveCalls, ...upcomingCalls];
      }
      default:
        return [];
    }
  }, [type, endedCalls, recordings, upcomingFilter, liveCalls, upcomingCalls]);

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "upcoming":
        if (upcomingFilter === "live") return "No Live Classes in Session";
        if (upcomingFilter === "scheduled") return "No Upcoming Scheduled Classes";
        return "No Upcoming or Live Classes";
      case "recordings":
        return "No Recordings Available";
      default:
        return "No Calls";
    }
  };

  const handleDeleteRecording = async (recording: CallRecording) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this recording? This action cannot be undone."
      );
      if (!confirmed) return;

      const recordingId = recording.filename || recording.url;
      const token = await getToken();

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BE_URL || ""}/api/stream/recordings/${encodeURIComponent(
          recordingId
        )}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete recording");
      }

      setRecordings((prev) =>
        prev.filter(
          (r) => r.filename !== recording.filename && r.url !== recording.url
        )
      );

      toast({
        title: "Recording deleted",
        description: "The recording has been permanently removed.",
      });
    } catch (error) {
      console.error("Error deleting recording:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete recording. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
      );

      const recs = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(recs);
    };

    if (type === "recordings") {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  if (isLoading) return <Loader />;

  const noCallsMessage = getNoCallsMessage();
  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;

  const totalUpcomingCount = (liveCalls?.length ?? 0) + (upcomingCalls?.length ?? 0);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Dynamic Filter Tabs for Upcoming Page */}
      {type === "upcoming" && totalUpcomingCount > 0 && (
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#040e1c]/80 backdrop-blur-xl border border-[rgba(0,180,255,0.18)] max-w-fit shadow-lg">
          <button
            onClick={() => setUpcomingFilter("all")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all",
              upcomingFilter === "all"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md border border-cyan-400/40"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All ({totalUpcomingCount})</span>
          </button>

          <button
            onClick={() => setUpcomingFilter("live")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all",
              upcomingFilter === "live"
                ? "bg-rose-500/25 text-rose-200 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.35)]"
                : "text-neutral-400 hover:text-rose-300 hover:bg-rose-500/10"
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span>Live Now ({liveCalls.length})</span>
          </button>

          <button
            onClick={() => setUpcomingFilter("scheduled")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all",
              upcomingFilter === "scheduled"
                ? "bg-cyan-500/25 text-cyan-200 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,220,255,0.25)]"
                : "text-neutral-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Scheduled ({upcomingCalls.length})</span>
          </button>
        </div>
      )}

      {/* Grid of Meeting Cards */}
      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
        {calls && calls.length > 0 ? (
          calls.map((meeting: Call | CallRecording) => {
            const isCall = !("filename" in meeting);
            const isLive =
              isCall &&
              liveCalls.some((c) => c.id === (meeting as Call).id);

            return (
              <MeetingCard
                key={
                  (meeting as Call).id ||
                  (meeting as CallRecording).filename ||
                  (meeting as CallRecording).url
                }
                icon={
                  type === "ended"
                    ? "/icons/previous.svg"
                    : isLive
                    ? "/icons/upcoming.svg"
                    : type === "upcoming"
                    ? "/icons/upcoming.svg"
                    : "/icons/recordings.svg"
                }
                isLive={isLive}
                title={
                  (meeting as Call).state?.custom?.description ||
                  (meeting as CallRecording).filename?.substring(0, 24) ||
                  "Class Meeting"
                }
                date={
                  (meeting as Call).state?.startsAt?.toLocaleString() ||
                  (meeting as CallRecording).start_time?.toLocaleString() ||
                  "Date not set"
                }
                isPreviousMeeting={type === "ended"}
                link={
                  type === "recordings"
                    ? (meeting as CallRecording).url
                    : `${baseUrl}/meeting/${(meeting as Call).id}`
                }
                buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
                buttonText={
                  type === "recordings"
                    ? "Play"
                    : isLive
                    ? "Join Live Class"
                    : "Start Class"
                }
                handleClick={
                  type === "recordings"
                    ? () => window.open((meeting as CallRecording).url, "_blank")
                    : () => navigate(`/meeting/${(meeting as Call).id}`)
                }
                showDeleteButton={type === "recordings"}
                showAttendees={type !== "recordings"}
                meetingId={(meeting as Call)?.id}
                onViewAttendance={type === "ended" ? handleViewAttendance : undefined}
                onDelete={() =>
                  type === "recordings"
                    ? handleDeleteRecording(meeting as CallRecording)
                    : undefined
                }
              />
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 rounded-3xl bg-white/[0.02] border border-white/[0.05] text-center">
            <Radio className="w-10 h-10 text-neutral-500 mb-3" />
            <h1 className="text-xl font-bold text-white">{noCallsMessage}</h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-sm">
              {type === "upcoming"
                ? "Schedule a new classroom session from the dashboard to see it listed here."
                : "No meetings found for this section."}
            </p>
          </div>
        )}

        {/* Attendance Modal */}
        {type === "ended" && (
          <AttendanceModal
            isOpen={attendanceModal.isOpen}
            onClose={() => setAttendanceModal((prev) => ({ ...prev, isOpen: false }))}
            meetingId={attendanceModal.meetingId}
            meetingTitle={attendanceModal.meetingTitle}
          />
        )}
      </div>
    </div>
  );
};

export default CallList;
