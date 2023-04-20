class Api::V1::ApiCardsController < ApiController
  def search
    # Delegate to ApiCardService to search for cards
    api_cards = Api::V1::ApiCardService.new.search(params)

    if api_cards.present?
      # Get the external IDs for all cards returned by the API
      api_card_ids = api_cards.map { |card| card['multiverse_ids'] }.flatten.uniq

      # Query the database for existing cards with matching external IDs
      existing_cards = Card.where("external_ids && ARRAY[?]::integer[]", api_card_ids)

      # Create new cards for any API cards that don't already exist in the database
      new_cards = api_cards.reject { |card| existing_cards.any? { |existing_card| existing_card.external_ids == card['multiverse_ids'] } }.map do |card|
        Card.create(name: card['name'], colors: card['colors'], image_urls: card['image_uris']['border_crop'], external_ids: card['multiverse_ids'])
      end

      # Combine existing and new cards
      cards = existing_cards + new_cards

      new_cards.each(&:save)

      filtered_cards = filter_cards(cards, params)

      max_cards = 5

      cards = cards.first(max_cards)

      render json: cards, each_serializer: CardSerializer
    else
      render json: { error: 'No cards found' }, status: :not_found
    end
  end

  private

  def filter_cards(cards, params)
    cards = cards.filter { |card| card.name.include?(params[:search_string]) } if params[:search_string].present?
    cards = cards.filter { |card| card.colors.include?(params[:color]) } if params[:color].present?
    cards = cards.filter { |card| card.image_uris["border_crop"].include?(params[:image_uris][:border_crop]) } if params[:image_uris].present? && params[:image_uris][:border_crop].present?
    cards
  end
end
