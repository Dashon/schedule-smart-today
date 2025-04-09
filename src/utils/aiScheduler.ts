
import { Task } from '../components/TaskList';
import { ScheduledTask } from '../components/Timeline';
import { generateScheduleWithOpenAI, delay } from './openaiService';

export interface ScheduleResult {
  scheduledTasks: ScheduledTask[];
  explanation: string;
}

export const generateSchedule = async (tasks: Task[]): Promise<ScheduleResult> => {
  try {
    return await generateScheduleWithOpenAI(tasks);
  } catch (error) {
    console.warn("Failed to use OpenAI API, falling back to mock implementation:", error);
    return generateMockSchedule(tasks);
  }
};

// Fallback mock implementation in case the OpenAI API call fails
const generateMockSchedule = async (tasks: Task[]): Promise<ScheduleResult> => {
  // Simulate API call delay
  await delay(2000);
  
  // For the MVP, we'll create a simple algorithm that spreads tasks throughout the day
  // starting from 8 AM with reasonable gaps
  let currentHour = 8;
  let currentMinute = 0;
  
  const scheduledTasks: ScheduledTask[] = tasks.map(task => {
    // Format time as "8:00 AM", "9:30 AM", etc.
    const period = currentHour >= 12 ? 'PM' : 'AM';
    const hour = currentHour > 12 ? currentHour - 12 : currentHour;
    const minute = currentMinute.toString().padStart(2, '0');
    const startTime = `${hour}:${minute} ${period}`;
    
    // Estimate task duration based on description
    let durationMinutes = 30; // Default duration
    let durationText = "30 minutes";
    
    if (task.description.includes("minute")) {
      const match = task.description.match(/(\d+)[- ]minute/);
      if (match && match[1]) {
        durationMinutes = parseInt(match[1]);
        durationText = `${durationMinutes} minutes`;
      }
    } else if (task.description.includes("hour")) {
      const match = task.description.match(/(\d+)[- ]hour/);
      if (match && match[1]) {
        durationMinutes = parseInt(match[1]) * 60;
        durationText = `${match[1]} hour${parseInt(match[1]) > 1 ? 's' : ''}`;
      }
    } else if (task.description.toLowerCase().includes("meeting")) {
      durationMinutes = 60;
      durationText = "1 hour";
    } else if (task.description.toLowerCase().includes("lunch") || 
              task.description.toLowerCase().includes("dinner")) {
      durationMinutes = 45;
      durationText = "45 minutes";
    } else if (task.description.toLowerCase().includes("appointment")) {
      durationMinutes = 60;
      durationText = "1 hour";
    }
    
    // Extract specific time if mentioned in the task
    // Check for patterns like "at 2 PM" or "from 10-11 AM"
    let specificTimeFound = false;
    
    const atTimeRegex = /at (\d{1,2})(?::(\d{2}))?\s*(am|pm|AM|PM)/;
    const atTimeMatch = task.description.match(atTimeRegex);
    
    if (atTimeMatch) {
      const hour = parseInt(atTimeMatch[1]);
      const minute = atTimeMatch[2] ? parseInt(atTimeMatch[2]) : 0;
      const period = atTimeMatch[3].toUpperCase();
      
      currentHour = period === "PM" && hour < 12 ? hour + 12 : hour;
      currentHour = period === "AM" && hour === 12 ? 0 : currentHour;
      currentMinute = minute;
      specificTimeFound = true;
    }
    
    // Move time forward for next task if no specific time was mentioned
    if (!specificTimeFound) {
      // Add task duration plus a 15-minute buffer
      currentMinute += durationMinutes + 15;
      while (currentMinute >= 60) {
        currentHour++;
        currentMinute -= 60;
      }
      
      // Adjust for lunch and dinner times
      if (currentHour === 12 && currentMinute === 0 && !task.description.toLowerCase().includes("lunch")) {
        // It's noon, move to 1 PM if this isn't lunch
        currentHour = 13;
        currentMinute = 0;
      }
    }
    
    return {
      ...task,
      startTime,
      duration: durationText
    };
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
    task.description.match(/at \d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)/)
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
  
  const hasExercise = scheduledTasks.some(task => 
    task.description.toLowerCase().includes("workout") || 
    task.description.toLowerCase().includes("exercise") ||
    task.description.toLowerCase().includes("run")
  );
  
  if (hasExercise) {
    explanation += "I've allowed some buffer time after physical activities. ";
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
