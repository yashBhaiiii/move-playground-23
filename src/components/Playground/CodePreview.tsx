
import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useToast } from '@/hooks/use-toast';

const CodePreview = ({ code, generateCode }: { code: string, generateCode: () => string }) => {
  const [displayedCode, setDisplayedCode] = useState<string>('');
  const { toast } = useToast();

  const handleGenerateCode = () => {
    const newCode = generateCode();
    setDisplayedCode(newCode);
    toast({
      title: "Code Generated",
      description: "Move smart contract code has been generated based on your flow!",
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(displayedCode);
    toast({
      title: "Copied to Clipboard",
      description: "Code has been copied to your clipboard!",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([displayedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'move_contract.move';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Downloaded",
      description: "Your Move contract has been downloaded!",
    });
  };

  return (
    <div className="h-full bg-white/80 backdrop-blur-sm border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Generated Move Code</h2>
        <p className="text-xs text-gray-500 mt-1">
          Supports one-to-many and many-to-one relationships
        </p>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <CodeMirror
          value={displayedCode}
          extensions={[javascript()]}
          theme="light"
          editable={false}
          className="text-sm h-full"
        />
      </div>
      <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
        <button 
          className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-1"
          onClick={handleGenerateCode}
        >
          Do Magic ✨
        </button>
        <button 
          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          onClick={handleCopyCode}
          disabled={!displayedCode}
        >
          Copy Code
        </button>
        <button 
          className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={handleDownload}
          disabled={!displayedCode}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default CodePreview;
