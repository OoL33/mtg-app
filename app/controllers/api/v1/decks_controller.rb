class Api::V1::DecksController < ApiController
	before_action :authenticate_user!

	def index
		render json: current_user.decks
	end

	def show
		deck = Deck.find(params[:id])
    cards = deck.cards
    render json: { deck: deck, cards: cards }, each_serializer: DeckSerializer
	end

	def create
		current_decks = current_user.decks
		decks = Deck.new(name: deck_params[:name])
		deck.description = deck_params[:description]
		deck.user_id = current_user.id

		if decks.save!
			render json: { decks: decks }
		else
			render json: { error: decks.errors.full_messages }, status: :unprocessable_entity
		end
	end

	def update
		decks = current_user.decks
		deck = decks.find_by(id: params[:id])

		if deck.update(deck_params)
			render json: { deck: deck }, each_serializer: DeckSerializer
		else
			render json: { error: deck.errors.full_messages }, status: :unprocessable_entity
		end
	end

	def destroy
		decks = current_user.decks
		deck = decks.find_by(id: params[:id])

		if deck.destroy
			render json: {}
		else
			render json: { error: deck.errors.full_messages }, status: :unprocessable_entity
		end
	end

	private

	def authenticate_user
		if !user_signed_in?
			render json: { error: ["You need to be signed in first"] }
		end
	end

	def deck_params
		params.require(:decks).permit(:id, :name, :description, :user_id)
	end
end