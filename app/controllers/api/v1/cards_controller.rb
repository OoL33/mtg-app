require 'pry'
class Api::V1::CardsController < ApiController
	def index
		cards = Card.all
		render json: cards
	end

	def search
		response = Faraday.get 'https://api.magicthegathering.io/v1/cards' 
		#set_data = MTG::Set.where('bro').where(page: 1)
		search_response = JSON.parse(response.body)
		#binding.pry

		search_string = params[:search_string]
		cards = Card.where("name ILIKE ?", "%#{params['search_string']}%")
		render json: cards
	end

	def create
		deck = Deck.find_by(id: params[:deck_id])
		card = Card.find_or_create_by(card_params)

		associated_cards = deck.cards.select { |obj| obj.id == card.id }

		if(associated_cards.length > 0)
			puts "\n\n card under id : #{card.id} is already associated with deck under id : #{deck.id} \n\n"
		else
			deck.cards << card
			redirect_to :books_path, notice: "Card added to deck"
		end
		render json: { card: card }
	end

	def show
		render json: { card: card }
	end

	def update
		# if cards.update(card_params)
		# 	render json: { cards: cards }
		# else
		# 	render json: { error: deck.errors.full_messages }, status: :unprocessable_entity
		# end
	end

	private

	def card_params
		params.require(:card).permit(:id, :name, :colors, :image_urls, :external_ids)
		#params.require(:cards).permit(:id, :deck_id)
	end
end