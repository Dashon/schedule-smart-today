
import { Task } from '../components/TaskList';
import { supabase } from '@/integrations/supabase/client';
import { generateMockSchedule } from './mockScheduler';
import { ScheduleResult } from './schedulerTypes';

export type { ScheduleResult } from './schedulerTypes';

export const generateSchedule = async (tasks: Task[]): Promise<ScheduleResult> => {
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-schedule', {
      body: { tasks }
    });

    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(error.message);
    }

    // Return the result from the Edge Function
    return {
      scheduledTasks: data.scheduledTasks.map(task => ({
        ...task,
        id: task.id || String(Math.random()) // Ensure ID exists
      })),
      explanation: data.explanation
    };
  } catch (error) {
    console.warn("Failed to use Edge Function, falling back to mock implementation:", error);
    return generateMockSchedule(tasks);
  }
};
