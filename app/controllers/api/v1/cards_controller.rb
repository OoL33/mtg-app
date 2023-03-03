class Api::V1::CardsController < ApiController
	before_action :authenticate_user!

	def index
		if params[:deck_id]
			deck = Deck.find(params[:deck_id])
			cards = deck.cards
		else
			cards = Card.all
		end
		render json: cards
	end

	def search
		response = Faraday.get 'https://api.magicthegathering.io/v1/cards' 
		search_response = JSON.parse(response.body)

		search_string = params[:search_string]
		cards = Card.where("name ILIKE ?", "%#{params['search_string']}%")
		render json: cards
	end

	def create
		deck = Deck.find_by(id: params[:deck_id])
		card = Card.find_or_create_by(card_params)

		associated_cards = deck.cards.select { |obj| obj.id == card.id }
		binding.pry

		if(associated_cards.length > 0)
			puts "\n\n card under id : #{card.id} is already associated with deck under id : #{deck.id} \n\n"
		else
			deck.cards << card
		end
	end

	def show
		deck = Deck.find(id: params[:deck_id])
		cardsInDeck = deck.cards
		render json: cardsInDeck
	end

	private

	def card_params
		params.require(:card).permit(:id, :name, :colors, :image_urls, :external_ids)
	end
end