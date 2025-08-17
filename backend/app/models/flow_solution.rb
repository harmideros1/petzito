class FlowSolution < ApplicationRecord
  # Configuración de UUID
  self.primary_key = 'id'

  # Validaciones
  validates :user, presence: true
  validates :flow, presence: true
  validates :user_id, uniqueness: { scope: :flow_id, message: "ya tiene una solución para este flujo" }

  # Relaciones
  belongs_to :user
  belongs_to :flow
  has_many :section_solutions, dependent: :destroy

  # Callbacks
  before_validation :generate_uuid, on: :create

  private

  def generate_uuid
    self.id = SecureRandom.uuid if id.blank?
  end
end
