class ApplicationController < ActionController::API
  private

  def render_errors(record)
    render json: { errors: record.errors.full_messages }, status: :unprocessable_entity
  end

  def user_json(user)
    user.as_json(except: [:password_digest])
  end
end
