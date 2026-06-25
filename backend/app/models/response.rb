class Response < ApplicationRecord
  belongs_to :survey
  belongs_to :user

  validates :user_id, uniqueness: { scope: :survey_id, message: "sudah mengisi survei ini" }
  validate :respondent_is_not_owner

  private

  def respondent_is_not_owner
    return unless survey && user_id == survey.user_id

    errors.add(:user_id, "tidak bisa mengisi survei milik sendiri")
  end
end
