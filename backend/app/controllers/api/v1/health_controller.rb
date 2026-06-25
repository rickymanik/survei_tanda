class Api::V1::HealthController < ApplicationController
  def show
    render json: {
      name: "Survei Tanda API",
      status: "ok",
      version: "v1",
      endpoints: {
        users: "/api/v1/users",
        surveys: "/api/v1/surveys",
        responses: "/api/v1/responses",
        rewards: "/api/v1/rewards",
        redemptions: "/api/v1/redemptions",
        point_transactions: "/api/v1/point_transactions"
      }
    }
  end
end
