import { useEffect, useState, useCallback, useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

export const useGetCalls = () => {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [calls, setCalls] = useState<Call[]>();
  const [isLoading, setIsLoading] = useState(false);

  const loadCalls = useCallback(async () => {
    if (!client || !user?.id) return;

    setIsLoading(true);

    try {
      // Query meetings where user is creator or member
      const { calls: queriedCalls } = await client.queryCalls({
        sort: [{ field: 'starts_at', direction: -1 }],
        filter_conditions: {
          starts_at: { $exists: true },
          $or: [
            { created_by_user_id: user.id },
            { members: { $in: [user.id] } },
          ],
        },
      });

      setCalls(queriedCalls);
    } catch (error) {
      console.error('Failed to load calls:', error);
    } finally {
      setIsLoading(false);
    }
  }, [client, user?.id]);

  useEffect(() => {
    loadCalls();
  }, [loadCalls]);

  // Periodic polling every 30 seconds to keep live/upcoming status fresh
  useEffect(() => {
    const interval = setInterval(() => {
      loadCalls();
    }, 30000);
    return () => clearInterval(interval);
  }, [loadCalls]);

  const { liveCalls, upcomingCalls, endedCalls } = useMemo(() => {
    const now = new Date();
    const currentTime = now.getTime();
    const threeHoursMs = 3 * 60 * 60 * 1000;

    const live: Call[] = [];
    const upcoming: Call[] = [];
    const ended: Call[] = [];

    if (!calls) {
      return { liveCalls: [], upcomingCalls: [], endedCalls: [] };
    }

    calls.forEach((call) => {
      const { startsAt, endedAt, session } = call.state;
      const startTime = startsAt ? new Date(startsAt).getTime() : 0;
      const hasActiveSession =
        session && (session.participants?.length ?? 0) > 0;

      // 1. Definitively ended call
      if (endedAt) {
        ended.push(call);
        return;
      }

      // 2. Active Session or within live class window (startsAt <= now < startsAt + 3h)
      if (
        hasActiveSession ||
        (startTime > 0 &&
          startTime <= currentTime &&
          currentTime - startTime < threeHoursMs)
      ) {
        live.push(call);
        return;
      }

      // 3. Future scheduled call
      if (startTime > currentTime) {
        upcoming.push(call);
        return;
      }

      // 4. Past the 3-hour window with no active session -> archive to ended
      ended.push(call);
    });

    return {
      liveCalls: live,
      upcomingCalls: upcoming,
      endedCalls: ended,
    };
  }, [calls]);

  return {
    liveCalls,
    upcomingCalls,
    endedCalls,
    callRecordings: calls,
    isLoading,
    refreshCalls: loadCalls,
  };
};

export default useGetCalls;
