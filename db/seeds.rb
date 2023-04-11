# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
alana = User.create(email: "arcanevirgo@magicdeck.com", password: "secretlair")
bk = User.create(email: "trashhunter@nightgremlins.com", password: "donutcounty")

deck_one = Deck.create(user_id: 1, name: "green deck", description: "only green cards")
bk_deck = Deck.create(user_id: 2, name: "Creature Build", description: "full of rats")
bk_deck_two = Deck.create(user_id: 2, name: "Undead", description: "dark magic")

# To run this file : bundle exec rake db:seed

# -----------------------------------------  FETCH FROM API ----------------------------

# response = Faraday.get 'https://api.magicthegathering.io/v1/cards' 
# response = response.body.to_s
# cards = JSON.parse(response)['cards']

# names = []
# colors = []
# image_urls = []
# external_ids = []



# for k in 0..cards.length-1 do
# 	if (cards[k].include? 'multiverseid')
# 		names.push(cards[k]['name'])
# 		colors.push(cards[k]['colors'][0])
# 		image_urls.push(cards[k]['imageUrl'])
# 		external_ids.push(cards[k]['id'])
# 		# puts "name : #{names[k]} | color: #{colors[k]} | image_url: #{image_urls[k]} | external_id: #{external_ids[k]}"
# 	end

# end

# # -----------------------------------------  SEED DATABASE ----------------------------

# # It should be names length because we omit some cards 
# # If we use cards.length, we will run into validation error.
# for k in 0..names.length-1 do
# 	seeder = Card.new(name: names[k])
# 	seeder.colors = colors[k]
# 	seeder.image_urls = image_urls[k]
# 	seeder.external_ids = external_ids[k]
# 	# puts "name : #{seeder.name} | color: #{seeder.colors} | image_url: #{seeder.image_urls} | external_id: #{seeder.external_ids}"
# 	seeder.save!
# end


