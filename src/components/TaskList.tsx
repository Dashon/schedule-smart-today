
import { useState } from 'react';
import { X, Edit2, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface Task {
  id: string;
  description: string;
}

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newDescription: string) => void;
}

const TaskList = ({ tasks, onDeleteTask, onEditTask }: TaskListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEditStart = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.description);
  };

  const handleEditSave = () => {
    if (editingId && editText.trim()) {
      onEditTask(editingId, editText.trim());
      setEditingId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground animate-pulse-gentle">
        Add some tasks to create your daily plan
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li 
          key={task.id}
          className="p-3 bg-card rounded-md border shadow-sm animate-slide-up flex items-center justify-between group"
        >
          {editingId === task.id ? (
            <div className="flex items-center gap-2 w-full">
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleEditSave}
                className="h-8 w-8 text-planner-success"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleEditCancel}
                className="h-8 w-8 text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <span>{task.description}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => handleEditStart(task)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => onDeleteTask(task.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
