import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Form, Field } from '../types';
import FieldComponent from './FieldComponent';

interface FormComponentProps {
  form: Form;
  onUpdate: (updatedForm: Form) => void;
  onDelete: () => void;
  onFieldDrop: (field: Field, formId: string) => void;
}

const FormComponent: React.FC<FormComponentProps> = ({ form, onUpdate, onDelete, onFieldDrop }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'form',
    item: { type: 'form', id: form.id, data: form },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ['field'],
    drop: (item: any) => {
      if (item.type === 'field') {
        onFieldDrop(item.data, form.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleInputChange = (key: string, value: any) => {
    const updatedForm = { ...form };
    (updatedForm as any)[key] = value;
    onUpdate(updatedForm);
  };

  const handleFieldUpdate = (fieldId: string, updatedField: Field) => {
    const updatedForm = {
      ...form,
      fields: form.fields.map(f => f.id === fieldId ? updatedField : f)
    };
    onUpdate(updatedForm);
  };

  const handleFieldDelete = (fieldId: string) => {
    const updatedForm = {
      ...form,
      fields: form.fields.filter(f => f.id !== fieldId)
    };
    onUpdate(updatedForm);
  };

  return (
    <div
      ref={drag as any}
      className={`bg-white rounded-lg shadow-md border-2 border-dashed border-petzito-mustard p-4 mb-4 cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-lg'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-petzito-mustard text-white">
            Form
          </span>
          <h3 className="font-medium text-gray-800">{form.name || 'Unnamed Form'}</h3>
          <span className="text-sm text-gray-500">({form.fields.length} fields)</span>
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
        <div className="space-y-4 pt-3 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Form Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-mustard focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Submit URL</label>
            <input
              type="url"
              value={form.submitUrl || ''}
              onChange={(e) => handleInputChange('submitUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-mustard focus:border-transparent"
              placeholder="https://api.example.com/submit"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Fields</label>
              <span className="text-sm text-gray-500">Drop fields here</span>
            </div>
            <div
              ref={drop as any}
              className={`min-h-[100px] p-3 border-2 border-dashed rounded-lg transition-colors ${
                isOver ? 'border-petzito-teal bg-petzito-teal bg-opacity-10' : 'border-gray-300'
              }`}
            >
              {form.fields.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No fields yet</p>
                  <p className="text-sm">Drag and drop fields here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {form.fields.map((field) => (
                    <FieldComponent
                      key={field.id}
                      field={field}
                      onUpdate={(updatedField) => handleFieldUpdate(field.id, updatedField)}
                      onDelete={() => handleFieldDelete(field.id)}
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

export default FormComponent;

