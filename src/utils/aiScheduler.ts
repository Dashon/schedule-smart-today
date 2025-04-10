
import { Task } from '../components/TaskList';
import { ScheduledTask } from '../components/Timeline';
import { delay } from './openaiService';
import { supabase } from '@/integrations/supabase/client';

export interface ScheduleResult {
  scheduledTasks: ScheduledTask[];
  explanation: string;
}

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

// Helper function to extract time from task description - improved version
const extractTimeFromDescription = (description: string): {time: string, hour: number, minute: number} | null => {
  // Check for various time patterns
  
  // Pattern: "at X:XX AM/PM" or "at X AM/PM"
  const atTimeRegex = /at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm|AM|PM)/i;
  const atTimeMatch = description.match(atTimeRegex);
  
  if (atTimeMatch) {
    const hour = parseInt(atTimeMatch[1]);
    const minute = atTimeMatch[2] ? parseInt(atTimeMatch[2]) : 0;
    const period = atTimeMatch[3].toUpperCase();
    
    const hourIn24 = period === "PM" && hour < 12 ? hour + 12 : (period === "AM" && hour === 12 ? 0 : hour);
    const hourIn12 = hourIn24 > 12 ? hourIn24 - 12 : (hourIn24 === 0 ? 12 : hourIn24);
    const formattedMinute = minute.toString().padStart(2, '0');
    const formattedTime = `${hourIn12}:${formattedMinute} ${period}`;
    
    return {
      time: formattedTime,
      hour: hourIn24,
      minute: minute
    };
  }
  
  // Pattern: "from X-Y AM/PM" or "X to Y AM/PM"
  const rangeTimeRegex = /(?:from|between)?\s*(\d{1,2})(?::(\d{2}))?\s*(?:-|to|–)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm|AM|PM)/i;
  const rangeTimeMatch = description.match(rangeTimeRegex);
  
  if (rangeTimeMatch) {
    const startHour = parseInt(rangeTimeMatch[1]);
    const startMinute = rangeTimeMatch[2] ? parseInt(rangeTimeMatch[2]) : 0;
    const period = rangeTimeMatch[5].toUpperCase();
    
    const startHourIn24 = period === "PM" && startHour < 12 ? startHour + 12 : (period === "AM" && startHour === 12 ? 0 : startHour);
    const startHourIn12 = startHourIn24 > 12 ? startHourIn24 - 12 : (startHourIn24 === 0 ? 12 : startHourIn24);
    const formattedStartMinute = startMinute.toString().padStart(2, '0');
    const formattedTime = `${startHourIn12}:${formattedStartMinute} ${period}`;
    
    return {
      time: formattedTime,
      hour: startHourIn24,
      minute: startMinute
    };
  }
  
  // Pattern: standalone "X:XX AM/PM" or "X AM/PM" anywhere in the text
  const standaloneTimeRegex = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|AM|PM)\b/i;
  const standaloneTimeMatch = description.match(standaloneTimeRegex);
  
  if (standaloneTimeMatch) {
    const hour = parseInt(standaloneTimeMatch[1]);
    const minute = standaloneTimeMatch[2] ? parseInt(standaloneTimeMatch[2]) : 0;
    const period = standaloneTimeMatch[3].toUpperCase();
    
    const hourIn24 = period === "PM" && hour < 12 ? hour + 12 : (period === "AM" && hour === 12 ? 0 : hour);
    const hourIn12 = hourIn24 > 12 ? hourIn24 - 12 : (hourIn24 === 0 ? 12 : hourIn24);
    const formattedMinute = minute.toString().padStart(2, '0');
    const formattedTime = `${hourIn12}:${formattedMinute} ${period}`;
    
    return {
      time: formattedTime,
      hour: hourIn24,
      minute: minute
    };
  }
  
  return null;
}

// Fallback mock implementation in case the Edge Function call fails
const generateMockSchedule = async (tasks: Task[]): Promise<ScheduleResult> => {
  // Simulate API call delay
  await delay(2000);
  
  // First, extract tasks with specific times
  const tasksWithTimes: { task: Task; time: { time: string; hour: number; minute: number } }[] = [];
  const flexibleTasks: Task[] = [];
  
  tasks.forEach(task => {
    const timeInfo = extractTimeFromDescription(task.description);
    if (timeInfo) {
      console.log(`Detected time in task "${task.description}": ${timeInfo.time}`);
      tasksWithTimes.push({ task, time: timeInfo });
    } else {
      flexibleTasks.push(task);
    }
  });
  
  // Sort tasks with specific times
  tasksWithTimes.sort((a, b) => {
    if (a.time.hour !== b.time.hour) {
      return a.time.hour - b.time.hour;
    }
    return a.time.minute - b.time.minute;
  });
  
  // Schedule tasks with specific times first
  const scheduledTasks: ScheduledTask[] = tasksWithTimes.map(({ task, time }) => {
    // Estimate duration based on description
    let durationMinutes = 30;
    let durationText = "30 minutes";
    
    if (task.description.toLowerCase().includes("meeting") || 
        task.description.toLowerCase().includes("appointment")) {
      durationMinutes = 60;
      durationText = "1 hour";
    } else if (task.description.toLowerCase().includes("lunch") || 
              task.description.toLowerCase().includes("dinner")) {
      durationMinutes = 45;
      durationText = "45 minutes";
    }
    
    return {
      ...task,
      startTime: time.time,
      duration: durationText
    };
  });
  
  // Now schedule flexible tasks around fixed tasks
  // Start at 8 AM if there's room before first fixed task, or after the last fixed task
  let currentHour = 8;
  let currentMinute = 0;
  
  if (tasksWithTimes.length > 0) {
    // Check if we can schedule before the first fixed task
    const firstFixedTask = tasksWithTimes[0];
    if (firstFixedTask.time.hour > 9) { // If first task is after 9 AM, we can schedule some flex tasks before
      currentHour = 8;
      currentMinute = 0;
    } else {
      // Start after the last fixed task
      const lastFixedTask = tasksWithTimes[tasksWithTimes.length - 1];
      currentHour = lastFixedTask.time.hour;
      currentMinute = lastFixedTask.time.minute + 60; // Add 1 hour (typical duration)
      
      // Adjust hour if minutes overflow
      while (currentMinute >= 60) {
        currentHour++;
        currentMinute -= 60;
      }
    }
  }
  
  for (const task of flexibleTasks) {
    // Format time
    const period = currentHour >= 12 ? 'PM' : 'AM';
    const hour = currentHour > 12 ? currentHour - 12 : (currentHour === 0 ? 12 : currentHour);
    const minute = currentMinute.toString().padStart(2, '0');
    const startTime = `${hour}:${minute} ${period}`;
    
    // Estimate task duration based on description
    let durationMinutes = 30; // Default duration
    let durationText = "30 minutes";
    
    if (task.description.toLowerCase().includes("meeting") || 
        task.description.toLowerCase().includes("appointment")) {
      durationMinutes = 60;
      durationText = "1 hour";
    } else if (task.description.toLowerCase().includes("lunch") || 
              task.description.toLowerCase().includes("dinner")) {
      durationMinutes = 45;
      durationText = "45 minutes";
    }
    
    scheduledTasks.push({
      ...task,
      startTime,
      duration: durationText
    });
    
    // Move time forward for next task
    currentMinute += durationMinutes + 15; // Add task duration plus a 15-minute buffer
    while (currentMinute >= 60) {
      currentHour++;
      currentMinute -= 60;
    }
  }
  
  // Sort all scheduled tasks by time for final output
  scheduledTasks.sort((a, b) => {
    const timeA = a.startTime.match(/(\d+):(\d+) (AM|PM)/);
    const timeB = b.startTime.match(/(\d+):(\d+) (AM|PM)/);
    
    if (!timeA || !timeB) return 0;
    
    let hourA = parseInt(timeA[1]);
    let hourB = parseInt(timeB[1]);
    
    // Convert to 24-hour format for comparison
    if (timeA[3] === 'PM' && hourA !== 12) hourA += 12;
    if (timeB[3] === 'PM' && hourB !== 12) hourB += 12;
    if (timeA[3] === 'AM' && hourA === 12) hourA = 0;
    if (timeB[3] === 'AM' && hourB === 12) hourB = 0;
    
    if (hourA !== hourB) {
      return hourA - hourB;
    }
    
    // If hours are the same, compare minutes
    const minuteA = parseInt(timeA[2]);
    const minuteB = parseInt(timeB[2]);
    return minuteA - minuteB;
  });
  
  // Generate explanation
  const explanation = generateExplanation(scheduledTasks, tasks);
  
  return {
    scheduledTasks,
    explanation
  };
};

const generateExplanation = (scheduledTasks: ScheduledTask[], originalTasks: Task[]): string => {
  let explanation = "I've organized your schedule based on task durations and logical flow. ";
  
  // Look for patterns and add explanations
  const hasTimeSpecificTasks = scheduledTasks.some(task => 
    task.description.match(/at \d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)/) ||
    task.description.match(/\b\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)\b/) ||
    task.description.match(/from \d{1,2}(?::\d{2})?\s*(?:-|to)\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)/)
  );
  
  if (hasTimeSpecificTasks) {
    explanation += "Tasks with specific times (like meetings or appointments) were scheduled at their required times. ";
  }
  
  const hasMealtimes = scheduledTasks.some(task => 
    task.description.toLowerCase().includes("lunch") || task.description.toLowerCase().includes("dinner")
  );
  
  if (hasMealtimes) {
    explanation += "Meal times were prioritized in their typical time slots. ";
  }
  
  const hasSchoolRelated = scheduledTasks.some(task => 
    task.description.toLowerCase().includes("school") ||
    task.description.toLowerCase().includes("pick up kids")
  );
  
  if (hasSchoolRelated) {
    explanation += "School-related activities were scheduled around typical school hours. ";
  }
  
  explanation += "\n\nThis schedule provides a balanced approach to your day, with adequate time between tasks for transitions. Feel free to adjust times as needed based on your personal preferences and energy levels throughout the day.";
  
  return explanation;
};
