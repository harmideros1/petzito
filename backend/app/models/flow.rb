class Flow < ApplicationRecord
  # Configuración de UUID
  self.primary_key = 'id'

  # Validaciones
  validates :name, presence: true,
                   uniqueness: true,
                   format: { with: /\A[a-zA-Z0-9]{1,64}\z/, message: "debe contener solo letras y números, máximo 64 caracteres" }
  validates :json_schema, presence: true
  validate :at_least_one_location_assigned
  validate :valid_json_schema

  # Relaciones
  belongs_to :city, optional: true
  belongs_to :country, optional: true
  has_many :flow_solutions, dependent: :destroy
  has_many :users, through: :flow_solutions

  # Callbacks
  before_validation :generate_uuid, on: :create

  # Scopes
  scope :by_city, ->(city_id) { where(city_id: city_id) }
  scope :by_country, ->(country_id) { where(country_id: country_id) }
  scope :by_name, ->(name) { where(name: name) }

  private

  def generate_uuid
    self.id = SecureRandom.uuid if id.blank?
  end

  def at_least_one_location_assigned
    unless city_id.present? || country_id.present?
      errors.add(:base, "Debe asignar al menos una ciudad o país")
    end
  end

  def valid_json_schema
    return if json_schema.blank?

    validator = FlowJsonValidatorService.new(json_schema)
    unless validator.valid?
      validator.errors.each do |error|
        errors.add(:json_schema, error)
      end
    end
  end
end
