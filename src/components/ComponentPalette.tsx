import React from 'react';
import { useDrag } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import { Field, Form, Section } from '../types';

const ComponentPalette: React.FC = () => {
  const createField = (type: Field['type']): Field => ({
    id: `field_${uuidv4()}`,
    type,
    label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
    placeholder: `Enter ${type}...`,
    validations: {
      required: false,
    },
    metadata: {
      translatable: true,
      errorColor: '#E6A623',
      ...(type === 'select' && { options: ['Option 1', 'Option 2', 'Option 3'] }),
      ...(type === 'textarea' && { rows: 3 }),
    },
  });

  const createForm = (): Form => ({
    id: `form_${uuidv4()}`,
    name: 'New Form',
    fields: [],
  });

  const createSection = (): Section => ({
    id: `section_${uuidv4()}`,
    name: 'New Section',
    forms: [],
  });

  const DraggableComponent: React.FC<{
    type: 'field' | 'form' | 'section';
    label: string;
    description: string;
    colorClass: string;
    onCreate: () => any;
  }> = ({ type, label, description, colorClass, onCreate }) => {
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
        className={`p-4 bg-white rounded-lg shadow-md border-2 border-dashed border-transparent hover:${colorClass} cursor-move transition-all duration-200 ${
          isDragging ? 'opacity-50 scale-95' : 'hover:shadow-lg'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-800">{label}</h4>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    );
  };

  const fieldTypes: Array<{ type: Field['type']; label: string; description: string }> = [
    { type: 'text', label: 'Text Input', description: 'Single line text input' },
    { type: 'textarea', label: 'Text Area', description: 'Multi-line text input' },
    { type: 'number', label: 'Number Input', description: 'Numeric input field' },
    { type: 'email', label: 'Email Input', description: 'Email address input' },
    { type: 'tel', label: 'Phone Input', description: 'Telephone number input' },
    { type: 'date', label: 'Date Input', description: 'Date picker field' },
    { type: 'checkbox', label: 'Checkbox', description: 'Boolean selection' },
    { type: 'select', label: 'Select Dropdown', description: 'Option selection' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Component Palette</h2>
        <p className="text-sm text-gray-600">Drag and drop components to build your flow</p>
      </div>

      <div className="space-y-4">
        {/* Fields */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-petzito-teal rounded-full mr-2"></span>
            Fields
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {fieldTypes.map((fieldType) => (
              <DraggableComponent
                key={fieldType.type}
                type="field"
                label={fieldType.label}
                description={fieldType.description}
                colorClass="border-petzito-teal"
                onCreate={() => createField(fieldType.type)}
              />
            ))}
          </div>
        </div>

        {/* Forms */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-petzito-mustard rounded-full mr-2"></span>
            Forms
          </h3>
          <DraggableComponent
            type="form"
            label="Form Container"
            description="Group fields together in a form"
            colorClass="border-petzito-mustard"
            onCreate={createForm}
          />
        </div>

        {/* Sections */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-petzito-olive rounded-full mr-2"></span>
            Sections
          </h3>
          <DraggableComponent
            type="section"
            label="Section Container"
            description="Organize forms into logical groups"
            colorClass="border-petzito-olive"
            onCreate={createSection}
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Tips:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Drag fields into forms to organize them</li>
          <li>• Drag forms into sections to group them</li>
          <li>• Drag components directly into the flow area</li>
          <li>• Click the arrow to expand and configure components</li>
        </ul>
      </div>
    </div>
  );
};

export default ComponentPalette;

