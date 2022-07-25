# frozen_string_literal: true

require 'test_helper'
class PersonTest < ActiveSupport::TestCase
  setup do
    @data = people(:one).as_json.except 'id'
  end

  test 'should create person' do
    person = Person.new @data
    assert person.save, "Failed to create a new person: #{person.errors.as_json}"
  end

  test 'should not create person with missing fields' do
    %w[first_name last_name document_number document_kind additional_document status].each do |field|
      person = Person.new @data.except field
      assert_not person.save, "Not null validation failed for field #{field}"
    end
  end

  test 'should update person' do
    person = people(:one)

    person.first_name = 'Modified'
    assert person.save, 'Failed to update person'
  end

  test 'should not update person with missing fields' do
    %w[first_name last_name birthdate document_number document_kind rural_producer commercial_name additional_document mailbox municipal_inscription status observation customer supplier carrier
       driver employee].each do |field|
      person = people(:one)
      person.send("#{field}=", nil)
      assert_not person.save, "Not null validation failed for field #{field}"
    end
  end

  test 'should delete person' do
    person = people(:deletable)
    assert person.destroy, 'Failed to delete person'
  end
end
