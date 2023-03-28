class Api::V1::CardsController < ApiController
	before_action :authenticate_user!

	CLIENT = Faraday.new('https://api.magicthegathering.io/v1/cards')

	def index
		if params[:deck_id]
			deck = Deck.find(params[:deck_id])
			cards = deck.cards
		else
			cards = Card.all
		end
		render json: cards, each_serializer: CardSerializer
	end

	def search
		search_string = params[:search_string]

		client = Faraday.new('https://api.scryfall.com/cards/search')

		response = client.get do |req|
			req.params['q'] = search_string if search_string.present?
		end
		json_response = JSON.parse(response.body)

		cards = json_response['data'].map do |card|
			Card.find_or_create_by(external_ids: card['multiverse_ids']) do |c|
				c.name = card['name']
				c.colors = card['colors']
				c.image_urls = card['image_uris']['normal'] if card['image_uris'].present?
			end
		end

		filtered_cards = filter_cards(cards, params)

		max_cards = 5

		cards = cards.first(max_cards)

		render json: cards.as_json
	end

	def create
		deck = Deck.find_by(id: params[:deck_id])
		card = Card.find_or_create_by(card_params)

		#associated_cards = deck.cards.select { |obj| obj.id == card.id }

		if deck.cards.include?(card)
			puts "\n\n card under id : #{card.id} is already associated with deck under id : #{deck.id} \n\n"
		else
			deck.cards << card
			deck.save
			render json: deck, status: :created
		end
	end	

	def show
		deck = Deck.find( params[:deck_id])
		cardsInDeck = deck.cards
		render json: cardsInDeck, each_serializer: CardSerializer
	end

	def update
		deck = Deck.find(params[:deck_id])
		card = Card.find_or_create_by(card_params)
		unless deck.cards.include?(card)
			deck.cards << card
		end
	end

	private

	def card_params
		params.require(:card).permit(:id, :name, :colors, :image_urls, :external_ids)
	end

	def filter_cards(cards, params)
		cards = cards.filter { |card| card.name.include?(params[:name]) } if params[:name].present?
		cards = cards.filter { |card| card.colors.include?(params[:color]) } if params[:color].present?
		#cards = cards.filter { |card| card.image_urls.include?(params[:image_uris][:normal]) } if params[:image_uris].present?
		cards
	end
end