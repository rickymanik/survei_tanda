Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "/login", to: "sessions#create"
      post "/register", to: "users#create"

      resources :users, only: [:index, :show, :create, :update]
      resources :surveys do
        resources :responses, only: [:index, :create]
      end
      resources :rewards, only: [:index, :show]
      resources :redemptions, only: [:index, :create, :show]
      resources :point_transactions, only: [:index]
    end
  end
end
