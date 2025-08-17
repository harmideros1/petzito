class FlowJsonValidatorService
  attr_reader :json_schema, :errors

  def initialize(json_schema)
    @json_schema = json_schema
    @errors = []
  end

  def valid?
    validate_structure
    validate_required_fields if errors.empty?
    errors.empty?
  end

  private

  def validate_structure
    return errors << "JSON no puede estar vacío" if json_schema.blank?

    begin
      # Si ya es un hash, usarlo directamente
      if json_schema.is_a?(Hash)
        parsed_json = json_schema
      else
        # Si es un string, parsearlo
        parsed_json = JSON.parse(json_schema.to_s)
      end

      errors << "JSON debe ser un objeto" unless parsed_json.is_a?(Hash)
    rescue JSON::ParserError
      errors << "JSON debe tener un formato válido"
      return
    end
  end

  def validate_required_fields
    return if json_schema.blank?

    # Obtener el JSON parseado
    if json_schema.is_a?(Hash)
      parsed_json = json_schema
    else
      parsed_json = JSON.parse(json_schema.to_s)
    end

    # Validar que tenga al menos una sección
    unless parsed_json['sections']&.is_a?(Array) && parsed_json['sections'].any?
      errors << "JSON debe contener al menos una sección"
    end

    # Validar estructura de secciones
    parsed_json['sections']&.each_with_index do |section, index|
      validate_section(section, index)
    end
  end

  def validate_section(section, index)
    unless section.is_a?(Hash)
      errors << "Sección #{index + 1} debe ser un objeto"
      return
    end

    # Aceptar tanto 'id' como 'name' para compatibilidad con frontend
    unless section['id'].present? || section['name'].present?
      errors << "Sección #{index + 1} debe tener un ID o nombre"
    end

    # Aceptar tanto 'title' como 'name' para compatibilidad con frontend
    unless section['title'].present? || section['name'].present?
      errors << "Sección #{index + 1} debe tener un título o nombre"
    end

    # Validar formularios si existen
    if section['forms']&.is_a?(Array)
      section['forms'].each_with_index do |form, form_index|
        validate_form(form, index + 1, form_index + 1)
      end
    end
  end

  def validate_form(form, section_index, form_index)
    unless form.is_a?(Hash)
      errors << "Formulario #{form_index} de sección #{section_index} debe ser un objeto"
      return
    end

    # Aceptar tanto 'id' como 'name' para compatibilidad con frontend
    unless form['id'].present? || form['name'].present?
      errors << "Formulario #{form_index} de sección #{section_index} debe tener un ID o nombre"
    end

    # Validar campos si existen
    if form['fields']&.is_a?(Array)
      form['fields'].each_with_index do |field, field_index|
        validate_field(field, section_index, form_index, field_index + 1)
      end
    end
  end

  def validate_field(field, section_index, form_index, field_index)
    unless field.is_a?(Hash)
      errors << "Campo #{field_index} del formulario #{form_index} de sección #{section_index} debe ser un objeto"
      return
    end

    # Aceptar tanto 'id' como 'name' para compatibilidad con frontend
    unless field['id'].present? || field['name'].present?
      errors << "Campo #{field_index} del formulario #{form_index} de sección #{section_index} debe tener un ID o nombre"
    end

    unless field['type'].present?
      errors << "Campo #{field_index} del formulario #{form_index} de sección #{section_index} debe tener un tipo"
    end
  end
end
