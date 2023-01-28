class HomesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]

	def index
  end

	def authenticated
		current_user = current_user
	end
end
