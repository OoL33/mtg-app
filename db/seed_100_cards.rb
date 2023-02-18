# To run this file : bundle exec rake db:seed
require 'mtg_sdk'
require 'pry'
require 'faraday'
require 'json'

# -----------------------------------------  FETCH FROM API ----------------------------

response = Faraday.get 'https://api.magicthegathering.io/v1/cards' 
response = response.body.to_s
cards = JSON.parse(response)['cards']

names = []
colors = []
image_urls = []
external_ids = []


for k in 0..cards.length-1 do
	if (cards[k].include? 'multiverseid')
		names.push(cards[k]['name'])
		colors.push(cards[k]['colors'][0])
		image_urls.push(cards[k]['imageUrl'])
		external_ids.push(cards[k]['id'])
	end
end

# -----------------------------------------  SEED DATABASE ----------------------------



# for k in 0..repo_list_items.length-1 do
# 	crawler = GitHubCrawler.find_or_initialize_by(name: name_array[k])
# 	crawler.description = description_array[k]
# 	binding.pry
# 	crawler.primary_language = programming_language_array[k]
# 	crawler.contributors = contributors_array[k]
# 	crawler.save!
# end


