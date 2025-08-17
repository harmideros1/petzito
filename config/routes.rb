Rails.application.routes.draw do
  devise_for :users

  # Rutas para Flows
  resources :flows, only: [:create, :show, :update, :destroy]

  # Rutas personalizadas para Flows
  get 'flows/by_name/:name', to: 'flows#by_name'
  get 'flows/by_city/:city_id', to: 'flows#by_city'
  get 'flows/by_country/:country_id', to: 'flows#by_country'

  # Rutas para documentación de la API
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'

  # Ruta raíz
  root to: 'application#health'
end
