class Reward < ApplicationRecord
  has_many :redemptions, dependent: :destroy

  validates :name, :points_cost, :stock, presence: true
end
