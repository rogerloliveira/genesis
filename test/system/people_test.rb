# frozen_string_literal: true

require 'application_system_test_case'

class PeopleTest < ApplicationSystemTestCase
  setup do
    @person = people(:one)
  end

  test 'visiting the index' do
    visit people_url
    assert_selector 'h1', text: 'People'
  end

  test 'should create person' do
    visit people_url
    click_on 'New'

    fill_in 'Additional document', with: @person.additional_document
    fill_in 'Birthdate', with: @person.birthdate
    check 'Carrier' if @person.carrier
    fill_in 'Commercial name', with: @person.commercial_name
    check 'Customer' if @person.customer
    fill_in 'Document kind', with: @person.document_kind
    fill_in 'Document number', with: @person.document_number
    check 'Driver' if @person.driver
    check 'Employee' if @person.employee
    fill_in 'First name', with: @person.first_name
    fill_in 'Last name', with: @person.last_name
    fill_in 'Mailbox', with: @person.mailbox
    fill_in 'Municipal inscription', with: @person.municipal_inscription
    fill_in 'Observation', with: @person.observation
    check 'Rural producer' if @person.rural_producer
    fill_in 'Status', with: @person.status
    check 'Supplier' if @person.supplier
    click_on 'Create Person'

    assert_text 'Person was successfully created'
    click_on 'Back'
  end

  test 'should update Person' do
    visit person_url(@person)
    click_on 'Edit this person', match: :first

    fill_in 'Additional document', with: @person.additional_document
    fill_in 'Birthdate', with: @person.birthdate
    check 'Carrier' if @person.carrier
    fill_in 'Commercial name', with: @person.commercial_name
    check 'Customer' if @person.customer
    fill_in 'Document kind', with: @person.document_kind
    fill_in 'Document number', with: @person.document_number
    check 'Driver' if @person.driver
    check 'Employee' if @person.employee
    fill_in 'First name', with: @person.first_name
    fill_in 'Last name', with: @person.last_name
    fill_in 'Mailbox', with: @person.mailbox
    fill_in 'Municipal inscription', with: @person.municipal_inscription
    fill_in 'Observation', with: @person.observation
    check 'Rural producer' if @person.rural_producer
    fill_in 'Status', with: @person.status
    check 'Supplier' if @person.supplier
    click_on 'Update Person'

    assert_text 'Person was successfully updated'
    click_on 'Back'
  end

  test 'should destroy Person' do
    visit person_url(@person)
    click_on 'Destroy this person', match: :first

    assert_text 'Person was successfully destroyed'
  end
end
