class UpdateCardsTable < ActiveRecord::Migration[5.2]
  def up
    # Change the data type to an array of integers
    change_column :cards, :external_ids, :integer, array: true, default: []

    # No need for using string_to_array here, as the data type should already be an array of integers
  end
end
