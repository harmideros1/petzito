require 'rails_helper'

RSpec.describe Flow, type: :model do
  describe 'validaciones' do
    subject { build(:flow, :with_city) }

    it { should validate_presence_of(:name) }
    it { should validate_uniqueness_of(:name) }
    it { should validate_presence_of(:json_schema) }
  end

  describe 'formato del nombre' do
    it 'acepta nombres válidos' do
      valid_names = ['Flow1', 'MyFlow', 'FLOW123', 'flow456']

      valid_names.each do |name|
        flow = build(:flow, :with_city, name: name)
        expect(flow).to be_valid
      end
    end

    it 'rechaza nombres inválidos' do
      invalid_names = ['Flow 1', 'My-Flow', 'FLOW@123', 'flow#456', 'a' * 65]

      invalid_names.each do |name|
        flow = build(:flow, :with_city, name: name)
        expect(flow).not_to be_valid
        expect(flow.errors[:name]).to include('debe contener solo letras y números, máximo 64 caracteres')
      end
    end
  end

  describe 'validación de ubicación' do
    it 'requiere al menos una ubicación (ciudad o país)' do
      flow = build(:flow, :no_location)
      expect(flow).not_to be_valid
      expect(flow.errors[:base]).to include('Debe asignar al menos una ciudad o país')
    end

    it 'es válido con solo ciudad' do
      flow = build(:flow, :with_city)
      expect(flow).to be_valid
    end

    it 'es válido con solo país' do
      flow = build(:flow, :with_country)
      expect(flow).to be_valid
    end

    it 'es válido con ciudad y país' do
      flow = build(:flow, :with_both)
      expect(flow).to be_valid
    end
  end

  describe 'validación de JSON' do
    it 'acepta JSON válido' do
      flow = build(:flow, :with_city)
      expect(flow).to be_valid
    end

    it 'rechaza JSON inválido' do
      flow = build(:flow, :with_city, :invalid_json)
      expect(flow).not_to be_valid
      expect(flow.errors[:json_schema]).to include('JSON debe contener al menos una sección')
    end

    it 'rechaza JSON sin secciones' do
      flow = build(:flow, :with_city, :empty_sections)
      expect(flow).not_to be_valid
      expect(flow.errors[:json_schema]).to include('JSON debe contener al menos una sección')
    end
  end

  describe 'relaciones' do
    it { should belong_to(:city).optional }
    it { should belong_to(:country).optional }
    it { should have_many(:flow_solutions).dependent(:destroy) }
    it { should have_many(:users).through(:flow_solutions) }
  end

  describe 'callbacks' do
    it 'genera UUID automáticamente' do
      flow = build(:flow, :with_city)
      expect(flow.id).to be_nil

      flow.save
      expect(flow.id).to be_present
      expect(flow.id).to match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    end
  end

  describe 'scopes' do
    let!(:country) { create(:country) }
    let!(:city) { create(:city, country: country) }
    let!(:flow1) { create(:flow, city: city) }
    let!(:flow2) { create(:flow, country: country) }
    let!(:flow3) { create(:flow, :with_city) }

    it 'filtra por ciudad' do
      expect(Flow.by_city(city.id)).to include(flow1)
      expect(Flow.by_city(city.id)).not_to include(flow2, flow3)
    end

    it 'filtra por país' do
      expect(Flow.by_country(country.id)).to include(flow2)
      expect(Flow.by_country(country.id)).not_to include(flow1, flow3)
    end

    it 'filtra por nombre' do
      expect(Flow.by_name(flow1.name)).to include(flow1)
    end
  end

  describe 'creación' do
    it 'crea un flujo válido' do
      flow = build(:flow, :with_city)
      expect(flow).to be_valid
      expect(flow.save).to be true
    end

    it 'no permite nombres duplicados' do
      create(:flow, :with_city, name: 'TestFlow')
      duplicate_flow = build(:flow, :with_city, name: 'TestFlow')
      expect(duplicate_flow).not_to be_valid
      expect(duplicate_flow.errors[:name]).to include('has already been taken')
    end
  end
end
