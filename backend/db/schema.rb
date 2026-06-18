ActiveRecord::Schema[7.1].define(version: 2026_06_18_000001) do
  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "password_digest"
    t.string "age"
    t.string "gender"
    t.string "city"
    t.string "occupation"
    t.integer "points", default: 0
    t.timestamps
  end

  create_table "surveys", force: :cascade do |t|
    t.references "user", null: false, foreign_key: true
    t.string "title"
    t.text "description"
    t.string "category"
    t.integer "target_count"
    t.date "close_date"
    t.integer "points_reward"
    t.timestamps
  end

  create_table "questions", force: :cascade do |t|
    t.references "survey", null: false, foreign_key: true
    t.text "text"
    t.string "question_type"
    t.boolean "required", default: false
    t.json "options"
    t.timestamps
  end

  create_table "responses", force: :cascade do |t|
    t.references "survey", null: false, foreign_key: true
    t.references "user", null: false, foreign_key: true
    t.json "answers"
    t.timestamps
  end

  create_table "rewards", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "points_cost"
    t.integer "stock"
    t.timestamps
  end

  create_table "redemptions", force: :cascade do |t|
    t.references "user", null: false, foreign_key: true
    t.references "reward", null: false, foreign_key: true
    t.integer "points_spent"
    t.string "status", default: "diproses"
    t.timestamps
  end

  create_table "point_transactions", force: :cascade do |t|
    t.references "user", null: false, foreign_key: true
    t.integer "amount"
    t.string "description"
    t.timestamps
  end
end
