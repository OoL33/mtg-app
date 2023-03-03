Rails.application.routes.draw do
  root 'homes#index'
  devise_for :users 
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
	get '/users/:id', to: 'homes#authenticated'
	get 'decks/new', to: 'homes#authenticated'
	get 'decks/:id', to: 'homes#authenticated'
	get 'cards/search', to: 'homes#authenticated'

	namespace :api do
		namespace :v1 do
			get '/users/current', to: 'users#current'
			post 'cards/search', to: 'cards#search'
			resources :users, only: [:index, :show]
				resources :decks, only: [:index, :show, :create, :update, :destroy] do
					resources :cards, only: [:index, :show, :search, :create]
				end
		end
	end
end
