
import { Info } from 'lucide-react';

interface ExplanationBoxProps {
  explanation: string;
}

const ExplanationBox = ({ explanation }: ExplanationBoxProps) => {
  if (!explanation) return null;

  // Split the explanation into paragraphs based on double newlines
  const paragraphs = explanation.split('\n\n');

  return (
    <div className="bg-gray-50 border rounded-lg p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="mt-1 text-planner-blue">
          <Info className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-medium text-xl mb-3">Schedule Rationale</h3>
          <div className="text-muted-foreground space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplanationBox;
