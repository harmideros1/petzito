import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Section, Form, Field } from '../types';
import FormComponent from './FormComponent';

interface SectionComponentProps {
  section: Section;
  onUpdate: (updatedSection: Section) => void;
  onDelete: () => void;
  onFormDrop: (form: Form, sectionId: string) => void;
  onFieldDrop: (field: Field, formId: string) => void;
}

const SectionComponent: React.FC<SectionComponentProps> = ({ 
  section, 
  onUpdate, 
  onDelete, 
  onFormDrop,
  onFieldDrop 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'section',
    item: { type: 'section', id: section.id, data: section },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ['form', 'field'],
    drop: (item: any) => {
      if (item.type === 'form') {
        onFormDrop(item.data, section.id);
      } else if (item.type === 'field') {
        // Si se suelta un field directamente en una section, agregarlo al primer form existente
        // o crear un nuevo form solo si no hay ninguno
        if (section.forms.length === 0) {
          const newForm: Form = {
            id: `form_${Date.now()}`,
            name: 'New Form',
            fields: [item.data]
          };
          onFormDrop(newForm, section.id);
        } else {
          // Agregar el field al primer form existente
          const firstForm = section.forms[0];
          const updatedForm = {
            ...firstForm,
            fields: [...firstForm.fields, item.data]
          };
          const updatedSection = {
            ...section,
            forms: section.forms.map(f => f.id === firstForm.id ? updatedForm : f)
          };
          onUpdate(updatedSection);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleInputChange = (key: string, value: any) => {
    const updatedSection = { ...section };
    (updatedSection as any)[key] = value;
    onUpdate(updatedSection);
  };

  const handleFormUpdate = (formId: string, updatedForm: Form) => {
    const updatedSection = {
      ...section,
      forms: section.forms.map(f => f.id === formId ? updatedForm : f)
    };
    onUpdate(updatedSection);
  };

  const handleFormDelete = (formId: string) => {
    const updatedSection = {
      ...section,
      forms: section.forms.filter(f => f.id !== formId)
    };
    onUpdate(updatedSection);
  };

  const handleFormFieldDrop = (field: Field, formId: string) => {
    onFieldDrop(field, formId);
  };

  return (
    <div
      ref={drag as any}
      className={`bg-white rounded-lg shadow-md border-2 border-dashed border-petzito-olive p-4 mb-6 cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-lg'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-petzito-olive text-white">
            Section
          </span>
          <h2 className="text-lg font-medium text-gray-800">{section.name || 'Unnamed Section'}</h2>
          <span className="text-sm text-gray-500">({section.forms.length} forms)</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
            <input
              type="text"
              value={section.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-olive focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Forms</label>
              <span className="text-sm text-gray-500">Drop forms or fields here</span>
            </div>
            <div
              ref={drop as any}
              className={`min-h-[120px] p-4 border-2 border-dashed rounded-lg transition-colors ${
                isOver ? 'border-petzito-mustard bg-petzito-mustard bg-opacity-10' : 'border-gray-300'
              }`}
            >
              {section.forms.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No forms yet</p>
                  <p className="text-sm">Drag and drop forms or fields here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {section.forms.map((form) => (
                    <FormComponent
                      key={form.id}
                      form={form}
                      onUpdate={(updatedForm) => handleFormUpdate(form.id, updatedForm)}
                      onDelete={() => handleFormDelete(form.id)}
                      onFieldDrop={handleFormFieldDrop}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionComponent;

