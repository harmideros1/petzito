import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FlowData } from './types';
import FlowComponent from './components/FlowComponent';
import ComponentPalette from './components/ComponentPalette';
import JsonPanel from './components/JsonPanel';

const initialData: FlowData = {
  flow: {
    id: 'flow_1',
    name: 'Mi Flujo de Ejemplo',
    sections: []
  }
};

function App() {
  const [flowData, setFlowData] = useState<FlowData>(initialData);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('petzito-flow-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFlowData(parsedData);
      } catch (error) {
        console.warn('Failed to parse saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('petzito-flow-data', JSON.stringify(flowData));
  }, [flowData]);

  const handleFlowUpdate = (updatedFlow: FlowData['flow']) => {
    setFlowData({ flow: updatedFlow });
  };

  const handleJsonChange = (newData: FlowData) => {
    setFlowData(newData);
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres resetear el flujo? Esta acción no se puede deshacer.')) {
      setFlowData(initialData);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flow-${flowData.flow.name || 'unnamed'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedData = JSON.parse(content);
          setFlowData(parsedData);
        } catch (error) {
          alert('Error al importar el archivo. Asegúrate de que sea un JSON válido.');
        }
      };
      reader.readAsText(file);
    }
    // Reset input value to allow re-importing the same file
    event.target.value = '';
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-petzito-background">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-petzito-mustard to-petzito-teal rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-800">Petzito</h1>
                </div>
                <span className="text-sm text-gray-500">Flow Builder</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  id="import-file"
                />
                <label
                  htmlFor="import-file"
                  className="px-4 py-2 bg-petzito-teal text-white rounded-md hover:bg-petzito-teal/90 cursor-pointer transition-colors"
                >
                  Importar
                </label>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-petzito-mustard text-white rounded-md hover:bg-petzito-mustard/90 transition-colors"
                >
                  Exportar
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Resetear
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Changed to 2 columns layout */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Sidebar - Component Palette */}
            <div className="col-span-3">
              <ComponentPalette />
            </div>

            {/* Center - Flow Builder */}
            <div className="col-span-5">
              <FlowComponent
                flow={flowData.flow}
                onUpdate={handleFlowUpdate}
              />
            </div>

            {/* Right Sidebar - JSON Panel (now wider) */}
            <div className="col-span-4">
              <div className="sticky top-8">
                <JsonPanel
                  data={flowData}
                  onDataChange={handleJsonChange}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-500">
              <p>Petzito Flow Builder - Interfaz web interactiva para crear flujos, secciones, formularios y campos</p>
              <p className="mt-1">Desarrollado con React, TypeScript y TailwindCSS</p>
            </div>
          </div>
        </footer>
      </div>
    </DndProvider>
  );
}

export default App;
