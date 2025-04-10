
import { Task } from '../components/TaskList';
import { ScheduledTask } from '../components/Timeline';
import { ScheduleResult } from './schedulerTypes';
import { delay } from './openaiService';
import { extractTimeFromDescription, sortTasksByTime } from './timeUtils';

// Fallback mock implementation in case the Edge Function call fails
export const generateMockSchedule = async (tasks: Task[]): Promise<ScheduleResult> => {
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
  sortTasksByTime(scheduledTasks);
  
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
