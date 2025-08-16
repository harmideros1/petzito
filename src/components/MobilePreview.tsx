import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FlowData } from '../types';

interface MobilePreviewProps {
  data: FlowData;
}

const MobilePreview: React.FC<MobilePreviewProps> = ({ data }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);

  const { flow } = data;
  const currentSection = flow.sections[currentSectionIndex];
  const currentForm = currentSection?.forms[currentFormIndex];

  const nextSection = () => {
    if (currentSectionIndex < flow.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentFormIndex(0);
    }
  };

  const prevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentFormIndex(0);
    }
  };

  const nextForm = () => {
    if (currentForm && currentFormIndex < currentSection.forms.length - 1) {
      setCurrentFormIndex(currentFormIndex + 1);
    }
  };

  const prevForm = () => {
    if (currentFormIndex > 0) {
      setCurrentFormIndex(currentFormIndex - 1);
    }
  };

  if (!flow.sections.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-petzito-teal rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">📱</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No hay flujo para previsualizar</h2>
            <p className="text-gray-600 mb-6">Crea un flujo en el builder para ver cómo se verá en móvil</p>
            <Link
              to="/"
              className="inline-block bg-petzito-teal text-white px-6 py-3 rounded-lg hover:bg-petzito-teal/90 transition-colors"
            >
              Ir al Builder
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Device Frame */}
      <div className="max-w-sm mx-auto bg-black rounded-3xl p-2 shadow-2xl my-8">
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Status Bar */}
          <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center text-xs">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-2 bg-white rounded-sm"></div>
              <div className="w-4 h-2 bg-white rounded-sm"></div>
              <div className="w-4 h-2 bg-white rounded-sm"></div>
            </div>
          </div>

          {/* App Header */}
          <div className="bg-petzito-teal text-white px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-white">
                ← Volver
              </Link>
              <h1 className="text-lg font-semibold">Petzito</h1>
              <div className="w-6"></div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 h-1">
            <div
              className="bg-petzito-mustard h-1 transition-all duration-300"
              style={{
                width: `${((currentSectionIndex * 100) / flow.sections.length) +
                       ((currentFormIndex * 100) / (currentSection?.forms.length || 1)) / flow.sections.length}%`
              }}
            ></div>
          </div>

          {/* Content */}
          <div className="p-4 bg-gray-50 min-h-[500px]">
            {/* Section Navigation */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={prevSection}
                  disabled={currentSectionIndex === 0}
                  className="px-3 py-1 text-sm bg-petzito-olive text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>
                <span className="text-sm text-gray-600">
                  {currentSectionIndex + 1} de {flow.sections.length}
                </span>
                <button
                  onClick={nextSection}
                  disabled={currentSectionIndex === flow.sections.length - 1}
                  className="px-3 py-1 text-sm bg-petzito-olive text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente →
                </button>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 text-center">
                {currentSection?.name || 'Sin nombre'}
              </h2>
            </div>

            {/* Form Navigation */}
            {currentSection?.forms.length > 1 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={prevForm}
                    disabled={currentFormIndex === 0}
                    className="px-2 py-1 text-xs bg-petzito-mustard text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>
                  <span className="text-xs text-gray-600">
                    Formulario {currentFormIndex + 1} de {currentSection.forms.length}
                  </span>
                  <button
                    onClick={nextForm}
                    disabled={currentFormIndex === currentSection.forms.length - 1}
                    className="px-2 py-1 text-xs bg-petzito-mustard text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
                <h3 className="text-md font-medium text-gray-700 text-center">
                  {currentForm?.name || 'Sin nombre'}
                </h3>
              </div>
            )}

            {/* Form Fields */}
            {currentForm ? (
              <div className="space-y-4">
                {currentForm.fields.map((field) => (
                  <div key={field.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.validations.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>

                    {field.type === 'text' && (
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                      />
                    )}

                    {field.type === 'textarea' && (
                      <textarea
                        placeholder={field.placeholder}
                        rows={field.metadata.rows || 3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                      />
                    )}

                    {field.type === 'number' && (
                      <input
                        type="number"
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                      />
                    )}

                    {field.type === 'email' && (
                      <input
                        type="email"
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                      />
                    )}

                    {field.type === 'tel' && (
                      <input
                        type="tel"
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                      />
                    )}

                    {field.type === 'date' && (
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                      />
                    )}

                    {field.type === 'checkbox' && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-petzito-teal focus:ring-petzito-teal border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">Acepto los términos</span>
                      </div>
                    )}

                    {field.type === 'select' && (
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent">
                        <option value="">Selecciona una opción</option>
                        {field.metadata.options?.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    )}

                    {field.type === 'file' && (
                      <div className="space-y-2">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <div className="text-petzito-teal mb-2">
                            <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">Toca para seleccionar archivo</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {field.metadata.allowedTypes?.join(', ').toUpperCase()} • Máx {field.metadata.maxFileSize || 5}MB
                          </p>
                        </div>
                        <button className="w-full bg-petzito-teal text-white py-2 px-3 rounded text-sm hover:bg-petzito-teal/90 transition-colors">
                          Seleccionar Archivo
                        </button>
                      </div>
                    )}

                    {field.type === 'camera' && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button className="bg-petzito-teal text-white py-3 px-4 rounded-lg hover:bg-petzito-teal/90 transition-colors text-sm">
                            📷 Tomar Foto
                          </button>
                          {field.metadata.allowGallery && (
                            <button className="bg-petzito-mustard text-white py-3 px-4 rounded-lg hover:bg-petzito-mustard/90 transition-colors text-sm">
                              🖼️ Galería
                            </button>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">
                            Calidad: {field.metadata.photoQuality || 'medium'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Submit Button */}
                <button className="w-full bg-petzito-teal text-white py-3 px-4 rounded-lg hover:bg-petzito-teal/90 transition-colors font-medium">
                  Enviar
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No hay formularios en esta sección</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="max-w-sm mx-auto px-4 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Información del Flujo</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Nombre:</strong> {flow.name}</p>
            <p><strong>Secciones:</strong> {flow.sections.length}</p>
            <p><strong>Formularios totales:</strong> {flow.sections.reduce((acc, section) => acc + section.forms.length, 0)}</p>
            <p><strong>Campos totales:</strong> {flow.sections.reduce((acc, section) =>
              acc + section.forms.reduce((formAcc, form) => formAcc + form.fields.length, 0), 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;
