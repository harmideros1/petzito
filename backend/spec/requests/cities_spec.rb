require 'rails_helper'

RSpec.describe "Cities", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/cities/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/cities/show"
      expect(response).to have_http_status(:success)
    end
  end

end
