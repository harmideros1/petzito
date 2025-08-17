Rswag::Ui.configure do |c|
  c.swagger_endpoint '/api-docs/v1/swagger.json', 'API V1 Docs'
  c.oauth2_redirect_url = '/oauth2-redirect'
  c.oauth2_client_id = 'your-client-id'
  c.oauth2_client_secret = 'your-client-secret'
end
