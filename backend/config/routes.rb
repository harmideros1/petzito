Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  devise_for :users

  # Rutas para Flows
  resources :flows, only: [:index, :create, :show, :update, :destroy]

  # Rutas personalizadas para Flows
  get 'flows/by_name/:name', to: 'flows#by_name'
  get 'flows/by_city/:city_id', to: 'flows#by_city'
  get 'flows/by_country/:country_id', to: 'flows#by_country'

  # Rutas para Countries y Cities
  resources :countries, only: [:index, :show]
  resources :cities, only: [:index, :show]

  # Ruta raíz
  root to: 'application#health'
end
