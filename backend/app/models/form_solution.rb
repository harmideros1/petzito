class FormSolution < ApplicationRecord
  # Configuración de UUID
  self.primary_key = 'id'

  # Validaciones
  validates :section_solution, presence: true
  validates :form_id, presence: true, length: { maximum: 100 }
  validates :form_id, uniqueness: { scope: :section_solution_id, message: "ya existe una solución para este formulario" }

  # Relaciones
  belongs_to :section_solution
  has_many :field_solutions, dependent: :destroy

  # Callbacks
  before_validation :generate_uuid, on: :create

  private

  def generate_uuid
    self.id = SecureRandom.uuid if id.blank?
  end
end
