require 'rails_helper'

RSpec.describe FlowJsonValidatorService, type: :service do
  describe '#valid?' do
    context 'con JSON válido' do
      let(:valid_json) do
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

      it 'retorna true' do
        service = described_class.new(valid_json)
        expect(service.valid?).to be true
      end

      it 'no tiene errores' do
        service = described_class.new(valid_json)
        service.valid?
        expect(service.errors).to be_empty
      end
    end

    context 'con JSON inválido' do
      it 'rechaza JSON vacío' do
        service = described_class.new(nil)
        expect(service.valid?).to be false
        expect(service.errors).to include('JSON no puede estar vacío')
      end

      it 'rechaza JSON sin secciones' do
        invalid_json = { "sections" => [] }
        service = described_class.new(invalid_json)
        expect(service.valid?).to be false
        expect(service.errors).to include('JSON debe contener al menos una sección')
      end

      it 'rechaza JSON sin estructura de secciones' do
        invalid_json = { "invalid" => "structure" }
        service = described_class.new(invalid_json)
        expect(service.valid?).to be false
        expect(service.errors).to include('JSON debe contener al menos una sección')
      end

      it 'rechaza sección sin ID' do
        invalid_json = {
          "sections" => [
            {
              "title" => "Sección sin ID",
              "forms" => []
            }
          ]
        }
        service = described_class.new(invalid_json)
        expect(service.valid?).to be false
        expect(service.errors).to include('Sección 1 debe tener un ID')
      end

      it 'rechaza sección sin título' do
        invalid_json = {
          "sections" => [
            {
              "id" => "section1",
              "forms" => []
            }
          ]
        }
        service = described_class.new(invalid_json)
        expect(service.valid?).to be false
        expect(service.errors).to include('Sección 1 debe tener un título')
      end

      it 'rechaza formulario sin ID' do
        invalid_json = {
          "sections" => [
            {
              "id" => "section1",
              "title" => "Sección 1",
              "forms" => [
                {
                  "fields" => []
                }
              ]
            }
          ]
        }
        service = described_class.new(invalid_json)
        expect(service.valid?).to be false
        expect(service.errors).to include('Formulario 1 de sección 1 debe tener un ID')
      end

      it 'rechaza campo sin ID' do
        invalid_json = {
          "sections" => [
            {
              "id" => "section1",
              "title" => "Sección 1",
              "forms" => [
                {
                  "id" => "form1",
                  "fields" => [
                    {
                      "type" => "text",
                      "label" => "Campo sin ID"
                    }
                  ]
                }
              ]
            }
          ]
        }
        service = described_class.new(invalid_json)
        expect(service.valid?).to be false
        expect(service.errors).to include('Campo 1 del formulario 1 de sección 1 debe tener un ID')
      end

      it 'rechaza campo sin tipo' do
        invalid_json = {
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
                      "label" => "Campo sin tipo"
                    }
                  ]
                }
              ]
            }
          ]
        }
        service = described_class.new(invalid_json)
        expect(service.valid?).to be false
        expect(service.errors).to include('Campo 1 del formulario 1 de sección 1 debe tener un tipo')
      end
    end

    context 'con JSON malformado' do
          it 'rechaza JSON con sintaxis inválida' do
      invalid_json = "invalid json string"
      service = described_class.new(invalid_json)
      expect(service.valid?).to be false
      expect(service.errors).to include('JSON debe tener un formato válido')
    end
    end
  end

  describe 'validación de estructura anidada' do
    it 'valida múltiples secciones, formularios y campos' do
      complex_json = {
        "sections" => [
          {
            "id" => "section1",
            "title" => "Sección 1",
            "forms" => [
              {
                "id" => "form1",
                "fields" => [
                  { "id" => "field1", "type" => "text" },
                  { "id" => "field2", "type" => "email" }
                ]
              },
              {
                "id" => "form2",
                "fields" => [
                  { "id" => "field3", "type" => "select" }
                ]
              }
            ]
          },
          {
            "id" => "section2",
            "title" => "Sección 2",
            "forms" => [
              {
                "id" => "form3",
                "fields" => [
                  { "id" => "field4", "type" => "textarea" }
                ]
              }
            ]
          }
        ]
      }

      service = described_class.new(complex_json)
      expect(service.valid?).to be true
      expect(service.errors).to be_empty
    end
  end
end
