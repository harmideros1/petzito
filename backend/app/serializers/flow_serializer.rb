class FlowSerializer < ActiveModel::Serializer
  attributes :id, :name, :json_schema, :city, :country, :created_at, :updated_at

  def city
    return nil unless object.city

    {
      id: object.city.id,
      name: object.city.name,
      country: {
        id: object.city.country.id,
        name: object.city.country.name
      }
    }
  end

  def country
    return nil unless object.country

    {
      id: object.country.id,
      name: object.country.name
    }
  end
end
