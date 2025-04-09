
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
      <div className="relative pl-10">
        {tasks.map((task, index) => (
          <div key={task.id} className="mb-6 relative">
            {index < tasks.length - 1 && <div className="timeline-connector" />}
            <div className="flex">
              <div className="absolute left-0 w-10 h-10 rounded-full bg-planner-lightBlue flex items-center justify-center">
                <Clock className="h-5 w-5 text-planner-navy" />
              </div>
              <div className="bg-white rounded-lg border p-4 shadow-sm w-full">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{task.description}</h3>
                  <span className="text-sm bg-planner-lightGray px-2 py-1 rounded-full font-medium text-planner-navy">
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
        ))}
      </div>
    </div>
  );
};

export default Timeline;
