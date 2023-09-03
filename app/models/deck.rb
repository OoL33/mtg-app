class Deck < ApplicationRecord
	validates :name, presence: true
	
	belongs_to :user
	has_many :deck_cards
	has_many :cards, through: :deck_cards, dependent: :destroy
end