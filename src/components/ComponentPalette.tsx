import React from 'react';
import { useDrag } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import { Field, Form, Section } from '../types';

const ComponentPalette: React.FC = () => {
  const createField = (type: Field['type']): Field => ({
    id: `field_${Date.now()}`,
    type,
    label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    placeholder: `Enter ${type}`,
    validations: { required: false },
    metadata: { translatable: true }
  });

  const createForm = (): Form => ({
    id: `form_${Date.now()}`,
    name: 'New Form',
    fields: []
  });

  const createSection = (): Section => ({
    id: `section_${Date.now()}`,
    name: 'New Section',
    forms: []
  });

  const DraggableComponent: React.FC<{
    type: 'field' | 'form' | 'section';
    label: string;
    description: string;
    colorClass: string;
    icon: string;
    onCreate: () => any;
  }> = ({ type, label, description, colorClass, icon, onCreate }) => {
    const [{ isDragging }, drag] = useDrag({
      type,
      item: { type, id: `new_${type}`, data: onCreate() },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag as any}
        className={`group relative p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:${colorClass} cursor-move transition-all duration-200 ${
          isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
        }`}
        title={description}
      >
        <div className="flex items-center space-x-3">
          <div className={`text-2xl ${colorClass}`}>
            {icon}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-800 text-sm">{label}</h4>
          </div>
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {description}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  };

  const fieldTypes: Array<{ type: Field['type']; label: string; description: string; icon: string; colorClass: string }> = [
    { type: 'text', label: 'Text Input', description: 'Single line text input', icon: '📝', colorClass: 'text-blue-600' },
    { type: 'textarea', label: 'Text Area', description: 'Multi-line text input', icon: '📄', colorClass: 'text-indigo-600' },
    { type: 'number', label: 'Number Input', description: 'Numeric input field', icon: '🔢', colorClass: 'text-green-600' },
    { type: 'email', label: 'Email Input', description: 'Email address input', icon: '📧', colorClass: 'text-red-600' },
    { type: 'tel', label: 'Phone Input', description: 'Telephone number input', icon: '📞', colorClass: 'text-orange-600' },
    { type: 'date', label: 'Date Input', description: 'Date picker field', icon: '📅', colorClass: 'text-purple-600' },
    { type: 'checkbox', label: 'Checkbox', description: 'Boolean selection', icon: '☑️', colorClass: 'text-yellow-600' },
    { type: 'select', label: 'Select Dropdown', description: 'Option selection', icon: '📋', colorClass: 'text-pink-600' },
    { type: 'file', label: 'File Upload', description: 'Document and image upload', icon: '📎', colorClass: 'text-emerald-600' },
    { type: 'camera', label: 'Camera', description: 'Photo capture and gallery', icon: '📷', colorClass: 'text-cyan-600' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Component Palette</h3>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 text-petzito-olive">Fields</h4>
          <div className="grid grid-cols-1 gap-2">
            {fieldTypes.map((fieldType) => (
              <DraggableComponent
                key={fieldType.type}
                type="field"
                label={fieldType.label}
                description={fieldType.description}
                colorClass={fieldType.colorClass}
                icon={fieldType.icon}
                onCreate={() => createField(fieldType.type)}
              />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 text-petzito-mustard">Forms</h4>
          <DraggableComponent
            type="form"
            label="Form Container"
            description="Container for organizing multiple fields"
            colorClass="text-petzito-mustard"
            icon="📋"
            onCreate={createForm}
          />
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 text-petzito-olive">Sections</h4>
          <DraggableComponent
            type="section"
            label="Section Container"
            description="Container for organizing multiple forms"
            colorClass="text-petzito-olive"
            icon="📁"
            onCreate={createSection}
          />
        </div>
      </div>
    </div>
  );
};

export default ComponentPalette;

