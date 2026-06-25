class Survey < ApplicationRecord
  belongs_to :user
  has_many :questions, dependent: :destroy
  has_many :responses, dependent: :destroy
  accepts_nested_attributes_for :questions, allow_destroy: true

  validates :title, :description, :category, presence: true
  validates :target_count, numericality: { greater_than: 0 }

  before_validation :set_points_reward

  def open_for_responses?
    return false if responses.size >= target_count.to_i
    return true if close_date.blank?

    close_date >= Date.current
  end

  private

  def set_points_reward
    self.points_reward = [10, questions.reject(&:marked_for_destruction?).size * 10].max
  end
end
