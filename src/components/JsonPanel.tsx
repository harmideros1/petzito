import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FlowData } from '../types';

interface JsonPanelProps {
  data: FlowData;
  onDataChange: (newData: FlowData) => void;
}

const JsonPanel: React.FC<JsonPanelProps> = ({ data, onDataChange }) => {
  useEffect(() => {
    console.log('JsonPanel data:', data);
    console.log('JsonPanel data.flow:', data.flow);
  }, [data]);

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      try {
        const parsedData = JSON.parse(value);
        onDataChange(parsedData);
      } catch (error) {
        // Invalid JSON, don't update
        console.warn('Invalid JSON:', error);
      }
    }
  };

  const jsonString = JSON.stringify(data, null, 2);
  console.log('JSON string to display:', jsonString);

  return (
    <div className="h-full bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">JSON Structure</h3>
        <p className="text-sm text-gray-600">Edit the JSON to update the interface</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">Data length: {jsonString.length} chars</span>
          <span className="text-xs text-gray-500">Flow: {data.flow.sections.length} sections</span>
        </div>
      </div>
      <div className="flex-1" style={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}>
        <Editor
          height="100%"
          defaultLanguage="json"
          value={jsonString}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: true },
            fontSize: 13,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            theme: 'vs-light',
            wordWrap: 'on',
            folding: true,
            showFoldingControls: 'always',
            lineDecorationsWidth: 20,
            lineNumbersMinChars: 3,
          }}
        />
      </div>
    </div>
  );
};

export default JsonPanel;

