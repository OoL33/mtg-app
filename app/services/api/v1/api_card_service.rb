module Api::V1
  class ApiCardService
    
    CLIENT = Faraday.new(url: 'https://api.scryfall.com')

    def search(params)
      search_string = params[:search_string]

      begin
        # Make the external API call
        response = CLIENT.get('cards/search') do |req|
          req.params['q'] ||= search_string if search_string.present?
        end

        # Handle potential JSON parsing error
        json_response = JSON.parse(response.body)
        puts "API response: #{response.body}"
        api_cards = json_response['data']

        # Return the response from the API
        api_cards

      rescue Faraday::Error => e
        # Handle Faraday errors (e.g., network errors, timeouts)
        # Return a default response or raise a custom exception
        # based on your application's requirements
        raise e, "Error calling external API: #{e.message}"
      rescue JSON::ParserError => e
        # Handle JSON parsing errors
        # Return a default response or raise a custom exception
        # based on your application's requirements
        raise e, "Error parsing API response: #{e.message}"
      end
    end

    def fetch_api_cards(search_string, page = 1, per_page = 20)
      # Create a new Faraday connection for each request
      # client = Faraday.new(url: 'https://api.scryfall.com')

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
end
