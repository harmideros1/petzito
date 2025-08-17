FactoryBot.define do
  factory :country do
    sequence(:name) { |n| "País #{n}" }

    trait :mexico do
      name { "México" }
    end

    trait :colombia do
      name { "Colombia" }
    end

    trait :argentina do
      name { "Argentina" }
    end
  end
end
