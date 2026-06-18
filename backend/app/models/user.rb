class User < ApplicationRecord
  has_many :surveys, dependent: :destroy
  has_many :responses, dependent: :destroy
  has_many :redemptions, dependent: :destroy
  has_many :point_transactions, dependent: :destroy

  validates :name, :email, presence: true
  validates :email, uniqueness: true
end
