class Api::V1::CardsController < ApiController
	def index
		cards = Card.all
		render json: cards
	end
end