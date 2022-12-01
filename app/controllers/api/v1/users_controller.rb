class Api::V1::UsersController < ApiController
	before_action :authenticate_user!

	def index
		users = User.all
		render json: { users: users }
	end

	def current
		render json: current_user
	end

	def show
		render json: current_user
	end
end