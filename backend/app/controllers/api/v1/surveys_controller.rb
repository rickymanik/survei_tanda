class Api::V1::SurveysController < ApplicationController
  def index
    render json: Survey.includes(:questions).order(created_at: :desc), include: :questions
  end

  def show
    render json: Survey.includes(:questions, :responses).find(params[:id]), include: [:questions, :responses]
  end

  def create
    survey = Survey.new(survey_params)

    if survey.save
      render json: survey, include: :questions, status: :created
    else
      render_errors(survey)
    end
  end

  def update
    survey = Survey.find(params[:id])

    if survey.update(survey_params)
      render json: survey, include: :questions
    else
      render_errors(survey)
    end
  end

  def destroy
    Survey.find(params[:id]).destroy
    head :no_content
  end

  private

  def survey_params
    params.require(:survey).permit(
      :user_id,
      :title,
      :description,
      :category,
      :target_count,
      :close_date,
      questions_attributes: [:id, :text, :question_type, :required, :_destroy, { options: [] }]
    )
  end
end
