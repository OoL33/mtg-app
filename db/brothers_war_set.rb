=begin
require 'mtg_sdk'
require 'pry'
require 'faraday'
require 'json'

response = Faraday.get 'https://api.magicthegathering.io/v1/sets' 
set_data = MTG::Set.find('bro')

set_data.each do |data|
	card = Card.create!(
		card_id: data.id
		name: data.name.downcase,
		colors: data.colors,
		image_urls: data.image_urls,
		external_ids: data.external_ids
	)
end

https://api.magicthegathering.io/v1/cards?set=bro&page=1&page_size=100

=end