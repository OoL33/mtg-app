class Api::V1::UsersController < ApiController
	before_action :authenticate_user!

	def index
		users = User.all
		render json: { users: users }
	end
end