class Api::V1::ResponsesController < ApplicationController
  def index
    render json: Response.where(survey_id: params[:survey_id])
  end

  def create
    response = Response.new(response_params.merge(survey_id: params[:survey_id]))

    if response.save
      render json: response, status: :created
    else
      render json: { errors: response.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def response_params
    params.require(:response).permit(:user_id, answers: {})
  end
end
