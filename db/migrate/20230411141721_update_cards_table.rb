class UpdateCardsTable < ActiveRecord::Migration[5.2]
  def change
		change_column :cards, :external_ids, :integer, array: true, default: [], using: "(string_to_array(external_ids, ','))::integer[]"
  end
end
