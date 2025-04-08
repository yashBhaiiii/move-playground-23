
import { useState, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { rust } from '@codemirror/lang-rust';
import { cpp } from '@codemirror/lang-cpp'; // For Solidity highlighting
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Download, Copy, Code, Play } from 'lucide-react';

const languageExtensions = {
  'solidity': javascript(),
  'move': javascript(),
  'rust': rust(),
  'go': javascript(),
  'vyper': javascript(),
  'typescript': javascript(),
  'javascript': javascript()
};

const languageMimeTypes = {
  'solidity': 'text/x-solidity',
  'move': 'text/x-move',
  'rust': 'text/x-rust',
  'go': 'text/x-go',
  'vyper': 'text/x-vyper',
  'typescript': 'text/typescript',
  'javascript': 'text/javascript'
};

const languageFileExtensions = {
  'solidity': '.sol',
  'move': '.move',
  'rust': '.rs',
  'go': '.go',
  'vyper': '.vy',
  'typescript': '.ts',
  'javascript': '.js'
};

interface CodePreviewProps {
  code: string;
  generateCode: (language: string) => string;
  width: number;
  onResize: (newWidth: number) => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const CodePreview = ({ 
  code, 
  generateCode, 
  width, 
  onResize, 
  selectedLanguage, 
  onLanguageChange 
}: CodePreviewProps) => {
  const [displayedCode, setDisplayedCode] = useState<string>('');
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(width);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleGenerateCode = () => {
    const newCode = generateCode(selectedLanguage);
    setDisplayedCode(newCode);
    toast({
      title: "Code Generated",
      description: `${selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} smart contract code has been generated based on your flow!`,
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
    a.download = `smart_contract${languageFileExtensions[selectedLanguage] || '.txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Downloaded",
      description: `Your ${selectedLanguage} contract has been downloaded!`,
    });
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(width);
  };

  // Handle resize movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(300, Math.min(800, startWidth - (e.clientX - startX)));
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startX, startWidth, onResize]);

  return (
    <div 
      className="h-full bg-white/80 backdrop-blur-sm border-l border-gray-200 flex flex-col"
      style={{ width: `${width}px` }}
    >
      <div 
        ref={resizeHandleRef}
        className="absolute h-full w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize left-0 top-0 opacity-0 hover:opacity-100"
        onMouseDown={handleResizeStart}
      />

      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">Generated Code</h2>
          <div className="flex items-center space-x-2">
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="move">Move</option>
              <option value="solidity">Solidity</option>
              <option value="rust">Rust</option>
              <option value="go">Go</option>
              <option value="vyper">Vyper</option>
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Supports multiple blockchain languages and complex relationships
        </p>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <CodeMirror
          value={displayedCode}
          extensions={[languageExtensions[selectedLanguage] || javascript()]}
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
          <Code className="h-4 w-4" />
          Generate Code
        </button>
        <button 
          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center gap-1"
          onClick={handleCopyCode}
          disabled={!displayedCode}
        >
          <Copy className="h-4 w-4" />
          Copy
        </button>
        <button 
          className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
          onClick={handleDownload}
          disabled={!displayedCode}
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </div>
  );
};

export default CodePreview;
