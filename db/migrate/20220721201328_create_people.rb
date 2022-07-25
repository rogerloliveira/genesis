# frozen_string_literal: true

# CreatePeople class
class CreatePeople < ActiveRecord::Migration[7.0]
  def change
    create_table :people do |t|
      t.string :first_name
      t.string :last_name
      t.date :birthdate
      t.string :document_number
      t.integer :document_kind
      t.boolean :rural_producer
      t.string :commercial_name
      t.string :additional_document
      t.string :mailbox
      t.string :municipal_inscription
      t.integer :status
      t.text :observation
      t.boolean :customer
      t.boolean :supplier
      t.boolean :carrier
      t.boolean :driver
      t.boolean :employee

      t.timestamps
    end
  end
end
