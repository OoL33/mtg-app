class UserSerializer < ActiveModel::Serializer
	attributes :id, :email, :decks

	has_many :decks
end