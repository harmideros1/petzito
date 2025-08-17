FactoryBot.define do
  factory :city do
    sequence(:name) { |n| "Ciudad #{n}" }
    association :country

    trait :mexico_city do
      name { "Ciudad de México" }
      association :country, :mexico
    end

    trait :bogota do
      name { "Bogotá" }
      association :country, :colombia
    end

    trait :buenos_aires do
      name { "Buenos Aires" }
      association :country, :argentina
    end
  end
end
