class Api::V1::RewardsController < ApplicationController
  def index
    render json: Reward.all
  end

  def show
    render json: Reward.find(params[:id])
  end
end
