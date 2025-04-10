
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get the OpenAI API key from environment variables
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const { tasks } = await req.json();
    
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      throw new Error("Invalid tasks data");
    }

    console.log(`Processing ${tasks.length} tasks for schedule generation`);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-schedule function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
