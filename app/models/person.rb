# frozen_string_literal: true

class Person < ApplicationRecord
  validates :document_kind, :status, presence: true

  validates :first_name, presence: true, length: { maximum: 20 }
  validates :last_name, presence: true, length: { maximum: 50 }
  validates :document_number, presence: true, length: { maximum: 20 }
  validates :commercial_name, length: { maximum: 150 }
  validates :additional_document, presence: true, length: { maximum: 15 }
  validates :mailbox, length: { maximum: 50 }

  enum document_kind: { cpf: 0, cnpj: 1, external: 2 }
  enum status: { active: 0, blocked: 1 }
end
