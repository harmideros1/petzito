RSpec.configure do |config|
  config.include Devise::Test::IntegrationHelpers, type: :request
  config.include Devise::Test::ControllerHelpers, type: :controller

  # Configuración para API con JWT
  config.before(:each, type: :request) do
    # Simular autenticación JWT
    allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_return(true)
    allow_any_instance_of(FlowsController).to receive(:current_user).and_return(create(:user))
  end

  # Para pruebas de autenticación, deshabilitar el mock
  config.before(:each, type: :request, authentication: :test) do
    allow_any_instance_of(FlowsController).to receive(:authenticate_user!).and_call_original
  end
end
