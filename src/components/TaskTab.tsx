
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ClipboardList, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskInput from '@/components/TaskInput';
import TaskList, { Task } from '@/components/TaskList';

interface TaskTabProps {
  tasks: Task[];
  isLoading: boolean;
  onAddTask: (description: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newDescription: string) => void;
  onReset: () => void;
  onGenerateSchedule: () => void;
}

const TaskTab = ({
  tasks,
  isLoading,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onReset,
  onGenerateSchedule
}: TaskTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-planner-blue" />
          Enter Your Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TaskInput onAddTask={onAddTask} />
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Your Tasks ({tasks.length})</h3>
            {tasks.length > 0 && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onReset}
                className="h-8 text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
          <TaskList 
            tasks={tasks} 
            onDeleteTask={onDeleteTask} 
            onEditTask={onEditTask} 
          />
        </div>

        <div className="pt-4 flex justify-end">
          <Button 
            onClick={onGenerateSchedule} 
            disabled={tasks.length === 0 || isLoading}
            className="px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Optimizing Schedule...
              </>
            ) : (
              <>Create My Schedule</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskTab;
