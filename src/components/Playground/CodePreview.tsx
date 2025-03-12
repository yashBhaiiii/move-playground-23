
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const CodePreview = ({ code }: { code: string }) => {
  return (
    <div className="h-full bg-white/80 backdrop-blur-sm border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Generated Move Code</h2>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <CodeMirror
          value={code}
          extensions={[javascript()]}
          theme="light"
          editable={false}
          className="text-sm h-full"
        />
      </div>
      <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
        <button 
          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          onClick={() => navigator.clipboard.writeText(code)}
        >
          Copy Code
        </button>
        <button className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Download
        </button>
      </div>
    </div>
  );
};

export default CodePreview;
