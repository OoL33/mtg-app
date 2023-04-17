class Api::V1::ApiCardsController < ApiController

	CLIENT = Faraday.new(url: 'https://api.scryfall.com')

	def search
		# Logic for querying Scryfall API and interacting with the database
		search_string = params[:search_string]

		response = CLIENT.get('cards/search') do |req|
			req.params['q'] = search_string if search_string.present?
		end
		json_response = JSON.parse(response.body)
		api_cards = json_response['data']

		if api_cards.present?
			# Get the external IDs for all cards returned by the API
			api_card_ids = api_cards.map { |card| card['multiverse_ids'] }.flatten.uniq

			# Query the database for existing cards with matching external IDs
			existing_cards = Card.where("external_ids && ARRAY[?]::integer[]", api_card_ids)

			# Create new cards for any API cards that don't already exist in the database
			new_cards = api_cards.reject { |card| existing_cards.any? { |existing_card| existing_card.external_ids.include?(card['multiverse_ids']) } }.map do |card|
				Card.create(name: card['name'], colors: card['colors'], image_urls: card['image_uris']['border_crop'], external_ids: card['multiverse_ids'])
			end

			# Combine existing and new cards
			cards = existing_cards + new_cards

			filtered_cards = filter_cards(cards, params)

			max_cards = 5

			cards = cards.first(max_cards)

			render json: cards, each_serializer: CardSerializer
		else
			render json: { error: 'No cards found' }, status: :not_found
		end
	end

  def fetch_api_cards(search_string, page = 1, per_page = 20)
    # Implementation of fetch_api_cards method
    query_params = {
      q: search_string,
      page: page,
      per_page: per_page
    }
    response = CLIENT.get("cards/search", query_params)
    if response.success?
      JSON.parse(response.body)['data']
    else
      []
    end
  end

  def save_to_cards_table(card_data)
    # Implementation of save_to_cards_table method
    card = Card.new(
      name: card_data['name'],
      colors: card_data['colors'],
      image_url: card_data['image_uris']['border_crop'],
			external_ids: card_data['multiverse_ids']
    )

    # Save the card to the database
    if card.save
      # Return true if the card was saved successfully
      true
    else
      # Return false if there was an error saving the card
      false
    end
  end
end
