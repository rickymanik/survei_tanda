class Question < ApplicationRecord
  belongs_to :survey

  validates :text, :question_type, presence: true
end
