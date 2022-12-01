class Api::V1::DecksController < ApiController
	before_action :authenticate_user!

	def index
		decks = Deck.all
		render json: { decks: decks }

		#user has many decks
		#current_user.decks
		user = current_user.decks
	end

	def show
		decks = current_user.decks
		render json: { decks: decks }
	end

	def create
		#current_user = current_user.find(:id)
		deck = current_user.decks.new(deck_params)

		if deck.save
			render json: { deck: deck }, serializer: DeckSerializer
		else
			render json: { error: deck.errors.full_messages }, status: :unprocessable_entity
		end
	end

=begin 	def update
		#current_user = current_user.find(:id)
		deck = Deck.find_by(deck_params)

		if deck.update(deck_params)
			render json: { deck: deck }, serializer: DeckSerializer
		else
			render json: { error: deck.errors.full_messages }, status: :unprocessable_entity
		end
	end

	def destroy
		#current_user = current_user.find(:id)
		deck = Deck.find_by(params[:id])

		if deck.destroy
			head :no_content
		else
			render json: { error: deck.errors.full_messages }, status: :unprocessable_entity
		end
	end
=end

	private

	def authenticate_user
		if !user_signed_in?
			render json: { error: ["You need to be signed in first"] }
		end
	end

	def deck_params
		params.require(:deck).permit(:name, :description, :user_id)
	end
end