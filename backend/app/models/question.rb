class Question < ApplicationRecord
  belongs_to :survey

  validates :text, :question_type, presence: true
  validates :question_type, inclusion: { in: %w[single multiple text] }
  validate :choice_question_has_options

  private

  def choice_question_has_options
    return if question_type == "text"
    return if options.is_a?(Array) && options.reject(&:blank?).any?

    errors.add(:options, "harus diisi untuk pertanyaan pilihan")
  end
end
