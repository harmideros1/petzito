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
      console.log('Field dropped on form:', form.id, form.name);
      console.log('Field data:', item.data);
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
      className={`bg-white rounded-lg shadow-sm border border-petzito-mustard p-2 mb-2 cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          <span className="text-lg">📋</span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-petzito-mustard text-white">
            Form
          </span>
          <h3 className="font-medium text-gray-800 text-sm">{form.name || 'Unnamed Form'}</h3>
          <span className="text-sm text-gray-500">({form.fields.length} fields)</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-500 hover:text-gray-700 text-xs"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-500 hover:text-red-700 text-xs"
          >
            ×
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-2 pt-2 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Form Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-petzito-mustard focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Submit URL</label>
              <input
                type="url"
                value={form.submitUrl || ''}
                onChange={(e) => handleInputChange('submitUrl', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-petzito-mustard focus:border-transparent"
                placeholder="https://api.example.com/submit"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-700">Fields</label>
              <span className="text-xs text-gray-500">Drop fields here</span>
            </div>
            <div
              ref={drop as any}
              className={`min-h-[60px] p-2 border-2 border-dashed rounded-lg transition-colors ${
                isOver ? 'border-petzito-teal bg-petzito-teal bg-opacity-10' : 'border-gray-300'
              }`}
            >
              {form.fields.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  <p className="text-sm">No fields yet</p>
                  <p className="text-xs">Drag and drop fields here</p>
                </div>
              ) : (
                <div className="space-y-1">
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

