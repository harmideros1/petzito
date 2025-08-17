# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

puts "🌍 Creando países..."

# Crear países principales
countries = [
  { name: "México" },
  { name: "Estados Unidos" },
  { name: "Canadá" },
  { name: "España" },
  { name: "Colombia" },
  { name: "Argentina" },
  { name: "Brasil" },
  { name: "Chile" },
  { name: "Perú" },
  { name: "Venezuela" }
]

countries.each do |country_data|
  country = Country.find_or_create_by!(name: country_data[:name])
  puts "✅ País creado: #{country.name}"
end

puts "\n🏙️ Creando ciudades..."

# Crear ciudades para México
mexico = Country.find_by(name: "México")
if mexico
  mexican_cities = [
    "Ciudad de México",
    "Guadalajara",
    "Monterrey",
    "Puebla",
    "Tijuana",
    "Cancún",
    "Mérida",
    "Querétaro",
    "San Luis Potosí",
    "Hermosillo"
  ]

  mexican_cities.each do |city_name|
    city = City.find_or_create_by!(name: city_name, country: mexico)
    puts "✅ Ciudad creada: #{city.name}, #{city.country.name}"
  end
end

# Crear ciudades para Estados Unidos
usa = Country.find_by(name: "Estados Unidos")
if usa
  us_cities = [
    "Nueva York",
    "Los Ángeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Filadelfia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San José"
  ]

  us_cities.each do |city_name|
    city = City.find_or_create_by!(name: city_name, country: usa)
    puts "✅ Ciudad creada: #{city.name}, #{city.country.name}"
  end
end

# Crear ciudades para España
spain = Country.find_by(name: "España")
if spain
  spanish_cities = [
    "Madrid",
    "Barcelona",
    "Valencia",
    "Sevilla",
    "Zaragoza",
    "Málaga",
    "Murcia",
    "Palma",
    "Las Palmas",
    "Bilbao"
  ]

  spanish_cities.each do |city_name|
    city = City.find_or_create_by!(name: city_name, country: spain)
    puts "✅ Ciudad creada: #{city.name}, #{city.country.name}"
  end
end

# Crear ciudades para Colombia
colombia = Country.find_by(name: "Colombia")
if colombia
  colombian_cities = [
    "Bogotá",
    "Medellín",
    "Cali",
    "Barranquilla",
    "Cartagena",
    "Cúcuta",
    "Bucaramanga",
    "Pereira",
    "Santa Marta",
    "Ibagué"
  ]

  colombian_cities.each do |city_name|
    city = City.find_or_create_by!(name: city_name, country: colombia)
    puts "✅ Ciudad creada: #{city.name}, #{city.country.name}"
  end
end

puts "\n🎉 Seeds completados exitosamente!"
puts "📊 Total de países: #{Country.count}"
puts "📊 Total de ciudades: #{City.count}"
