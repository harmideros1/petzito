class CreateFieldSolutions < ActiveRecord::Migration[7.1]
  def change
    create_table :field_solutions, id: :uuid do |t|
      t.references :form_solution, null: false, foreign_key: true, type: :uuid
      t.string :field_id, null: false
      t.text :field_value

      t.timestamps
    end
    add_index :field_solutions, [:form_solution_id, :field_id], unique: true
  end
end
