class Api::V1::CardsController < ApiController
	def index
		cards = Card.all
		render json: cards
	end

	def search
		search_string = params[:search_string]
		cards = Card.where("name ILIKE ?", "%#{params['search_string']}%")
		render json: cards
	end

	def show
		#cards = cards.find_by(card_params)
		#cards = cards.find_by(params[:card_params])
		render json: { cards: cards }
	end

	private

	#def card_params
	#	params.require(:cards).permit(:id, :name, :colors, :image_urls, :external_ids)
	#end
end