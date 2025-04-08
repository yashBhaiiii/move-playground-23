
import { useState, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { rust } from '@codemirror/lang-rust';
import { cpp } from '@codemirror/lang-cpp'; // For Solidity highlighting
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Download, Copy, Code, Sparkles, Loader, Trash, CopyPlus, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleGenerateCode = () => {
    setIsGenerating(true);
    
    // Simulate loading time
    setTimeout(() => {
      const newCode = generateCode(selectedLanguage);
      setDisplayedCode(newCode);
      setIsGenerating(false);
      
      toast({
        title: "Magic Complete! ✨",
        description: `${selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} smart contract code has been generated based on your flow!`,
      });
    }, 1500); // 1.5 seconds loading time
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
      className="h-full flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-l border-gray-200 dark:border-gray-700 shadow-md"
      style={{ width: `${width}px` }}
    >
      <div 
        ref={resizeHandleRef}
        className="absolute h-full w-1 bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-col-resize left-0 top-0 opacity-0 hover:opacity-100 transition-opacity"
        onMouseDown={handleResizeStart}
      />

      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <Code className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            <span>Smart Contract</span>
          </h2>
          <div className="flex items-center space-x-2">
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1.5 bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500 focus:border-purple-400 dark:focus:border-purple-500 focus:outline-none transition duration-200 dark:text-gray-200"
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
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Supports multiple blockchain languages and complex relationships
        </p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 p-4">
          {displayedCode ? (
            <div className="h-full overflow-auto">
              <CodeMirror
                value={displayedCode}
                extensions={[languageExtensions[selectedLanguage] || javascript()]}
                theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                editable={false}
                className="text-sm h-full rounded-md border border-gray-200 dark:border-gray-700"
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
              <div className="text-center p-6">
                <Code className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-lg font-medium">No Code Generated Yet</p>
                <p className="text-sm mt-2">Click "Do Magic ⚡" to generate code based on your flow</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex justify-end space-x-3">
        <Button 
          className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white transition-all duration-200 flex items-center gap-1 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          onClick={handleGenerateCode}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Do Magic ⚡</span>
            </>
          )}
        </Button>
        <Button 
          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-all duration-200 flex items-center gap-1"
          onClick={handleCopyCode}
          disabled={!displayedCode || isGenerating}
        >
          <Copy className="h-4 w-4" />
          <span>Copy</span>
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-all duration-200 flex items-center gap-1 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          onClick={handleDownload}
          disabled={!displayedCode || isGenerating}
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </Button>
      </div>
    </div>
  );
};

export default CodePreview;
