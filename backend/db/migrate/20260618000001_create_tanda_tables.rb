class CreateTandaTables < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :age
      t.string :gender
      t.string :city
      t.string :occupation
      t.integer :points, default: 0, null: false
      t.timestamps
    end
    add_index :users, :email, unique: true

    create_table :surveys do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :description, null: false
      t.string :category, null: false
      t.integer :target_count, null: false
      t.date :close_date
      t.integer :points_reward, default: 10, null: false
      t.timestamps
    end

    create_table :questions do |t|
      t.references :survey, null: false, foreign_key: true
      t.text :text, null: false
      t.string :question_type, null: false
      t.boolean :required, default: false, null: false
      t.json :options
      t.timestamps
    end

    create_table :responses do |t|
      t.references :survey, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.json :answers
      t.timestamps
    end
    add_index :responses, [:survey_id, :user_id], unique: true

    create_table :rewards do |t|
      t.string :name, null: false
      t.text :description, null: false
      t.integer :points_cost, null: false
      t.integer :stock, default: 0, null: false
      t.timestamps
    end

    create_table :redemptions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :reward, null: false, foreign_key: true
      t.integer :points_spent, null: false
      t.string :status, default: "diproses", null: false
      t.timestamps
    end

    create_table :point_transactions do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :amount, null: false
      t.string :description, null: false
      t.timestamps
    end
  end
end
