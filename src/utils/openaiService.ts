
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
            
IMPORTANT: You MUST adhere to any specific time constraints mentioned in the tasks. For example:
- "Meeting at 2 PM" means this task MUST be scheduled at 2:00 PM, not any other time
- "Pick up kids at 3 PM" means this task MUST be scheduled at 3:00 PM, not any other time
- "Doctor's appointment at 1:30 PM" means this task MUST be scheduled at 1:30 PM, not any other time

After identifying tasks with specific times, arrange other flexible tasks around these fixed commitments.
For tasks without specific times, estimate a reasonable duration and schedule them at appropriate times.
Do not schedule tasks to overlap with each other.`
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
