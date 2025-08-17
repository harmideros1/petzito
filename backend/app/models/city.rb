class City < ApplicationRecord
  # Validaciones
  validates :name, presence: true, length: { maximum: 100 }
  validates :name, uniqueness: { scope: :country_id, case_sensitive: false }
  validates :country, presence: true

  # Relaciones
  belongs_to :country
  has_many :flows, dependent: :destroy

  # Callbacks
  before_save :normalize_name

  private

  def normalize_name
    self.name = name.strip.titleize if name.present?
  end
end
