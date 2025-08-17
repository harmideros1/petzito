FactoryBot.define do
  factory :flow do
    sequence(:name) { |n| "Flow#{n}" }
    city { create(:city) }
    json_schema do
      {
        "sections" => [
          {
            "id" => "section1",
            "title" => "Sección 1",
            "forms" => [
              {
                "id" => "form1",
                "fields" => [
                  {
                    "id" => "field1",
                    "type" => "text",
                    "label" => "Campo 1"
                  }
                ]
              }
            ]
          }
        ]
      }
    end

    trait :with_city do
      city { create(:city) }
    end

    trait :with_country do
      city { nil }
      country { create(:country) }
    end

    trait :with_both do
      city { create(:city) }
      country { create(:country) }
    end

    trait :no_location do
      city { nil }
      country { nil }
    end

    trait :invalid_json do
      json_schema { { "invalid" => "structure" } }
    end

    trait :empty_sections do
      json_schema { { "sections" => [] } }
    end
  end
end
