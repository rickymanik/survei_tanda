class Api::V1::UsersController < ApplicationController
  def index
    render json: User.order(:name).map { |user| user_json(user) }
  end

  def show
    render json: user_json(User.find(params[:id]))
  end

  def create
    user = User.new(user_params)

    if user.save
      render json: user_json(user), status: :created
    else
      render_errors(user)
    end
  end

  def update
    user = User.find(params[:id])

    if user.update(user_params)
      render json: user_json(user)
    else
      render_errors(user)
    end
  end

  def password
    user = User.find(params[:id])

    unless user.authenticate(params[:current_password])
      render json: { message: "Password saat ini tidak sesuai" }, status: :unprocessable_entity
      return
    end

    if user.update(password: params[:password])
      head :no_content
    else
      render_errors(user)
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :age, :gender, :city, :occupation)
  end
end
