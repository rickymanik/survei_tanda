class Api::V1::RedemptionsController < ApplicationController
  def index
    render json: Redemption.includes(:user, :reward).all
  end

  def show
    render json: Redemption.find(params[:id])
  end

  def create
    redemption = Redemption.new(redemption_params)

    if redemption.save
      render json: redemption, status: :created
    else
      render json: { errors: redemption.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def redemption_params
    params.require(:redemption).permit(:user_id, :reward_id, :points_spent, :status)
  end
end
