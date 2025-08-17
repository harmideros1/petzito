require 'rails_helper'

RSpec.describe "Flows", type: :request do
  let(:user) { create(:user) }
  let(:country) { create(:country) }
  let(:city) { create(:city, country: country) }
  let(:valid_flow_params) do
    {
      flow: {
        name: "TestFlow",
        json_schema: {
          "sections" => [
            {
              "id" => "section1",
              "title" => "Sección 1",
              "forms" => [
                {
                  "id" => "form1",
                  "fields" => [
                    {
                      "id" => "field1",
                      "type" => "text",
                      "label" => "Campo 1"
                    }
                  ]
                }
              ]
            }
          ]
        }.to_json,
        city_id: city.id
      }
    }
  end

  before do
    sign_in user
  end

  describe "POST /flows" do
    context "con parámetros válidos" do
      it "crea un nuevo flujo" do
        expect {
          post flows_path, params: valid_flow_params
        }.to change(Flow, :count).by(1)

        expect(response).to have_http_status(:created)
        expect(json_response['name']).to eq("TestFlow")
      end
    end

    context "con parámetros inválidos" do
      it "rechaza flujo sin nombre" do
        invalid_params = valid_flow_params.deep_dup
        invalid_params[:flow][:name] = ""

        post flows_path, params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include("Name can't be blank")
      end

      it "rechaza flujo sin ubicación" do
        invalid_params = valid_flow_params.deep_dup
        invalid_params[:flow][:city_id] = nil

        post flows_path, params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include("Debe asignar al menos una ciudad o país")
      end

      it "rechaza flujo con JSON inválido" do
        invalid_params = valid_flow_params.deep_dup
        invalid_params[:flow][:json_schema] = { "invalid" => "structure" }.to_json

        post flows_path, params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors'].any? { |e| e.include?("JSON debe contener al menos una sección") }).to be true
      end
    end
  end

  describe "GET /flows/:id" do
    let(:flow) { create(:flow, :with_city) }

    it "retorna el flujo solicitado" do
      get flow_path(flow)

      expect(response).to have_http_status(:ok)
      expect(json_response['id']).to eq(flow.id)
      expect(json_response['name']).to eq(flow.name)
    end

    it "retorna 404 para flujo inexistente" do
      get flow_path("invalid-uuid")

      expect(response).to have_http_status(:not_found)
      expect(json_response['error']).to eq("Recurso no encontrado")
    end
  end

  describe "PUT /flows/:id" do
    let(:flow) { create(:flow, :with_city) }

    context "con parámetros válidos" do
      it "actualiza el flujo" do
        update_params = {
          flow: {
            name: "UpdatedFlow",
            json_schema: flow.json_schema
          }
        }

        put flow_path(flow), params: update_params

        expect(response).to have_http_status(:ok)
        expect(json_response['name']).to eq("UpdatedFlow")
        expect(flow.reload.name).to eq("UpdatedFlow")
      end
    end

    context "con parámetros inválidos" do
      it "rechaza actualización con nombre inválido" do
        update_params = {
          flow: {
            name: "Invalid Flow Name",
            json_schema: flow.json_schema
          }
        }

        put flow_path(flow), params: update_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to include("Name debe contener solo letras y números, máximo 64 caracteres")
      end
    end
  end

  describe "DELETE /flows/:id" do
    let!(:flow) { create(:flow, :with_city) }

    it "elimina el flujo" do
      expect {
        delete flow_path(flow)
      }.to change(Flow, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end

  describe "GET /flows/by_name/:name" do
    let!(:flow) { create(:flow, :with_city, name: "UniqueFlow") }

    it "retorna el flujo por nombre" do
      get "/flows/by_name/UniqueFlow"

      expect(response).to have_http_status(:ok)
      expect(json_response['id']).to eq(flow.id)
      expect(json_response['name']).to eq("UniqueFlow")
    end

    it "retorna 404 para nombre inexistente" do
      get "/flows/by_name/NonExistentFlow"

      expect(response).to have_http_status(:not_found)
      expect(json_response['error']).to eq("Recurso no encontrado")
    end
  end

  describe "GET /flows/by_city/:city_id" do
    let!(:flow1) { create(:flow, city: city) }
    let!(:flow2) { create(:flow, city: city) }
    let!(:other_city) { create(:city, country: country) }
    let!(:flow3) { create(:flow, city: other_city) }

    it "retorna flujos de la ciudad especificada" do
      get "/flows/by_city/#{city.id}"

      expect(response).to have_http_status(:ok)
      expect(json_response.length).to eq(2)
      expect(json_response.map { |f| f['id'] }).to include(flow1.id, flow2.id)
      expect(json_response.map { |f| f['id'] }).not_to include(flow3.id)
    end
  end

  describe "GET /flows/by_country/:country_id" do
    let!(:flow1) { create(:flow, country: country) }
    let!(:flow2) { create(:flow, country: country) }
    let!(:other_country) { create(:country) }
    let!(:flow3) { create(:flow, country: other_country) }

    it "retorna flujos del país especificado" do
      get "/flows/by_country/#{country.id}"

      expect(response).to have_http_status(:ok)
      expect(json_response.length).to eq(2)
      expect(json_response.map { |f| f['id'] }).to include(flow1.id, flow2.id)
      expect(json_response.map { |f| f['id'] }).not_to include(flow3.id)
    end
  end

  describe "autenticación" do
    it "tiene before_action para autenticación" do
      expect(FlowsController._process_action_callbacks.map(&:filter)).to include(:authenticate_user!)
    end
  end

  private

  def json_response
    JSON.parse(response.body)
  end
end
