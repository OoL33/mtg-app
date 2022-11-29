class CreateCards < ActiveRecord::Migration[5.2]
  def change
    create_table :cards do |t|
			t.string :name, null: false
			t.string :colors, null: false
			t.string :image_urls, null: false
			t.string :external_ids, null: false

			t.timestamps null: false
    end
  end
end
