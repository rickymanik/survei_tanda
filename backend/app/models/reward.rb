class Reward < ApplicationRecord
  has_many :redemptions, dependent: :destroy

  validates :name, :points_cost, :stock, presence: true
  validates :points_cost, numericality: { greater_than: 0 }
  validates :stock, numericality: { greater_than_or_equal_to: 0 }
end
