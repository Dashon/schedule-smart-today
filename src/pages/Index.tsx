
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ListChecks } from 'lucide-react';
import { Task } from '@/components/TaskList';
import { ScheduledTask } from '@/components/Timeline';
import { generateSchedule } from '@/utils/aiScheduler';
import PlannerHeader from '@/components/PlannerHeader';
import TaskTab from '@/components/TaskTab';
import ScheduleTab from '@/components/ScheduleTab';

const Index = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('input');

  const handleAddTask = (description: string) => {
    const newTask: Task = {
      id: uuidv4(),
      description
    };
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Task added",
      description: description,
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleEditTask = (id: string, newDescription: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, description: newDescription } : task
    ));
  };

  const handleGenerateSchedule = async () => {
    if (tasks.length === 0) {
      toast({
        title: "No tasks to schedule",
        description: "Add some tasks before generating a schedule",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateSchedule(tasks);
      setScheduledTasks(result.scheduledTasks);
      setExplanation(result.explanation);
      setActiveTab('schedule');
      toast({
        title: "Schedule generated",
        description: "Your daily plan is ready!",
      });
    } catch (error) {
      toast({
        title: "Failed to generate schedule",
        description: "An error occurred while generating your schedule",
        variant: "destructive"
      });
      console.error("Schedule generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTasks([]);
    setScheduledTasks([]);
    setExplanation('');
    setActiveTab('input');
    toast({
      description: "All tasks cleared",
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container max-w-4xl py-8 md:py-12">
        <PlannerHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="input" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              <span>Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Schedule</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="animate-slide-up">
            <TaskTab 
              tasks={tasks}
              isLoading={isLoading}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              onReset={handleReset}
              onGenerateSchedule={handleGenerateSchedule}
            />
          </TabsContent>

          <TabsContent value="schedule" className="animate-slide-up">
            <ScheduleTab 
              scheduledTasks={scheduledTasks}
              explanation={explanation}
              onBackToTasks={() => setActiveTab('input')}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
