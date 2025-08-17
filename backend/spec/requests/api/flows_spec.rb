require_relative "../../../swagger_helper"

RSpec.describe "Flows API", swagger_doc: "v1/swagger.json" do
  path "/flows" do
    post "Crea un nuevo flujo" do
      tags "Flows"
      consumes "application/json"
      produces "application/json"
      security [Bearer: []]
      
      parameter name: :flow, in: :body, schema: {
        type: :object,
        properties: {
          flow: {
            type: :object,
            properties: {
              name: { type: :string, example: "EncuestaCliente" },
              json_schema: { type: :object },
              city_id: { type: :integer, nullable: true },
              country_id: { type: :integer, nullable: true }
            },
            required: [:name, :json_schema]
          }
        }
      }

      response "201", "flujo creado" do
        let(:user) { create(:user) }
        let(:city) { create(:city) }
        let(:flow_params) do
          {
            flow: {
              name: "TestFlow",
              json_schema: {
                sections: [
                  {
                    id: "section1",
                    title: "Sección 1",
                    forms: [
                      {
                        id: "form1",
                        fields: [
                          {
                            id: "field1",
                            type: "text",
                            label: "Campo 1"
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

        run_test!
      end
    end
  end
end
