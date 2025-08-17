class FieldSolution < ApplicationRecord
  # Configuración de UUID
  self.primary_key = 'id'

  # Validaciones
  validates :form_solution, presence: true
  validates :field_id, presence: true, length: { maximum: 100 }
  validates :field_id, uniqueness: { scope: :form_solution_id, message: "ya existe una solución para este campo" }

  # Relaciones
  belongs_to :form_solution

  # Callbacks
  before_validation :generate_uuid, on: :create

  private

  def generate_uuid
    self.id = SecureRandom.uuid if id.blank?
  end
end
