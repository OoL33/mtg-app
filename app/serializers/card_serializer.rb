class CardSerializer < ActiveModel::Serializer
  attributes :id, :name, :colors, :image_urls, :external_ids

	def root		
		'card'
	end
end
