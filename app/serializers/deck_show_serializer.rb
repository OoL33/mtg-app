class DeckShowSerializer < ActiveModel::Serializer
	attributes :id, :name, :description, :current_user

	has_many :cards
end