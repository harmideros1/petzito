require 'swagger_helper'

RSpec.describe 'Authentication API', swagger_doc: 'v1/swagger.json' do
  path '/users/sign_up' do
    post 'Registra un nuevo usuario' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              email: { type: :string, format: :email, example: 'user@example.com' },
              password: { type: :string, example: 'password123', minLength: 6 },
              password_confirmation: { type: :string, example: 'password123', minLength: 6 }
            },
            required: [:email, :password, :password_confirmation]
          }
        }
      }

      response '200', 'usuario registrado exitosamente' do
        let(:user_params) do
          {
            user: {
              email: 'newuser@example.com',
              password: 'password123',
              password_confirmation: 'password123'
            }
          }
        end

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['user']['email']).to eq('newuser@example.com')
        end
      end

      response '422', 'parámetros inválidos' do
        let(:user_params) do
          {
            user: {
              email: 'invalid-email',
              password: '123',
              password_confirmation: '456'
            }
          }
        end

        run_test!
      end
    end
  end

  path '/users/sign_in' do
    post 'Inicia sesión de usuario' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              email: { type: :string, format: :email, example: 'user@example.com' },
              password: { type: :string, example: 'password123' }
            },
            required: [:email, :password]
          }
        }
      }

      response '200', 'sesión iniciada exitosamente' do
        let(:user) { create(:user) }
        let(:user_params) do
          {
            user: {
              email: user.email,
              password: 'password123'
            }
          }
        end

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['user']['email']).to eq(user.email)
        end
      end

      response '401', 'credenciales inválidas' do
        let(:user_params) do
          {
            user: {
              email: 'user@example.com',
              password: 'wrongpassword'
            }
          }
        end

        run_test!
      end
    end
  end

  path '/users/sign_out' do
    delete 'Cierra sesión de usuario' do
      tags 'Authentication'
      security [Bearer: []]

      response '200', 'sesión cerrada exitosamente' do
        let(:user) { create(:user) }
        let(:Authorization) { "Bearer #{generate_jwt_token(user)}" }

        run_test!
      end

      response '401', 'no autorizado' do
        let(:Authorization) { 'Bearer invalid-token' }
        run_test!
      end
    end
  end

  path '/' do
    get 'Health check del sistema' do
      tags 'System'
      produces 'application/json'

      response '200', 'sistema funcionando' do
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['status']).to eq('ok')
          expect(data['timestamp']).to be_present
        end
      end
    end
  end

  private

  def generate_jwt_token(user)
    # Simulación de token JWT para las pruebas
    "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2MzQ1Njc4MDB9.example"
  end
end
