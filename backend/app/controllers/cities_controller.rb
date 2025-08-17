class CitiesController < ApplicationController
  # GET /cities
  def index
    @cities = City.includes(:country).all
    render json: @cities
  end

  # GET /cities/:id
  def show
    @city = City.includes(:country).find(params[:id])
    render json: @city
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Ciudad no encontrada" }, status: :not_found
  end
end
