require 'swagger_helper'

RSpec.describe 'Flows API', swagger_doc: 'v1/swagger.json' do
  path '/flows' do
    post 'Crea un nuevo flujo' do
      tags 'Flows'
      consumes 'application/json'
      produces 'application/json'
      security [Bearer: []]

      parameter name: :flow, in: :body, schema: {
        type: :object,
        properties: {
          flow: {
            type: :object,
            properties: {
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
              city_id: { type: :integer, example: 1, nullable: true },
              country_id: { type: :integer, example: 1, nullable: true }
            },
            required: [:name, :json_schema]
          }
        }
      }

      response '201', 'flujo creado' do
        let(:user) { create(:user) }
        let(:city) { create(:city) }
        let(:flow_params) do
          {
            flow: {
              name: 'TestFlow',
              json_schema: {
                sections: [
                  {
                    id: 'section1',
                    title: 'Sección 1',
                    forms: [
                      {
                        id: 'form1',
                        fields: [
                          {
                            id: 'field1',
                            type: 'text',
                            label: 'Campo 1'
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              city_id: city.id
            }
          }
        end

        before do
          allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
          allow_any_instance_of(FlowsController).to receive(:current_user).and_return(user)
        end

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['name']).to eq('TestFlow')
          expect(data['id']).to be_present
        end
      end

      response '422', 'parámetros inválidos' do
        let(:user) { create(:user) }
        let(:flow_params) do
          {
            flow: {
              name: '',
              json_schema: {}
            }
          }
        end

        before do
          allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
          allow_any_instance_of(FlowsController).to receive(:current_user).and_return(user)
        end

        run_test!
      end

      response '401', 'no autorizado' do
        let(:flow_params) { {} }
        run_test!
      end
    end
  end

  path '/flows/{id}' do
    parameter name: :id, in: :path, type: :string, required: true,
              description: 'ID del flujo (UUID)',
              example: '550e8400-e29b-41d4-a716-446655440000'

    get 'Obtiene un flujo por ID' do
      tags 'Flows'
      produces 'application/json'
      security [Bearer: []]

      response '200', 'flujo encontrado' do
        let(:user) { create(:user) }
        let(:flow) { create(:flow, :with_city) }
        let(:id) { flow.id }

        before do
          allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
          allow_any_instance_of(FlowsController).to receive(:current_user).and_return(user)
        end

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['id']).to eq(flow.id)
          expect(data['name']).to eq(flow.name)
        end
      end

      response '404', 'flujo no encontrado' do
        let(:id) { 'invalid-uuid' }
        let(:user) { create(:user) }

        before do
          allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
          allow_any_instance_of(FlowsController).to receive(:current_user).and_return(user)
        end

        run_test!
      end

      response '401', 'no autorizado' do
        let(:id) { '550e8400-e29b-41d4-a716-446655440000' }
        run_test!
      end
    end

    put 'Actualiza un flujo existente' do
      tags 'Flows'
      consumes 'application/json'
      produces 'application/json'
      security [Bearer: []]

      parameter name: :flow, in: :body, schema: {
        type: :object,
        properties: {
          flow: {
            type: :object,
            properties: {
              name: { type: :string, example: 'EncuestaClienteActualizada' },
              json_schema: { type: :object },
              city_id: { type: :integer, nullable: true },
              country_id: { type: :integer, nullable: true }
            }
          }
        }
      }

      response '200', 'flujo actualizado' do
        let(:user) { create(:user) }
        let(:flow) { create(:flow, :with_city) }
        let(:id) { flow.id }
        let(:flow_params) do
          {
            flow: {
              name: 'UpdatedFlow',
              json_schema: flow.json_schema
            }
          }
        end

        before do
          allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
          allow_any_instance_of(FlowsController).to receive(:current_user).and_return(user)
        end

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['name']).to eq('UpdatedFlow')
        end
      end

      response '422', 'parámetros inválidos' do
        let(:user) { create(:user) }
        let(:flow) { create(:flow, :with_city) }
        let(:id) { flow.id }
        let(:flow_params) do
          {
            flow: {
              name: 'Invalid Flow Name',
              json_schema: flow.json_schema
            }
          }
        end

        before do
          allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
          allow_any_instance_of(FlowsController).to receive(:current_user).and_return(user)
        end

        run_test!
      end

      response '404', 'flujo no encontrado' do
        let(:id) { 'invalid-uuid' }
        let(:flow_params) { { flow: { name: 'Test' } } }
        let(:user) { create(:user) }

        before do
          allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
          allow_any_instance_of(FlowsController).to receive(:current_user).and_return(user)
        end

        run_test!
      end
    end

    delete 'Elimina un flujo' do
      tags 'Flows'
      security [Bearer: []]

      response '204', 'flujo eliminado' do
        let(:user) { create(:user) }
        let(:flow) { create(:flow, :with_city) }
        let(:id) { flow.id }

        before do
          allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
          allow_any_instance_of(FlowsController).to receive(:current_user).and_return(user)
        end

        run_test!
      end

      response '404', 'flujo no encontrado' do
        let(:id) { 'invalid-uuid' }
        let(:user) { create(:user) }

        before do
          allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
          allow_any_instance_of(FlowsController).to receive(:current_user).and_return(user)
        end

        run_test!
      end
    end
  end

  path '/flows/by_name/{name}' do
    parameter name: :name, in: :path, type: :string, required: true,
              description: 'Nombre del flujo', example: 'EncuestaCliente'

    get 'Busca un flujo por nombre' do
      tags 'Flows'
      produces 'application/json'
      security [Bearer: []]

      response '200', 'flujo encontrado' do
        let(:user) { create(:user) }
        let(:flow) { create(:flow, :with_city, name: 'UniqueFlow') }
        let(:name) { 'UniqueFlow' }

        before do
          allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
          allow_any_instance_of(FlowsController).to receive(:current_user).and_return(user)
        end

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['name']).to eq('UniqueFlow')
        end
      end

      response '404', 'flujo no encontrado' do
        let(:name) { 'NonExistentFlow' }
        let(:user) { create(:user) }

        before do
          allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
          allow_any_instance_of(FlowsController).to receive(:current_user).and_return(user)
        end

        run_test!
      end
    end
  end

  path '/flows/by_city/{city_id}' do
    parameter name: :city_id, in: :path, type: :integer, required: true,
              description: 'ID de la ciudad', example: 1

    get 'Obtiene flujos asignados a una ciudad' do
      tags 'Flows'
      produces 'application/json'
      security [Bearer: []]

      response '200', 'flujos encontrados' do
        let(:user) { create(:user) }
        let(:country) { create(:country) }
        let(:city) { create(:city, country: country) }
        let(:city_id) { city.id }
        let!(:flow1) { create(:flow, city: city) }
        let!(:flow2) { create(:flow, city: city) }

        before do
          allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
          allow_any_instance_of(FlowsController).to receive(:current_user).and_return(user)
        end

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data.length).to eq(2)
        end
      end

      response '200', 'sin flujos' do
        let(:user) { create(:user) }
        let(:country) { create(:country) }
        let(:city) { create(:city, country: country) }
        let(:city_id) { city.id }

        before do
          allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
          allow_any_instance_of(FlowsController).to receive(:current_user).and_return(user)
        end

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data).to eq([])
        end
      end
    end
  end

  path '/flows/by_country/{country_id}' do
    parameter name: :country_id, in: :path, type: :integer, required: true,
              description: 'ID del país', example: 1

    get 'Obtiene flujos asignados a un país' do
      tags 'Flows'
      produces 'application/json'
      security [Bearer: []]

      response '200', 'flujos encontrados' do
        let(:user) { create(:user) }
        let(:country) { create(:country) }
        let(:country_id) { country.id }
        let!(:flow1) { create(:flow, country: country) }
        let!(:flow2) { create(:flow, country: country) }

        before do
          allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
          allow_any_instance_of(FlowsController).to receive(:current_user).and_return(user)
        end

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data.length).to eq(2)
        end
      end

      response '200', 'sin flujos' do
        let(:user) { create(:user) }
        let(:country) { create(:country) }
        let(:country_id) { country.id }

        before do
          allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
          allow_any_instance_of(FlowsController).to receive(:current_user).and_return(user)
        end

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data).to eq([])
        end
      end
    end
  end
end
