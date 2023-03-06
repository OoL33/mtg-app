class DeckSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :user_id

	belongs_to :user
	has_many :cards, serializer: CardSerializer
end
