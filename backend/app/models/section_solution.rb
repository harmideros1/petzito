class SectionSolution < ApplicationRecord
  # Configuración de UUID
  self.primary_key = 'id'

  # Validaciones
  validates :flow_solution, presence: true
  validates :section_id, presence: true, length: { maximum: 100 }
  validates :section_id, uniqueness: { scope: :flow_solution_id, message: "ya existe una solución para esta sección" }

  # Relaciones
  belongs_to :flow_solution
  has_many :form_solutions, dependent: :destroy

  # Callbacks
  before_validation :generate_uuid, on: :create

  private

  def generate_uuid
    self.id = SecureRandom.uuid if id.blank?
  end
end
