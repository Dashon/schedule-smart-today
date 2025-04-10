
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Calendar, ListChecks, ClipboardList } from 'lucide-react';
import TaskInput from '@/components/TaskInput';
import TaskList, { Task } from '@/components/TaskList';
import Timeline, { ScheduledTask } from '@/components/Timeline';
import ExplanationBox from '@/components/ExplanationBox';
import { generateSchedule } from '@/utils/aiScheduler';

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
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-planner-navy mb-2">
            Daily Planner Assistant
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Add your tasks, and our AI will optimize your daily schedule for maximum productivity
          </p>
        </div>

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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-planner-blue" />
                  Enter Your Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <TaskInput onAddTask={handleAddTask} />
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Your Tasks ({tasks.length})</h3>
                    {tasks.length > 0 && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleReset}
                        className="h-8 text-xs"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                  <TaskList 
                    tasks={tasks} 
                    onDeleteTask={handleDeleteTask} 
                    onEditTask={handleEditTask} 
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={handleGenerateSchedule} 
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
          </TabsContent>

          <TabsContent value="schedule" className="animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-planner-blue" />
                  Your Optimized Daily Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {scheduledTasks.length > 0 ? (
                  <>
                    <Timeline tasks={scheduledTasks} />
                    <Separator />
                    <ExplanationBox explanation={explanation} />
                    <div className="pt-4 flex justify-center">
                      <Button 
                        onClick={() => setActiveTab('input')} 
                        variant="outline" 
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Modify Tasks
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No schedule generated yet</p>
                    <Button 
                      onClick={() => setActiveTab('input')} 
                      variant="link" 
                      className="mt-2"
                    >
                      Add tasks to get started
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
