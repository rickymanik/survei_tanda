class Api::V1::ResponsesController < ApplicationController
  def index
    responses = params[:survey_id] ? Response.where(survey_id: params[:survey_id]) : Response.all
    render json: responses.order(created_at: :desc)
  end

  def create
    survey = Survey.includes(:questions, :responses).find(params[:survey_id])
    response = Response.new(response_params.merge(survey: survey))

    unless survey.open_for_responses?
      render json: { message: "Survei sudah ditutup atau kuota responden penuh" }, status: :unprocessable_entity
      return
    end

    missing_required = survey.questions.any? do |question|
      next false unless question.required

      value = response.answers.to_h[question.id.to_s]
      value.blank? || (value.respond_to?(:empty?) && value.empty?)
    end

    if missing_required
      render json: { message: "Lengkapi semua pertanyaan wajib sebelum mengirim" }, status: :unprocessable_entity
      return
    end

    ActiveRecord::Base.transaction do
      response.save!
      point_reward = survey.points_reward.to_i
      response.user.increment!(:points, point_reward)
      PointTransaction.create!(
        user: response.user,
        amount: point_reward,
        description: "Poin pengisian survei \"#{survey.title}\""
      )
    end

    if response.persisted?
      render json: response, status: :created
    end
  rescue ActiveRecord::RecordInvalid => error
    render json: { errors: error.record.errors.full_messages }, status: :unprocessable_entity
  end

  private

  def response_params
    permitted = params.require(:response).permit(:user_id)
    raw_answers = params.require(:response).fetch(:answers, {})
    permitted[:answers] = raw_answers.respond_to?(:to_unsafe_h) ? raw_answers.to_unsafe_h : raw_answers
    permitted
  end
end
