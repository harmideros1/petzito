class CitySerializer < ActiveModel::Serializer
  attributes :id, :name, :country_id, :created_at, :updated_at

  belongs_to :country
end
