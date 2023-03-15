require 'pry'
class Api::V1::CardsController < ApiController
	before_action :authenticate_user!

	CLIENT = Faraday.new('https://api.magicthegathering.io/v1/cards')

	def index
		if params[:deck_id]
			deck = Deck.find(params[:deck_id])
			cards = deck.cards.page(params[:page])
		else
			cards = Card.all.page(params[:page])
		end
		render json: cards
	end

	def search
		binding.pry
		search_string = params[:search_string]

		response = CLIENT.get do |req|
			req.params['name'] = search_string if search_string.present?
			req.params['colors'] = search_string if search_string.present?
			req.params['multiverseid'] = 'is:numeric'
		end
	
		if response.success?
			json_response = JSON.parse(response.body)
			cards = json_response['cards'].filter { |card| card['multiverseid'].present? }
	
			# limit cards to 5
			cards = cards[0..4]
	
			render json: cards.map { |card| build_card(card) }, each_serializer: CardSerializer, root: 'cards'
		else
			render json: { error: response.status }, status: response.status
		end
	# rescue Faraday::ConnectionFailed => e
	# 	render json: { error: e.message }, status: :internal_server_error
	end	

	# def create
	# 	deck = Deck.find_by(id: params[:deck_id])
	# 	card = Card.find_or_create_by(card_params)

	# 	associated_cards = deck.cards.select { |obj| obj.id == card.id }

	# 	if(associated_cards.length > 0)
	# 		puts "\n\n card under id : #{card.id} is already associated with deck under id : #{deck.id} \n\n"
	# 	else
	# 		deck.cards << card
	# 	end
	# end

	def show
		deck = Deck.find(id: params[:deck_id])
		cardsInDeck = deck.cards
		render json: cardsInDeck, each_serializer: CardSerializer
	end

	private

	def build_card(card)
    {
      name: card['name'],
      colors: card['colors'],
      image_url: card['imageUrl'],
      external_ids: card['multiverseid'].split(',').map(&:to_i)
    }
  end

	def card_params
		if params[:card].present?
			params.require(:card).permit(:id, :name, :colors, :image_urls, :external_ids)
		else
			{}
		end
	end
end