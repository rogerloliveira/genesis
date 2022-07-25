# frozen_string_literal: true

json.extract! person, :id, :first_name, :last_name, :birthdate, :document_number, :document_kind, :rural_producer, :commercial_name, :additional_document, :mailbox, :municipal_inscription, :status,
              :observation, :customer, :supplier, :carrier, :driver, :employee, :created_at, :updated_at
json.url person_url(person, format: :json)
