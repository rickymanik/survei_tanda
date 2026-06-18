class Api::V1::PointTransactionsController < ApplicationController
  def index
    render json: PointTransaction.order(created_at: :desc)
  end
end
