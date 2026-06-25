class Api::V1::SessionsController < ApplicationController
  def create
    user = User.find_by(email: params[:email].to_s.downcase.strip)

    if user&.authenticate(params[:password])
      render json: user_json(user)
    else
      render json: { message: "Email atau password tidak valid" }, status: :unauthorized
    end
  end
end
