Rails.application.routes.draw do
  root 'homes#index'
  devise_for :users 
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
	# get '/decks', to: 'homes#authenticated'
	get '/users/:id', to: 'homes#authenticated'
	get '/users/:user_id/decks/new', to: 'homes#authenticated'
	get '/users/:user_id/decks/:id', to: 'decks#show'


	# user dashboard
	# users/1
	# user show
	# API fetch request - `/api/v1/users/current` not the show route with /api/v1/users/:id - with API requests this /current path will conflict with show routes (need to handle by order - the /current path is listed here first before show)
	# create def current method action in api users controller
	# render json current user
	# custom paths before dynamic paths (:id)
	namespace :api do
		namespace :v1 do
			#resources :users, only: [:index] do
				#resources :decks, only: [:show, :create]
			#end
			get "/users/current", to: "users#current"
			resources :users, only: [:index, :show]
				resources :decks, only: [:index, :show, :create]
		end
	end

	get '*path', to: 'homes#index', via: :all 
end
