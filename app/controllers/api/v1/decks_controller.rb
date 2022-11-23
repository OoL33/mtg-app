class Api::V1::DecksController < ApiController
	def index
		render json: Deck.order(name: :asc)
	end

	def show
		render json: Deck.find(params[:id])
	end

	def create
		deck = Deck.new(deck_params)
		deck.user = current_user

		if deck.save
			render json: { deck: deck }
		else
			render json: { error: deck.errors.full_messages }, status: :unprocessable_entity
		end
	end

	private

	def deck_params
		params.require(:deck).permit(:name, :description)
	end
end