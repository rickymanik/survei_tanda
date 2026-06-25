class User < ApplicationRecord
  has_secure_password

  has_many :surveys, dependent: :destroy
  has_many :responses, dependent: :destroy
  has_many :redemptions, dependent: :destroy
  has_many :point_transactions, dependent: :destroy

  validates :name, :email, presence: true
  validates :email, uniqueness: { case_sensitive: false }
  validates :password, length: { minimum: 6 }, allow_nil: true

  before_validation :normalize_email

  private

  def normalize_email
    self.email = email.to_s.downcase.strip
  end
end
