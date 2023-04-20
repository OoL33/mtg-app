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

  def create
    deck = Deck.find_by(id: params[:deck_id])
    card = find_or_create_card(deck)
  
    if card.persisted?
      deck.cards << card
      deck.save
      render json: deck, status: :created
    else
      render json: { error: card.errors.full_messages }, status: :unprocessable_entity
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

  def find_or_create_card(deck)
    return Card.new(card_params.merge(external_ids: params[:card][:external_ids])) unless params[:card].present?

    external_ids = params[:card][:external_ids].map(&:to_i)
    cards = Card.where("external_ids && ARRAY[?]::integer[]", external_ids)
    search_name = params[:card][:name]

    return cards.find { |c| c.name == search_name } if search_name.present? && cards.present?

    api_cards = Api::V1::ApiCardService.new.search(params)['data']
    
    if api_cards.present?
      Card.new(
        name: api_cards[0]['name'],
        colors: api_cards[0]['colors'],
        image_urls: api_cards[0]['image_uris'],
        external_ids: external_ids
      )
    else
      Card.new
    end
  end
end
