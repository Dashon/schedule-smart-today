
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Calendar } from 'lucide-react';
import Timeline, { ScheduledTask } from '@/components/Timeline';
import ExplanationBox from '@/components/ExplanationBox';

interface ScheduleTabProps {
  scheduledTasks: ScheduledTask[];
  explanation: string;
  onBackToTasks: () => void;
}

const ScheduleTab = ({ scheduledTasks, explanation, onBackToTasks }: ScheduleTabProps) => {
  return (
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
                onClick={onBackToTasks} 
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
              onClick={onBackToTasks} 
              variant="link" 
              className="mt-2"
            >
              Add tasks to get started
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleTab;
