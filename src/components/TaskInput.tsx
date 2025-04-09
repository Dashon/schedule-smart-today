
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (task: string) => void;
}

const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [task, setTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      onAddTask(task.trim());
      setTask('');
    }
  };

  const examples = [
    "20-minute run",
    "Grocery shopping",
    "Pick up kids from school at 3 PM",
    "Team meeting from 10-11 AM",
    "Doctor's appointment at 2 PM"
  ];

  const handleExampleClick = (example: string) => {
    onAddTask(example);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a task (e.g., '30-minute workout')"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!task.trim()}>
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </form>
      
      <div>
        <p className="text-sm text-muted-foreground mb-2">Examples:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md hover:bg-secondary/80 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskInput;
