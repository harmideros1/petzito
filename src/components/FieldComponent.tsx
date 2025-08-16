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
    file: 'bg-emerald-100 text-emerald-800',
    camera: 'bg-cyan-100 text-cyan-800',
  };

  const fieldTypeIcons = {
    text: '📝',
    number: '🔢',
    date: '📅',
    checkbox: '☑️',
    select: '📋',
    textarea: '📄',
    email: '📧',
    tel: '📞',
    file: '📎',
    camera: '📷',
  };

  return (
    <div
      ref={drag as any}
      className={`bg-white rounded-lg shadow-sm border border-petzito-teal p-2 mb-1 cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{fieldTypeIcons[field.type]}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${fieldTypeColors[field.type]}`}>
            {field.type}
          </span>
          <h4 className="font-medium text-gray-800 text-sm">{field.label || 'Unnamed Field'}</h4>
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
              <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={field.label}
                onChange={(e) => handleInputChange('label', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-petzito-teal focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <select
                value={field.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-petzito-teal focus:border-transparent"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="checkbox">Checkbox</option>
                <option value="select">Select</option>
                <option value="textarea">Textarea</option>
                <option value="email">Email</option>
                <option value="tel">Telephone</option>
                <option value="file">File Upload</option>
                <option value="camera">Camera</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Placeholder</label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => handleInputChange('placeholder', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-petzito-teal focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Required</label>
              <input
                type="checkbox"
                checked={field.validations.required}
                onChange={(e) => handleInputChange('validations.required', e.target.checked)}
                className="h-3 w-3 text-petzito-teal focus:ring-petzito-teal border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Translatable</label>
              <input
                type="checkbox"
                checked={field.metadata.translatable}
                onChange={(e) => handleInputChange('metadata.translatable', e.target.checked)}
                className="h-3 w-3 text-petzito-teal focus:ring-petzito-teal border-gray-300 rounded"
              />
            </div>
          </div>

          {field.type === 'select' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Options (comma-separated)</label>
              <input
                type="text"
                value={field.metadata.options?.join(', ') || ''}
                onChange={(e) => handleInputChange('metadata.options', e.target.value.split(',').map(s => s.trim()))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-petzito-teal focus:border-transparent"
                placeholder="Option 1, Option 2, Option 3"
              />
            </div>
          )}

          {field.type === 'textarea' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Rows</label>
              <input
                type="number"
                value={field.metadata.rows || 3}
                onChange={(e) => handleInputChange('metadata.rows', parseInt(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-petzito-teal focus:border-transparent"
                min="1"
                max="10"
              />
            </div>
          )}

          {field.type === 'file' && (
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Max File Size (MB)</label>
                <input
                  type="number"
                  value={field.metadata.maxFileSize || 5}
                  onChange={(e) => handleInputChange('metadata.maxFileSize', parseInt(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-petzito-teal focus:border-transparent"
                  min="1"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Allowed Types</label>
                <input
                  type="text"
                  value={field.metadata.allowedTypes?.join(', ') || 'pdf, png, jpg, jpeg'}
                  onChange={(e) => handleInputChange('metadata.allowedTypes', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-petzito-teal focus:border-transparent"
                  placeholder="pdf, png, jpg, jpeg"
                />
              </div>
            </div>
          )}

          {field.type === 'camera' && (
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Photo Quality</label>
                <select
                  value={field.metadata.photoQuality || 'medium'}
                  onChange={(e) => handleInputChange('metadata.photoQuality', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-petzito-teal focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Allow Gallery</label>
                <input
                  type="checkbox"
                  checked={field.metadata.allowGallery || false}
                  onChange={(e) => handleInputChange('metadata.allowGallery', e.target.checked)}
                  className="h-3 w-3 text-petzito-teal focus:ring-petzito-teal border-gray-300 rounded"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Error Color</label>
            <input
              type="color"
              value={field.metadata.errorColor || '#E6A623'}
              onChange={(e) => handleInputChange('metadata.errorColor', e.target.value)}
              className="w-full h-8 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-petzito-teal focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldComponent;

