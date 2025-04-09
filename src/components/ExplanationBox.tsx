
import { Info } from 'lucide-react';

interface ExplanationBoxProps {
  explanation: string;
}

const ExplanationBox = ({ explanation }: ExplanationBoxProps) => {
  if (!explanation) return null;

  // Split the explanation into paragraphs based on double newlines
  const paragraphs = explanation.split('\n\n');

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-xl mb-4">Schedule Rationale</h3>
          <div className="text-gray-600 space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className={index % 2 === 0 ? "bg-blue-50 p-3 rounded-md" : ""}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplanationBox;
