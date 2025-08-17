require 'rails_helper'

RSpec.describe City, type: :model do
  describe 'validaciones' do
    subject { build(:city) }

    it { should validate_presence_of(:name) }
    it { should validate_length_of(:name).is_at_most(100) }
    it { should validate_presence_of(:country) }
  end

  describe 'relaciones' do
    it { should belong_to(:country) }
    it { should have_many(:flows).dependent(:destroy) }
  end

  describe 'uniqueness' do
    let(:country) { create(:country) }

    it 'permite nombres únicos por país' do
      create(:city, name: 'Bogotá', country: country)
      new_city = build(:city, name: 'Medellín', country: country)
      expect(new_city).to be_valid
    end

    it 'no permite nombres duplicados en el mismo país' do
      create(:city, name: 'Bogotá', country: country)
      duplicate_city = build(:city, name: 'Bogotá', country: country)
      expect(duplicate_city).not_to be_valid
      expect(duplicate_city.errors[:name]).to include('has already been taken')
    end

    it 'permite nombres duplicados en países diferentes' do
      country1 = create(:country, name: 'Colombia')
      country2 = create(:country, name: 'Argentina')

      create(:city, name: 'Buenos Aires', country: country1)
      new_city = build(:city, name: 'Buenos Aires', country: country2)
      expect(new_city).to be_valid
    end
  end

  describe 'callbacks' do
    it 'normaliza el nombre antes de guardar' do
      country = create(:country)
      city = build(:city, name: '  bogota  ', country: country)
      city.save
      expect(city.name).to eq('Bogota')
    end
  end

  describe 'creación' do
    it 'crea una ciudad válida' do
      country = create(:country)
      city = build(:city, name: 'Medellín', country: country)
      expect(city).to be_valid
    end

    it 'no permite ciudades sin país' do
      city = build(:city, country: nil)
      expect(city).not_to be_valid
      expect(city.errors[:country]).to include('must exist')
    end
  end
end
