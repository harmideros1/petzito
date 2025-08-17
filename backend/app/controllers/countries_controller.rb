class CountriesController < ApplicationController
  # GET /countries
  def index
    @countries = Country.all
    render json: @countries
  end

  # GET /countries/:id
  def show
    @country = Country.find(params[:id])
    render json: @country
  rescue ActiveRecord::RecordNotFound
    render json: { error: "País no encontrado" }, status: :not_found
  end
end
