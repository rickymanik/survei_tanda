class Api::V1::RedemptionsController < ApplicationController
  def index
    render json: Redemption.order(created_at: :desc)
  end

  def show
    render json: Redemption.find(params[:id])
  end

  def create
    user = User.find(redemption_params[:user_id])
    reward = Reward.find(redemption_params[:reward_id])

    if reward.stock.to_i <= 0
      render json: { message: "Stok hadiah habis" }, status: :unprocessable_entity
      return
    end

    if user.points.to_i < reward.points_cost.to_i
      render json: { message: "Poin kamu belum cukup" }, status: :unprocessable_entity
      return
    end

    redemption = nil

    ActiveRecord::Base.transaction do
      user.decrement!(:points, reward.points_cost)
      reward.decrement!(:stock, 1)
      redemption = Redemption.create!(
        user: user,
        reward: reward,
        points_spent: reward.points_cost,
        status: redemption_params[:status].presence || "diproses"
      )
      PointTransaction.create!(
        user: user,
        amount: -reward.points_cost,
        description: "Penukaran #{reward.name}"
      )
    end

    render json: redemption, status: :created
  rescue ActiveRecord::RecordInvalid => error
    render json: { errors: error.record.errors.full_messages }, status: :unprocessable_entity
  end

  private

  def redemption_params
    params.require(:redemption).permit(:user_id, :reward_id)
  end
end
