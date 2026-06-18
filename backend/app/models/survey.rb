class Survey < ApplicationRecord
  belongs_to :user
  has_many :questions, dependent: :destroy
  has_many :responses, dependent: :destroy

  validates :title, :description, :category, presence: true
end
