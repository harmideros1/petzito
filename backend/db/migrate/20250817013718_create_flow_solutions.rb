class CreateFlowSolutions < ActiveRecord::Migration[7.1]
  def change
    create_table :flow_solutions, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true
      t.references :flow, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
    add_index :flow_solutions, [:user_id, :flow_id], unique: true
  end
end
