# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_08_17_013732) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "cities", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "country_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["country_id"], name: "index_cities_on_country_id"
    t.index ["name", "country_id"], name: "index_cities_on_name_and_country_id", unique: true
  end

  create_table "countries", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_countries_on_name", unique: true
  end

  create_table "field_solutions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "form_solution_id", null: false
    t.string "field_id", null: false
    t.text "field_value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["form_solution_id", "field_id"], name: "index_field_solutions_on_form_solution_id_and_field_id", unique: true
    t.index ["form_solution_id"], name: "index_field_solutions_on_form_solution_id"
  end

  create_table "flow_solutions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.bigint "user_id", null: false
    t.uuid "flow_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["flow_id"], name: "index_flow_solutions_on_flow_id"
    t.index ["user_id", "flow_id"], name: "index_flow_solutions_on_user_id_and_flow_id", unique: true
    t.index ["user_id"], name: "index_flow_solutions_on_user_id"
  end

  create_table "flows", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.json "json_schema", null: false
    t.bigint "city_id"
    t.bigint "country_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["city_id"], name: "index_flows_on_city_id"
    t.index ["country_id"], name: "index_flows_on_country_id"
    t.index ["name"], name: "index_flows_on_name", unique: true
  end

  create_table "form_solutions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "section_solution_id", null: false
    t.string "form_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["section_solution_id", "form_id"], name: "index_form_solutions_on_section_solution_id_and_form_id", unique: true
    t.index ["section_solution_id"], name: "index_form_solutions_on_section_solution_id"
  end

  create_table "section_solutions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "flow_solution_id", null: false
    t.string "section_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["flow_solution_id", "section_id"], name: "index_section_solutions_on_flow_solution_id_and_section_id", unique: true
    t.index ["flow_solution_id"], name: "index_section_solutions_on_flow_solution_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "cities", "countries"
  add_foreign_key "field_solutions", "form_solutions"
  add_foreign_key "flow_solutions", "flows"
  add_foreign_key "flow_solutions", "users"
  add_foreign_key "flows", "cities"
  add_foreign_key "flows", "countries"
  add_foreign_key "form_solutions", "section_solutions"
  add_foreign_key "section_solutions", "flow_solutions"
end
