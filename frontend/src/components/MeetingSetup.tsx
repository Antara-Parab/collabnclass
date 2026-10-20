import { useEffect, useState } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import Alert from './Alert';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Loader2 } from 'lucide-react';

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();
  const { toast } = useToast();
  const [isJoining, setIsJoining] = useState(false);

  if (!call) {
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );
  }

  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      await call.join();
      setIsSetupComplete(true);
    } catch (error) {
      console.error('Failed to join call:', error);
      toast({
        title: 'Failed to join meeting',
        description:
          error instanceof Error
            ? error.message
            : 'Unable to connect to the call. Please check your camera/mic permissions and internet connection.',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (callTimeNotArrived)
    return (
      <Alert
        title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
      />
    );

  if (callHasEnded)
    return (
      <Alert
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-dark-2 dark:text-white bg-light-1 dark:bg-dark-2 transition-colors">
      <h1 className="text-center text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
            className="w-4 h-4 text-royal-1 rounded focus:ring-royal-1"
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-royal-1 hover:bg-royal-2 text-white px-4 py-2.5 min-w-[140px]"
        onClick={handleJoin}
        disabled={isJoining}
      >
        {isJoining ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Connecting...</span>
          </div>
        ) : (
          'Join meeting'
        )}
      </Button>
    </div>
  );
};

export default MeetingSetup;
