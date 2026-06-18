class Api::V1::SessionsController < ApplicationController
  def create
    user = User.find_by(email: params[:email])

    if user && user.password_digest == params[:password]
      render json: user
    else
      render json: { message: "Email atau password tidak valid" }, status: :unauthorized
    end
  end
end
