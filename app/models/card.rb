class Card < ApplicationRecord	
	validates :name, presence: true
	validates :colors, presence: true
	validates :image_urls, presence: true 

	validate :external_ids_array

	has_many :deck_cards
	has_many :decks, through: :deck_cards

	# Custom validation method for external_ids field
	def external_ids_array
		unless external_ids.is_a?(Array)
			errors.add(:external_ids, "must be an array")
		end
	end

	# # Optional: Define getter and setter methods for external_ids field
	# def external_ids
	# 	super || [] # Return an empty array if external_ids is nil
	# end

	def external_ids=(value)
		value = Array(value).reject(&:blank?).map(&:to_i) # Convert to array of integers
		super(value)
	end
end