
// Helper function to extract time from task description
export const extractTimeFromDescription = (description: string): {time: string, hour: number, minute: number} | null => {
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
};

// Sort scheduled tasks by time
export const sortTasksByTime = (tasks: Array<{ startTime: string }>) => {
  return tasks.sort((a, b) => {
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
};
