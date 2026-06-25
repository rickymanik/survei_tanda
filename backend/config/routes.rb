Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "/", to: "health#show"
      get "/health", to: "health#show"

      post "/login", to: "sessions#create"
      post "/register", to: "users#create"

      resources :users, only: [:index, :show, :create, :update] do
        patch :password, on: :member
      end
      resources :surveys do
        resources :responses, only: [:index, :create]
      end
      resources :responses, only: [:index]
      resources :rewards, only: [:index, :show, :create]
      resources :redemptions, only: [:index, :create, :show]
      resources :point_transactions, only: [:index]
    end
  end
end
