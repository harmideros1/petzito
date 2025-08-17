class CreateFlows < ActiveRecord::Migration[7.1]
  def change
    create_table :flows, id: :uuid do |t|
      t.string :name, null: false
      t.json :json_schema, null: false
      t.references :city, null: true, foreign_key: true
      t.references :country, null: true, foreign_key: true

      t.timestamps
    end
    add_index :flows, :name, unique: true
  end
end
