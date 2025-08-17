class Country < ApplicationRecord
  # Validaciones
  validates :name, presence: true, uniqueness: true, length: { maximum: 100 }

  # Relaciones
  has_many :cities, dependent: :destroy
  has_many :flows, dependent: :destroy

  # Callbacks
  before_save :normalize_name

  private

  def normalize_name
    self.name = name.strip.titleize if name.present?
  end
end
