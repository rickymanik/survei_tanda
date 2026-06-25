class Api::V1::RewardsController < ApplicationController
  def index
    render json: Reward.all
  end

  def show
    render json: Reward.find(params[:id])
  end

  def create
    admin = User.find_by(id: params[:admin_id])

    unless admin&.is_admin?
      render json: { message: "Hanya administrator yang dapat menambahkan hadiah" }, status: :forbidden
      return
    end

    reward = Reward.new(reward_params)

    if reward.save
      render json: reward, status: :created
    else
      render_errors(reward)
    end
  end

  private

  def reward_params
    params.require(:reward).permit(:name, :description, :points_cost, :stock)
  end
end
