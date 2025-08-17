class CreateFormSolutions < ActiveRecord::Migration[7.1]
  def change
    create_table :form_solutions, id: :uuid do |t|
      t.references :section_solution, null: false, foreign_key: true, type: :uuid
      t.string :form_id, null: false

      t.timestamps
    end
    add_index :form_solutions, [:section_solution_id, :form_id], unique: true
  end
end
