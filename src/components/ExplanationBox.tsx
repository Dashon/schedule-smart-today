
import { Info } from 'lucide-react';

interface ExplanationBoxProps {
  explanation: string;
}

const ExplanationBox = ({ explanation }: ExplanationBoxProps) => {
  if (!explanation) return null;

  return (
    <div className="bg-planner-lightGray border rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-1 text-planner-blue">
          <Info className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium text-lg mb-1">Schedule Rationale</h3>
          <div className="text-sm text-muted-foreground whitespace-pre-line">
            {explanation}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplanationBox;
