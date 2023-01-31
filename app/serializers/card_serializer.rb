class CardSerializer < ActiveModel::Serializer
  attributes :id, :name, :image_urls, :external_ids
end
