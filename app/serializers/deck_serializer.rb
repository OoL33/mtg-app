class DeckSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :user_id, :cards

	belongs_to :user
end
