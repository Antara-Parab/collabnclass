import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export interface AttendanceRecord {
  id?: string;
  meeting_id: string;
  user_id: string;
  user_name: string;
  joined_at: string;
  left_at?: string | null;
}

class AttendanceService {
  // Record when a user joins a meeting
  static async recordJoin(meetingId: string, userId: string, userName: string) {
    try {
      if (!isSupabaseConfigured) {
        console.warn('Supabase is not fully configured, skipping attendance tracking.');
        return null;
      }

      // Check if user already has an active session for this meeting
      const { data: existingRecord, error: checkError } = await supabase
        .from('meeting_attendance')
        .select('*')
        .eq('meeting_id', meetingId)
        .eq('user_id', userId)
        .is('left_at', null)
        .maybeSingle();

      if (checkError) {
        console.warn('Error checking existing attendance session:', checkError);
      }

      if (existingRecord) {
        return existingRecord;
      }

      const { data, error } = await supabase
        .from('meeting_attendance')
        .insert({
          meeting_id: meetingId,
          user_id: userId,
          user_name: userName,
          joined_at: new Date().toISOString(),
          left_at: null,
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error recording join:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to record join:', error);
      return null;
    }
  }

  // Record when a user leaves a meeting
  static async recordLeave(meetingId: string, userId: string) {
    try {
      if (!isSupabaseConfigured) return null;

      const { data, error } = await supabase
        .from('meeting_attendance')
        .update({
          left_at: new Date().toISOString(),
        })
        .eq('meeting_id', meetingId)
        .eq('user_id', userId)
        .is('left_at', null)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error recording leave:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to record leave:', error);
      return null;
    }
  }

  // Get attendance records for a specific meeting
  static async getMeetingAttendance(meetingId: string) {
    try {
      if (!isSupabaseConfigured) return [];

      const { data, error } = await supabase
        .from('meeting_attendance')
        .select('*')
        .eq('meeting_id', meetingId)
        .order('joined_at', { ascending: true });

      if (error) {
        console.error('Error fetching attendance:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      return [];
    }
  }

  // Get all attendance records for a user
  static async getUserAttendance(userId: string) {
    try {
      if (!isSupabaseConfigured) return [];

      const { data, error } = await supabase
        .from('meeting_attendance')
        .select('*')
        .eq('user_id', userId)
        .order('joined_at', { ascending: false });

      if (error) {
        console.error('Error fetching user attendance:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch user attendance:', error);
      return [];
    }
  }
}

export default AttendanceService;
