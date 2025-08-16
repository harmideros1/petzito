export interface Field {
  id: string;
  type: 'text' | 'number' | 'date' | 'checkbox' | 'select' | 'textarea' | 'email' | 'tel' | 'file' | 'camera';
  label: string;
  placeholder?: string;
  validations: {
    required: boolean;
    regex?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  metadata: {
    translatable: boolean;
    errorColor?: string;
    options?: string[]; // For select fields
    rows?: number; // For textarea
    maxFileSize?: number; // For file upload (in MB)
    allowedTypes?: string[]; // For file upload (e.g., ['pdf', 'png', 'jpg'])
    photoQuality?: 'low' | 'medium' | 'high'; // For camera
    allowGallery?: boolean; // For camera
  };
}

export interface Form {
  id: string;
  name: string;
  fields: Field[];
  submitUrl?: string;
}

export interface Section {
  id: string;
  name: string;
  forms: Form[];
}

export interface Flow {
  id: string;
  name: string;
  sections: Section[];
}

export interface FlowData {
  flow: Flow;
}

export type ComponentType = 'field' | 'form' | 'section' | 'flow';

export interface DragItem {
  type: ComponentType;
  id: string;
  data?: any;
}

