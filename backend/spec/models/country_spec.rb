require 'rails_helper'

RSpec.describe Country, type: :model do
  describe 'validaciones' do
    subject { build(:country) }

    it { should validate_presence_of(:name) }
    it { should validate_uniqueness_of(:name) }
    it { should validate_length_of(:name).is_at_most(100) }
  end

  describe 'relaciones' do
    it { should have_many(:cities).dependent(:destroy) }
    it { should have_many(:flows).dependent(:destroy) }
  end

  describe 'callbacks' do
    it 'normaliza el nombre antes de guardar' do
      country = build(:country, name: '  mexico  ')
      country.save
      expect(country.name).to eq('Mexico')
    end

    it 'maneja nombres con caracteres especiales' do
      country = build(:country, name: 'méxico')
      country.save
      expect(country.name).to eq('México')
    end
  end

  describe 'creación' do
    it 'crea un país válido' do
      country = build(:country, name: 'Colombia')
      expect(country).to be_valid
    end

    it 'no permite nombres duplicados' do
      create(:country, name: 'Argentina')
      duplicate_country = build(:country, name: 'Argentina')
      expect(duplicate_country).not_to be_valid
      expect(duplicate_country.errors[:name]).to include('has already been taken')
    end

    it 'no permite nombres vacíos' do
      country = build(:country, name: '')
      expect(country).not_to be_valid
      expect(country.errors[:name]).to include("can't be blank")
    end
  end
end
