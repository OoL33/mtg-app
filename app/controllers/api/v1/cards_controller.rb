
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

		client = Faraday.new('https://api.scryfall.com/cards/search')

		response = client.get do |req|
			req.params['q'] = search_string if search_string.present?
		end
		json_response = JSON.parse(response.body)

		cards = json_response['data'].map do |card|
			Card.find_or_create_by(external_ids: card['multiverse_ids']) do |c|
				c.name = card['name']
				c.colors = card['colors']
				c.image_urls = card['image_uris']['normal']
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

		associated_cards = deck.cards.select { |obj| obj.id == card.id }

		if(associated_cards.length > 0)
			puts "\n\n card under id : #{card.id} is already associated with deck under id : #{deck.id} \n\n"
		else
			render json: { error: response.status }, status: response.status
		end
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
		params.require(:card).permit(:id, :name, :colors, :image_urls, :external_ids)
	end

	def filter_cards(cards, params)
		cards = cards.filter { |card| card.name.include?(params[:name]) } if params[:name].present?
		cards = cards.filter { |card| card.colors.include?(params[:color]) } if params[:color].present?
		cards
	end
end