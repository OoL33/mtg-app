require 'pry'
class Api::V1::CardsController < ApiController
	def index
		cards = Card.all
		binding.pry
		render json: cards
	end

	def search
		cards = Card.where("name ILIKE ?", "%#{params['search_string']}%")
		render json: cards
	end

=begin
	def show
		binding.pry
		#cards = current_user.decks.cards
		cards = cards.find_by(card_params)
	end

	private

	def card_params
		params.require(:cards).permit(:id, :name, :colors, :image_urls, :external_ids)
	end
=end
end