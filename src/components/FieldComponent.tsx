import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Field } from '../types';

interface FieldComponentProps {
  field: Field;
  onUpdate: (updatedField: Field) => void;
  onDelete: () => void;
}

const FieldComponent: React.FC<FieldComponentProps> = ({ field, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'field',
    item: { type: 'field', id: field.id, data: field },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleInputChange = (key: string, value: any) => {
    const updatedField = { ...field };
    
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      (updatedField as any)[parent][child] = value;
    } else {
      (updatedField as any)[key] = value;
    }
    
    onUpdate(updatedField);
  };

  const fieldTypeColors = {
    text: 'bg-blue-100 text-blue-800',
    number: 'bg-green-100 text-green-800',
    date: 'bg-purple-100 text-purple-800',
    checkbox: 'bg-yellow-100 text-yellow-800',
    select: 'bg-indigo-100 text-indigo-800',
    textarea: 'bg-pink-100 text-pink-800',
    email: 'bg-red-100 text-red-800',
    tel: 'bg-orange-100 text-orange-800',
  };

  return (
    <div
      ref={drag as any}
      className={`bg-white rounded-lg shadow-md border-2 border-dashed border-petzito-teal p-4 mb-3 cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-lg'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${fieldTypeColors[field.type]}`}>
            {field.type}
          </span>
          <h4 className="font-medium text-gray-800">{field.label || 'Unnamed Field'}</h4>
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
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => handleInputChange('label', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => handleInputChange('placeholder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={field.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="checkbox">Checkbox</option>
              <option value="select">Select</option>
              <option value="textarea">Textarea</option>
              <option value="email">Email</option>
              <option value="tel">Telephone</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required</label>
              <input
                type="checkbox"
                checked={field.validations.required}
                onChange={(e) => handleInputChange('validations.required', e.target.checked)}
                className="h-4 w-4 text-petzito-teal focus:ring-petzito-teal border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Translatable</label>
              <input
                type="checkbox"
                checked={field.metadata.translatable}
                onChange={(e) => handleInputChange('metadata.translatable', e.target.checked)}
                className="h-4 w-4 text-petzito-teal focus:ring-petzito-teal border-gray-300 rounded"
              />
            </div>
          </div>

          {field.type === 'select' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Options (comma-separated)</label>
              <input
                type="text"
                value={field.metadata.options?.join(', ') || ''}
                onChange={(e) => handleInputChange('metadata.options', e.target.value.split(',').map(s => s.trim()))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                placeholder="Option 1, Option 2, Option 3"
              />
            </div>
          )}

          {field.type === 'textarea' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
              <input
                type="number"
                value={field.metadata.rows || 3}
                onChange={(e) => handleInputChange('metadata.rows', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                min="1"
                max="10"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Error Color</label>
            <input
              type="color"
              value={field.metadata.errorColor || '#E6A623'}
              onChange={(e) => handleInputChange('metadata.errorColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldComponent;

