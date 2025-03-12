
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const CodePreview = ({ code }: { code: string }) => {
  return (
    <div className="h-full bg-white/80 backdrop-blur-sm border-l border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Generated Code</h2>
      </div>
      <div className="p-4">
        <CodeMirror
          value={code}
          extensions={[javascript()]}
          theme="light"
          editable={false}
          className="text-sm"
        />
      </div>
    </div>
  );
};

export default CodePreview;
