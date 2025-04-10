
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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Optimized Schedule</h2>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div key={task.id} className="relative">
            <div className="bg-white rounded-lg border shadow-sm w-full overflow-hidden">
              <div className="flex items-center p-4">
                <div className="flex-none mr-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{task.description}</h3>
                  {task.duration && (
                    <p className="text-gray-600 mt-1">
                      Duration: {task.duration}
                    </p>
                  )}
                </div>
                <div className="flex-none ml-4">
                  <span className="text-md bg-blue-100 px-5 py-2 rounded-full font-medium text-blue-800">
                    {task.startTime}
                  </span>
                </div>
              </div>
            </div>
            {index < tasks.length - 1 && (
              <div className="absolute left-7 top-[4.5rem] h-3 border-l-2 border-blue-200"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
