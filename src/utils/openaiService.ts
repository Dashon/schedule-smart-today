
import { Task } from '../components/TaskList';
import { ScheduledTask } from '../components/Timeline';
import { ScheduleResult } from './aiScheduler';

interface OpenAIStructuredResponse {
  scheduledTasks: {
    id: string;
    description: string;
    startTime: string;
    duration: string;
  }[];
  explanation: string;
}

export const generateScheduleWithOpenAI = async (tasks: Task[]): Promise<ScheduleResult> => {
  // Get the API key from the window object
  const OPENAI_API_KEY = (window as any).OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not set");
  }
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant that helps people optimize their daily schedules.

VERY IMPORTANT: You MUST identify and adhere to ANY specific time constraints mentioned in tasks. This includes but is not limited to formats like:
- "at 2 PM", "at 2pm", "at 2:00 PM", "at 2:00pm"
- "from 10-11 AM", "10 to 11 am", "10 AM to 11 AM"
- "10:30 AM", "10:30am" (when the time appears anywhere in the task)
- "3 PM", "3pm" (when the time appears anywhere in the task)

For tasks with specific times:
1. Extract the EXACT time mentioned
2. Schedule the task at EXACTLY that time
3. DO NOT change or move these fixed-time tasks under any circumstances

For tasks without specific times:
1. Estimate a reasonable duration
2. Schedule them at appropriate times between fixed tasks
3. Ensure no tasks overlap

Your response MUST be in valid JSON format with the following structure:
{
  "scheduledTasks": [
    {
      "id": "unique-id-1",
      "description": "Task description",
      "startTime": "9:00 AM",
      "duration": "30 minutes"
    },
    ...
  ],
  "explanation": "Clear explanation of the schedule logic"
}`
          },
          {
            role: "user",
            content: `Create an optimized daily schedule for these tasks: ${tasks.map(t => t.description).join(', ')}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 1000,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    try {
      const result = JSON.parse(data.choices[0].message.content) as OpenAIStructuredResponse;
      
      return {
        scheduledTasks: result.scheduledTasks.map(task => ({
          ...task,
          id: task.id || String(Math.random()) // Ensure ID exists
        })),
        explanation: result.explanation
      };
    } catch (error) {
      console.error("Failed to parse OpenAI response:", error);
      throw new Error("Failed to parse the AI response");
    }
  } catch (error) {
    console.error("Error generating schedule with OpenAI:", error);
    throw error;
  }
};

// Artificial delay function to simulate API call (only used if API key is not set)
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
