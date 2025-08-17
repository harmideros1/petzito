require 'rails_helper'

RSpec.configure do |config|
  config.swagger_root = Rails.root.join('swagger').to_s
  config.swagger_docs = {
    'v1/swagger.json' => {
      openapi: '3.0.1',
      info: {
        title: 'Petzito Backend API',
        version: 'v1',
        description: 'API para la gestión de flujos de formularios dinámicos con autenticación de usuarios y persistencia de progreso.',
        contact: {
          name: 'Equipo de Desarrollo Petzito',
          email: 'dev@petzito.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Servidor de Desarrollo'
        }
      ],
      components: {
        securitySchemes: {
          Bearer: {
            type: :http,
            scheme: :bearer,
            bearerFormat: 'JWT'
          }
        },
        schemas: {
          User: {
            type: :object,
            properties: {
              id: { type: :integer },
              email: { type: :string, format: :email },
              created_at: { type: :string, format: 'date-time' },
              updated_at: { type: :string, format: 'date-time' }
            }
          },
          Country: {
            type: :object,
            properties: {
              id: { type: :integer },
              name: { type: :string, example: 'México' },
              created_at: { type: :string, format: 'date-time' },
              updated_at: { type: :string, format: 'date-time' }
            }
          },
          City: {
            type: :object,
            properties: {
              id: { type: :integer },
              name: { type: :string, example: 'Ciudad de México' },
              country_id: { type: :integer },
              country: { '$ref' => '#/components/schemas/Country' },
              created_at: { type: :string, format: 'date-time' },
              updated_at: { type: :string, format: 'date-time' }
            }
          },
          Flow: {
            type: :object,
            properties: {
              id: { type: :string, format: :uuid, example: '550e8400-e29b-41d4-a716-446655440000' },
              name: { type: :string, example: 'EncuestaCliente' },
              json_schema: { 
                type: :object,
                example: {
                  sections: [
                    {
                      id: 'datos_personales',
                      title: 'Datos Personales',
                      forms: [
                        {
                          id: 'form_principal',
                          fields: [
                            {
                              id: 'nombre',
                              type: 'text',
                              label: 'Nombre completo'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              },
              city_id: { type: :integer, nullable: true },
              country_id: { type: :integer, nullable: true },
              city: { '$ref' => '#/components/schemas/City' },
              country: { '$ref' => '#/components/schemas/Country' },
              created_at: { type: :string, format: 'date-time' },
              updated_at: { type: :string, format: 'date-time' }
            },
            required: [:name, :json_schema]
          },
          Error: {
            type: :object,
            properties: {
              error: { type: :string, example: 'Mensaje de error' },
              details: { type: :string, example: 'Detalles adicionales del error' }
            }
          }
        }
      },
      security: [
        { Bearer: [] }
      ]
    }
  }
end
