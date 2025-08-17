class ApplicationController < ActionController::API
  # Configuración para manejo de errores
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActionController::ParameterMissing, with: :bad_request

  # Endpoint de health check
  def health
    render json: { status: 'ok', timestamp: Time.current.iso8601 }
  end

  private

  def not_found(exception)
    render json: { error: 'Recurso no encontrado', details: exception.message }, status: :not_found
  end

  def bad_request(exception)
    render json: { error: 'Parámetros inválidos', details: exception.message }, status: :bad_request
  end
end
