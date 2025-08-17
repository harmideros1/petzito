class CreateSectionSolutions < ActiveRecord::Migration[7.1]
  def change
    create_table :section_solutions, id: :uuid do |t|
      t.references :flow_solution, null: false, foreign_key: true, type: :uuid
      t.string :section_id, null: false

      t.timestamps
    end
    add_index :section_solutions, [:flow_solution_id, :section_id], unique: true
  end
end
