class Api::V1::CardsController < ApiController

	before_action :authenticate_user!

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
    # Delegate the Scryfall API querying and database interaction to ApiCardsController
    api_cards_controller = Api::V1::ApiCardsController.new
    api_cards_controller.search(params, filter_cards_method)
  end

	def create
		deck = Deck.find_by(id: params[:deck_id])
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
