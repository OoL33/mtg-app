class Api::V1::CardsController < ApiController
	before_action :authenticate_user!

	CLIENT = Faraday.new(url: 'https://api.scryfall.com')

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

		response = CLIENT.get('cards/search') do |req|
			req.params['q'] = search_string if search_string.present?
		end
		json_response = JSON.parse(response.body)
		api_cards = json_response['data']

		if api_cards.present?
			# Get the external IDs for all cards returned by the API
			api_card_ids = api_cards.map { |card| card['multiverse_ids'] }.flatten.uniq

			# Query the database for existing cards with matching external IDs
			existing_cards = Card.where("external_ids && ARRAY[?]::integer[]", api_card_ids)

			# Create new cards for any API cards that don't already exist in the database
			new_cards = api_cards.reject { |card| existing_cards.any? { |existing_card| existing_card.external_ids.include?(card['multiverse_ids']) } }.map do |card|
				Card.create(name: card['name'], colors: card['colors'], image_urls: card['image_uris']['border_crop'], external_ids: card['multiverse_ids'])
			end

			# Combine existing and new cards
			cards = existing_cards + new_cards

			filtered_cards = filter_cards(cards, params)

			max_cards = 5

			cards = cards.first(max_cards)

			render json: cards, each_serializer: CardSerializer
		else
			render json: { error: 'No cards found' }, status: :not_found
		end
	end

	# def create
	# 	binding.pry
	# 	deck = Deck.find_by(id: params[:deck_id])
	# 	#card = Card.find_by(external_ids: params[:card][:external_ids])
	# 	card = Card.where("external_ids && ARRAY[?]::integer[]", params[:card][:external_ids].map(&:to_i)).first
	# 	# Parse external_ids as an array of integers
	# 	#binding.pry
	# 	#external_ids = params[:card][:external_ids].map(&:to_i)
	# 	#binding.pry

	# 	#associated_cards = deck.cards.select { |obj| obj.id == card.id }

	# 	if card.nil?
	# 		# Create a new card if it doesn't exist
	# 		#card = Card.create(card_params)
	# 		card = Card.create(card_params.merge(external_ids: params[:card][:external_ids]))
	# 	end
	# 	binding.pry

	# 	# Check if the card is already associated with the deck
	# 	if deck.cards.includes?(card)
	# 		render json: { error: 'Card already associated with the deck' }, status: :unprocessable_entity
	# 		#puts "\n\n card under id : #{card.id} is already associated with deck under id : #{deck.id} \n\n"
	# 	else
	# 		deck.cards << card
	# 		deck.save
	# 		render json: deck, status: :created
	# 	end
	# end	

	def create
		deck = Deck.find_by(id: params[:deck_id])
		binding.pry
		# cards = Card.where("external_ids && ARRAY[?]::integer[]", params[:card][:external_ids].map(&:to_i))
		# binding.pry
		if params[:card][:external_ids].present? # Add this conditional check
			external_ids = params[:card][:external_ids].map(&:to_i)
			cards = Card.where("external_ids && ARRAY[?]::integer[]", external_ids)
		else
			cards = []
		end

		# Set api_cards variable by calling external API based on card name
		search_string = params[:card][:name]
		response = CLIENT.get('cards/search') do |req|
			req.params['q'] = search_string if search_string.present?
		end
		json_response = JSON.parse(response.body)
		api_cards = json_response['data']
	
		if cards.empty?
			# Create a new card if it doesn't exist
			card = Card.create(card_params.merge(external_ids: params[:card][:external_ids]))
		else
			# Search for card by name
			card = cards.find { |c| c.name == params[:card][:name] }
			if card.nil?
				# Create a new card if card with the given name doesn't exist
				card = Card.create(card_params.merge(external_ids: params[:card][:external_ids], name: params[:card][:name]))
			end
		end
	
		# Check if the card is already associated with the deck
		if deck.cards.include?(card)
			render json: { error: 'Card already associated with the deck' }, status: :unprocessable_entity
		else
			deck.cards << card
			deck.save
			render json: deck, status: :created
		end
	end
	

	def show
		deck = Deck.find( params[:deck_id])
		cards_in_deck = deck.cards
		render json: cards_in_deck, each_serializer: CardSerializer
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
		params.require(:card).permit(:name, :colors, :image_urls, external_ids: [])
	end

	def filter_cards(cards, params)
		cards = cards.filter { |card| card.name.include?(params[:name]) } if params[:name].present?
		cards = cards.filter { |card| card.colors.include?(params[:color]) } if params[:color].present?
		cards = cards.filter { |card| card.image_urls.include?(params[:image_uris][:border_crop]) } if params[:image_uris].present?
		cards
	end
end