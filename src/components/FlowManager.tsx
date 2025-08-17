import React, { useState, useEffect, useMemo } from 'react';
import { Flow } from '../types';

interface FlowManagerProps {
  onFlowSelect?: (flow: Flow) => void;
}

interface Country {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  country_id: number;
}

const FlowManager: React.FC<FlowManagerProps> = ({ onFlowSelect }) => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingFlow, setEditingFlow] = useState<Flow | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    city_id: '' as string | number,
    country_id: '' as string | number,
    sections: [] as any[],
    jsonInput: ''
  });

  // Filter and pagination states
  const [filters, setFilters] = useState({
    name: '',
    country_id: '',
    city_id: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const API_BASE = 'http://localhost:3000';

  // Fetch countries and cities on component mount
  useEffect(() => {
    fetchCountries();
    fetchCities();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${API_BASE}/countries`);
      if (response.ok) {
        const data = await response.json();
        setCountries(data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(`${API_BASE}/cities`);
      if (response.ok) {
        const data = await response.json();
        setCities(data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchFlows = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/flows`);
      if (response.ok) {
        const data = await response.json();
        // Asegurar que data sea un array
        if (Array.isArray(data)) {
          setFlows(data);
        } else {
          console.error('Expected array but got:', typeof data, data);
          setFlows([]);
        }
      } else {
        // Si no hay flujos, crear uno de ejemplo
        const mockFlow: Flow = {
          id: 'mock-flow-example',
          name: 'Mi Flujo de Ejemplo',
          sections: [
            {
              id: 'section_1',
              name: 'Datos Personales',
              forms: [
                {
                  id: 'form_1',
                  name: 'Formulario Principal',
                  fields: [
                    {
                      id: 'field_1',
                      type: 'text',
                      label: 'Nombre',
                      placeholder: 'Ingresa tu nombre',
                      validations: { required: true },
                      metadata: { translatable: true }
                    }
                  ]
                }
              ]
            }
          ]
        };

        setFlows([mockFlow]);
      }
    } catch (error) {
      setError('Error al cargar los flujos');
      console.error('Error fetching flows:', error);
      setFlows([]);
    } finally {
      setLoading(false);
    }
  };

  const parseJsonInput = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.flow && parsed.flow.sections) {
        return parsed.flow.sections;
      } else if (parsed.sections) {
        return parsed.sections;
      }
      return [];
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return [];
    }
  };

  const handleCreateFlow = async () => {
    if (!formData.name.trim()) {
      setError('El nombre del flujo es requerido');
      return;
    }

    // Validar que se seleccione al menos una ubicación
    if (!formData.city_id && !formData.country_id) {
      setError('Debes seleccionar al menos una ciudad o país');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Parsear el JSON si se proporcionó
      let sections = formData.sections;
      if (formData.jsonInput.trim()) {
        sections = parseJsonInput(formData.jsonInput);
      }

      const flowData = {
        flow: {
          name: formData.name,
          city_id: formData.city_id ? parseInt(formData.city_id.toString()) : undefined,
          country_id: formData.country_id ? parseInt(formData.country_id.toString()) : undefined,
          sections: sections
        }
      };

      const response = await fetch(`${API_BASE}/flows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(flowData)
      });

      if (response.ok) {
        const newFlow = await response.json();
        setFlows(prev => [...prev, newFlow]);
        setShowCreateForm(false);
        setFormData({ name: '', city_id: '', country_id: '', sections: [], jsonInput: '' });
        setError(null);
        // Recargar flujos
        fetchFlows();
      } else {
        const errorData = await response.json();
        setError(errorData.errors?.join(', ') || 'Error al crear el flujo');
      }
    } catch (error) {
      setError('Error de conexión');
      console.error('Error creating flow:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlow = async (flowId: string) => {
    // Use window.confirm instead of global confirm
    if (!window.confirm('¿Estás seguro de que quieres eliminar este flujo?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/flows/${flowId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setFlows(prev => prev.filter(f => f.id !== flowId));
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al eliminar el flujo');
      }
    } catch (error) {
      setError('Error de conexión');
      console.error('Error deleting flow:', error);
    }
  };

  const handleEditFlow = (flow: Flow) => {
    const cityId = flow.city?.id?.toString() || flow.city_id?.toString() || '';
    const countryId = flow.country?.id?.toString() || flow.country_id?.toString() || '';

    setEditingFlow(flow);
    setFormData({
      name: flow.name || '',
      city_id: cityId,
      country_id: countryId,
      sections: flow.json_schema?.sections || flow.sections || [],
      jsonInput: JSON.stringify({ flow: { sections: flow.json_schema?.sections || flow.sections || [] } }, null, 2)
    });
    setShowCreateForm(true);
  };

  const handleUpdateFlow = async () => {
    if (!editingFlow) return;

    if (!formData.name.trim()) {
      setError('El nombre del flujo es requerido');
      return;
    }

    // Validar que se seleccione al menos una ubicación
    if (!formData.city_id && !formData.country_id) {
      setError('Debes seleccionar al menos una ciudad o país');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Parsear el JSON si se proporcionó
      let sections = formData.sections;
      if (formData.jsonInput.trim()) {
        sections = parseJsonInput(formData.jsonInput);
      }

      const flowData = {
        flow: {
          name: formData.name,
          city_id: formData.city_id ? parseInt(formData.city_id.toString()) : undefined,
          country_id: formData.country_id ? parseInt(formData.country_id.toString()) : undefined,
          sections: sections
        }
      };

      const response = await fetch(`${API_BASE}/flows/${editingFlow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(flowData)
      });

      if (response.ok) {
        const updatedFlow = await response.json();
        setFlows(prev => prev.map(f => f.id === editingFlow.id ? updatedFlow : f));
        setShowCreateForm(false);
        setEditingFlow(null);
        setFormData({ name: '', city_id: '', country_id: '', sections: [], jsonInput: '' });
        setError(null);
        // Recargar flujos
        fetchFlows();
      } else {
        const errorData = await response.json();
        setError(errorData.errors?.join(', ') || 'Error al actualizar el flujo');
      }
    } catch (error) {
      setError('Error de conexión');
      console.error('Error updating flow:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlowSelect = (flow: Flow) => {
    if (onFlowSelect) {
      onFlowSelect(flow);
    }
  };

  // Filter and pagination functions
  const filteredFlows = useMemo(() => {
    let filtered = [...flows];

    // Filter by name
    if (filters.name) {
      filtered = filtered.filter(flow =>
        flow.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    // Filter by country
    if (filters.country_id) {
      filtered = filtered.filter(flow =>
        flow.country?.id?.toString() === filters.country_id
      );
    }

    // Filter by city
    if (filters.city_id) {
      filtered = filtered.filter(flow =>
        flow.city?.id?.toString() === filters.city_id
      );
    }

    // Sort by creation date (newest first by default)
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

    return filtered;
  }, [flows, filters, sortOrder]);

  const paginatedFlows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredFlows.slice(startIndex, endIndex);
  }, [filteredFlows, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredFlows.length / itemsPerPage);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page
  };

  const handleSortChange = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // Load flows on mount
  useEffect(() => {
    fetchFlows();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestor de Flujos</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-petzito-teal text-white px-6 py-3 rounded-lg hover:bg-petzito-teal-dark transition-colors font-medium"
          >
            + Crear Nuevo Flujo
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form Preview Section */}
        {showCreateForm && formData.jsonInput && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview del Formulario</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              {(() => {
                try {
                  const parsed = JSON.parse(formData.jsonInput);
                  const sections = parsed.flow?.sections || parsed.sections || [];

                  if (sections.length === 0) {
                    return <p className="text-gray-500 text-center py-8">No hay secciones para mostrar</p>;
                  }

                  return sections.map((section: any, sectionIndex: number) => (
                    <div key={section.id || sectionIndex} className="mb-6">
                      <h4 className="text-md font-medium text-gray-700 mb-3 border-b border-gray-200 pb-2">
                        {section.name || section.title || `Sección ${sectionIndex + 1}`}
                      </h4>

                      {section.forms?.map((form: any, formIndex: number) => (
                        <div key={form.id || formIndex} className="ml-4 mb-4">
                          <h5 className="text-sm font-medium text-gray-600 mb-2">
                            {form.name || `Formulario ${formIndex + 1}`}
                          </h5>

                          <div className="ml-4 space-y-3">
                            {form.fields?.map((field: any, fieldIndex: number) => (
                              <div key={field.id || fieldIndex} className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                  {field.label || `Campo ${fieldIndex + 1}`}
                                  {field.validations?.required && <span className="text-red-500 ml-1">*</span>}
                                </label>

                                {field.type === 'text' && (
                                  <input
                                    type="text"
                                    placeholder={field.placeholder || ''}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                                    disabled
                                  />
                                )}

                                {field.type === 'textarea' && (
                                  <textarea
                                    placeholder={field.placeholder || ''}
                                    rows={3}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                                    disabled
                                  />
                                )}

                                {field.type === 'select' && (
                                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent" disabled>
                                    <option>Selecciona una opción</option>
                                  </select>
                                )}

                                {field.type === 'checkbox' && (
                                  <div className="flex items-center">
                                    <input type="checkbox" className="mr-2" disabled />
                                    <span className="text-sm text-gray-600">{field.label}</span>
                                  </div>
                                )}

                                {field.type === 'date' && (
                                  <input
                                    type="date"
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                                    disabled
                                  />
                                )}

                                {field.type === 'number' && (
                                  <input
                                    type="number"
                                    placeholder={field.placeholder || ''}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                                    disabled
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ));
                } catch (error) {
                  return <p className="text-red-500 text-center py-8">Error al parsear el JSON</p>;
                }
              })()}
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingFlow ? 'Editar Flujo' : 'Crear Nuevo Flujo'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Flujo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                  placeholder="Ingresa el nombre del flujo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <select
                  value={formData.country_id}
                  onChange={(e) => {
                    const countryId = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      country_id: countryId,
                      city_id: '' // Reset city when country changes
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                >
                  <option value="">Selecciona un país</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <select
                  value={formData.city_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, city_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                  disabled={!formData.country_id}
                >
                  <option value="">Selecciona una ciudad</option>
                  {cities
                    .filter(city => !formData.country_id || city.country_id.toString() === formData.country_id.toString())
                    .map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                </select>
                {!formData.country_id && (
                  <p className="text-xs text-gray-500 mt-1">Primero selecciona un país</p>
                )}
              </div>
            </div>

            {/* JSON Input Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estructura JSON del Flujo
              </label>
              <textarea
                value={formData.jsonInput}
                onChange={(e) => setFormData(prev => ({ ...prev, jsonInput: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent font-mono text-sm"
                rows={8}
                placeholder={`{
  "flow": {
    "sections": [
      {
        "id": "section_1",
        "name": "Datos Personales",
        "forms": [
          {
            "id": "form_1",
            "name": "Formulario Principal",
            "fields": [
              {
                "id": "field_1",
                "type": "text",
                "label": "Nombre",
                "placeholder": "Ingresa tu nombre",
                "validations": { "required": true },
                "metadata": { "translatable": true }
              }
            ]
          }
        ]
      }
    ]
  }
}`}
              />
              <p className="text-sm text-gray-500 mt-1">
                Ingresa la estructura JSON del flujo o déjalo vacío para usar la estructura por defecto
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={editingFlow ? handleUpdateFlow : handleCreateFlow}
                disabled={loading}
                className="bg-petzito-teal text-white px-6 py-2 rounded-lg hover:bg-petzito-teal-dark transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Guardando...' : (editingFlow ? 'Actualizar' : 'Crear')}
              </button>

              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingFlow(null);
                  setFormData({ name: '', city_id: '', country_id: '', sections: [], jsonInput: '' });
                  setError(null);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros y Configuración</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Name Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar por nombre
              </label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                placeholder="Nombre del flujo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
              />
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por país
              </label>
              <select
                value={filters.country_id}
                onChange={(e) => handleFilterChange('country_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
              >
                <option value="">Todos los países</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por ciudad
              </label>
              <select
                value={filters.city_id}
                onChange={(e) => handleFilterChange('city_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
                disabled={!filters.country_id}
              >
                <option value="">Todas las ciudades</option>
                {cities
                  .filter(city => !filters.country_id || city.country_id.toString() === filters.country_id)
                  .map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Items per page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Items por página
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petzito-teal focus:border-transparent"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Sort and Results Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSortChange}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span>Ordenar por fecha:</span>
                <span className="font-medium">
                  {sortOrder === 'desc' ? 'Más reciente primero' : 'Más antiguo primero'}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>

              {(filters.name || filters.country_id || filters.city_id) && (
                <button
                  onClick={() => {
                    setFilters({ name: '', country_id: '', city_id: '' });
                    setCurrentPage(1);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Limpiar filtros</span>
                </button>
              )}
            </div>

            <div className="text-sm text-gray-600">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredFlows.length)} de {filteredFlows.length} flujos
            </div>
          </div>
        </div>

        {/* Flows List */}
        <div className="space-y-4">
          {loading && flows.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petzito-teal mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando flujos...</p>
            </div>
          ) : filteredFlows.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron flujos</h3>
              <p className="text-gray-500">Intenta ajustar los filtros o crear un nuevo flujo</p>
            </div>
          ) : (
            <>
              {paginatedFlows.map((flow) => (
                <div
                  key={flow.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{flow.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span>{flow.json_schema?.sections?.length || 0} secciones</span>
                        <span>{flow.json_schema?.sections?.reduce((acc, section) => acc + (section.forms?.length || 0), 0) || 0} formularios</span>
                        <span>{flow.json_schema?.sections?.reduce((acc, section) =>
                          acc + (section.forms?.reduce((formAcc, form) => formAcc + (form.fields?.length || 0), 0) || 0), 0
                        ) || 0} campos</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        📍 {flow.city?.name || 'Ciudad no especificada'}, {flow.country?.name || 'País no especificado'}
                      </div>
                      {flow.created_at && (
                        <div className="text-xs text-gray-400 mt-1">
                          🕒 Creado: {new Date(flow.created_at).toLocaleDateString('es-ES')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditFlow(flow)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        title="Modificar flujo"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDeleteFlow(flow.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                        title="Eliminar flujo"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed rounded-md"
                    >
                      Anterior
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm rounded-md ${
                          page === currentPage
                            ? 'bg-petzito-teal text-white'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed rounded-md"
                    >
                      Siguiente
                    </button>
                  </div>

                  <div className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowManager;
