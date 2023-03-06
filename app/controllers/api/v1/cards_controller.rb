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
		search_string = params[:search_string]

		client = Faraday.new('https://api.magicthegathering.io/v1/cards')
		
		cards = []
		page = 1
		per_page = 100
		response = client.get do |req|
			req.params['page'] = page
			req.params['per_page'] = per_page
			req.params['name'] = search_string if search_string.present?
			req.params['colors'] = search_string if search_string.present?
			req.params['multiverseid'] = 'is:numeric'
		end
		json_response = JSON.parse(response.body)
		cards = json_response['cards'].select { |card| card['multiverseid'].present? }

		cards = cards.map do |card|
			{
				name: card['name'],
				colors: card['colors'],
				image_url: card['imageUrl'],
				external_ids: card['multiverseid']
			}
		end

		max_cards = 5
		cards_retrieved = 0

		while cards.length == per_page && cards_retrieved < max_cards
			page += 1
			response = client.get do |req|
				req.params['page'] = page
				req.params['per_page'] = per_page
			end

			json_response = JSON.parse(response.body)
			
			new_cards = json_response['cards'].select { |card| card['multiverseid'].present? }

			cards += new_cards.map do |card|
				{
					name: card['name'],
					colors: card['colors'],
					image_url: card['imageUrl'],
					external_ids: card['multiverseid']
				}
			end
			cards_retrieved = cards.length
		end

		render json: cards, each_serializer: CardSerializer
	end

	def create
		deck = Deck.find_by(id: params[:deck_id])
		card = Card.find_or_create_by(card_params)

		associated_cards = deck.cards.select { |obj| obj.id == card.id }

		if(associated_cards.length > 0)
			puts "\n\n card under id : #{card.id} is already associated with deck under id : #{deck.id} \n\n"
		else
			deck.cards << card
		end
	end

	def show
		deck = Deck.find(id: params[:deck_id])
		cardsInDeck = deck.cards
		render json: cardsInDeck, each_serializer: CardSerializer
	end

	private

	def card_params
		params.require(:card).permit(:id, :name, :colors, :image_urls, :external_ids)
	end
end