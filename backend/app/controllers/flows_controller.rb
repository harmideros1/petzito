class FlowsController < ApplicationController
  # before_action :authenticate_user!  # Comentado temporalmente para desarrollo
  before_action :set_flow, only: [:show, :update, :destroy]

  # GET /flows
  def index
    @flows = Flow.all
    render json: @flows, each_serializer: FlowSerializer
  end

  # GET /flows/:id
  def show
    render json: @flow, serializer: FlowSerializer
  end

  # POST /flows
  def create
    @flow = Flow.new(flow_params)

    if @flow.save
      render json: @flow, serializer: FlowSerializer, status: :created
    else
      render json: { errors: @flow.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /flows/:id
  def update
    if @flow.update(flow_params)
      render json: @flow, serializer: FlowSerializer
    else
      render json: { errors: @flow.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /flows/:id
  def destroy
    @flow.destroy
    head :no_content
  end

  # GET /flows/by_name/:name
  def by_name
    @flow = Flow.find_by(name: params[:name])

    if @flow
      render json: @flow, serializer: FlowSerializer
    else
      render json: { error: "Recurso no encontrado" }, status: :not_found
    end
  end

  # GET /flows/by_city/:city_id
  def by_city
    @flows = Flow.by_city(params[:city_id])
    render json: @flows, each_serializer: FlowSerializer
  end

  # GET /flows/by_country/:country_id
  def by_country
    @flows = Flow.by_country(params[:country_id])
    render json: @flows, each_serializer: FlowSerializer
  end

  private

  def set_flow
    @flow = Flow.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Recurso no encontrado" }, status: :not_found
  end

  def flow_params
    # Transformar la estructura del frontend al formato del backend
    if params[:flow]&.key?(:sections)
      # Permitir todos los parámetros del flow para evitar problemas de strong parameters
      flow_data = params.require(:flow).permit!

      # Obtener sections directamente de params
      sections = params[:flow][:sections] || []

      # Crear json_schema con la estructura del frontend
      json_schema = {
        sections: sections
      }

      # Usar los valores del frontend o valores por defecto
      city_id = flow_data[:city_id].present? ? flow_data[:city_id] : 32  # Bogotá
      country_id = flow_data[:country_id].present? ? flow_data[:country_id] : 6  # Colombia

      {
        name: flow_data[:name],
        json_schema: json_schema,
        city_id: city_id,
        country_id: country_id
      }
    else
      # Formato original del backend
      params.require(:flow).permit(:name, :json_schema, :city_id, :country_id)
    end
  end
end
