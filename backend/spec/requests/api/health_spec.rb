require_relative "../../../swagger_helper"

RSpec.describe "Health API", swagger_doc: "v1/swagger.json" do
  path "/" do
    get "Health check del sistema" do
      tags "System"
      produces "application/json"

      response "200", "sistema funcionando" do
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data["status"]).to eq("ok")
          expect(data["timestamp"]).to be_present
        end
      end
    end
  end
end
