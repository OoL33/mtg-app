class Card < ApplicationRecord
	paginates_per 100
	
	validates :name, presence: true
	validates :colors, presence: true
	validates :image_urls, presence: true 
	validates :external_ids, presence: true

	has_many :deck_cards
	has_many :decks, through: :deck_cards
end