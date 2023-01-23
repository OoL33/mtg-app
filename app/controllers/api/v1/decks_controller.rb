require 'pry'
class Api::V1::DecksController < ApiController
	before_action :authenticate_user!

	def index
		decks = Deck.all
		render json: decks

		#user has many decks
		#current_user.decks
		#user = current_user.decks
	end

	def show
		decks = current_user.decks
		deck = decks.find_by(id: params[:id])
		render json: { deck: deck }
	end

	def create
		current_decks = current_user.decks
		deck = Deck.new(name: deck_params[:name])
		deck.description = deck_params[:description]
		deck.user_id = current_user.id

		if deck.save!
			render json: { deck: deck }, each_serializer: DeckSerializer
		else
			render json: { error: deck.errors.full_messages }, status: :unprocessable_entity
		end
	end
	

	def update
		#current_user = current_user.find(:id)
		#deck = Deck.find_by(deck_params)
		decks = current_user.decks
		deck = decks.find_by(id: params[:id])

		if deck.update(deck_params)
			render json: { deck: deck }, each_serializer: DeckSerializer
		else
			render json: { error: deck.errors.full_messages }, status: :unprocessable_entity
		end
	end

=begin
	def destroy
		#current_user = current_user.find(:id)
		deck = Deck.find_by(params[:id])

		if deck.destroy
			head :no_content
		else
			render json: { error: deck.errors.full_messages }, status: :unprocessable_entity
		end
	end
=end

	private

	def authenticate_user
		if !user_signed_in?
			render json: { error: ["You need to be signed in first"] }
		end
	end

	def deck_params
		params.require(:decks).permit(:id, :name, :description, :user_id)
	end
end