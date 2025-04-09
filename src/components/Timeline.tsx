
import { Clock } from 'lucide-react';

export interface ScheduledTask {
  id: string;
  description: string;
  startTime: string;
  duration?: string;
}

interface TimelineProps {
  tasks: ScheduledTask[];
}

const Timeline = ({ tasks }: TimelineProps) => {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      <h2 className="text-xl font-semibold mb-4">Your Optimized Schedule</h2>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div key={task.id} className="relative">
            <div className="bg-white rounded-lg border shadow-sm w-full overflow-hidden">
              <div className="flex items-center">
                <div className="flex-none pl-4 py-4">
                  <div className="w-10 h-10 rounded-full bg-planner-lightBlue flex items-center justify-center">
                    <Clock className="h-5 w-5 text-planner-navy" />
                  </div>
                </div>
                <div className="flex-grow p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">{task.description}</h3>
                    <span className="text-sm bg-planner-lightGray px-3 py-1 rounded-full font-medium text-planner-navy ml-2">
                      {task.startTime}
                    </span>
                  </div>
                  {task.duration && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Duration: {task.duration}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {index < tasks.length - 1 && (
              <div className="absolute left-9 top-[3.5rem] h-3 border-l-2 border-planner-lightBlue"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
