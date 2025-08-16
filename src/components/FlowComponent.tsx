import React from 'react';
import { useDrop } from 'react-dnd';
import { Flow, Section, Form, Field } from '../types';
import SectionComponent from './SectionComponent';

interface FlowComponentProps {
  flow: Flow;
  onUpdate: (updatedFlow: Flow) => void;
}

const FlowComponent: React.FC<FlowComponentProps> = ({ flow, onUpdate }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ['section'], // Solo acepta sections en el nivel del flow
    drop: (item: any) => {
      if (item.type === 'section') {
        // Solo mover secciones existentes o crear nuevas secciones
        const updatedFlow = {
          ...flow,
          sections: [...flow.sections, item.data]
        };
        onUpdate(updatedFlow);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleInputChange = (key: string, value: any) => {
    const updatedFlow = { ...flow };
    (updatedFlow as any)[key] = value;
    onUpdate(updatedFlow);
  };

  const handleSectionUpdate = (sectionId: string, updatedSection: Section) => {
    const updatedFlow = {
      ...flow,
      sections: flow.sections.map(s => s.id === sectionId ? updatedSection : s)
    };
    onUpdate(updatedFlow);
  };

  const handleSectionDelete = (sectionId: string) => {
    const updatedFlow = {
      ...flow,
      sections: flow.sections.filter(s => s.id !== sectionId)
    };
    onUpdate(updatedFlow);
  };

  const handleFormDrop = (form: Form, sectionId: string) => {
    const updatedFlow = {
      ...flow,
      sections: flow.sections.map(s => {
        if (s.id === sectionId) {
          return { ...s, forms: [...s.forms, form] };
        }
        return s;
      })
    };
    onUpdate(updatedFlow);
  };

  const handleFieldDrop = (field: Field, formId: string) => {
    console.log('FlowComponent: Field dropped on form ID:', formId);
    console.log('Field data:', field);

    const updatedFlow = {
      ...flow,
      sections: flow.sections.map(s => ({
        ...s,
        forms: s.forms.map(f => {
          if (f.id === formId) {
            console.log('Adding field to form:', f.name, f.id);
            return { ...f, fields: [...f.fields, field] };
          }
          return f;
        })
      }))
    };
    onUpdate(updatedFlow);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Flow Builder</h1>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-petzito-teal text-white">
              {flow.sections.length} sections
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Flow Name</label>
          <input
            type="text"
            value={flow.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent text-lg"
            placeholder="Enter flow name..."
          />
        </div>
      </div>

      <div
        ref={drop as any}
        className={`min-h-[200px] p-6 border-2 border-dashed rounded-lg transition-colors ${
          isOver ? 'border-petzito-olive bg-petzito-olive bg-opacity-10' : 'border-gray-300'
        }`}
      >
        {flow.sections.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
            <p className="text-gray-500 mb-4">Start building your flow by dragging and dropping sections here</p>
            <div className="text-sm text-gray-400">
              <p>• Drag sections to organize your flow</p>
              <p>• Forms and fields should be dropped into sections</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {flow.sections.map((section) => (
              <SectionComponent
                key={section.id}
                section={section}
                onUpdate={(updatedSection) => handleSectionUpdate(section.id, updatedSection)}
                onDelete={() => handleSectionDelete(section.id)}
                onFormDrop={handleFormDrop}
                onFieldDrop={handleFieldDrop}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowComponent;

