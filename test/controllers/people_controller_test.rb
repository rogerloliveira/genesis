# frozen_string_literal: true

require 'test_helper'

class PeopleControllerTest < ActionDispatch::IntegrationTest
  setup do
    @person = people(:one)
  end

  test 'should get index' do
    get people_url
    assert_response :success
  end

  test 'should get new' do
    get new_person_url
    assert_response :success
  end

  test 'should create person' do
    assert_difference('Person.count') do
      post people_url,
           params: { person: { additional_document: @person.additional_document, birthdate: @person.birthdate,
                               carrier: @person.carrier, commercial_name: @person.commercial_name, customer: @person.customer,
                               document_kind: @person.document_kind, document_number: @person.document_number,
                               driver: @person.driver, employee: @person.employee, first_name: @person.first_name,
                               last_name: @person.last_name, mailbox: @person.mailbox,
                               municipal_inscription: @person.municipal_inscription, observation: @person.observation,
                               rural_producer: @person.rural_producer, status: @person.status, supplier: @person.supplier } }
    end

    assert_redirected_to person_url(Person.last)
  end

  test 'should show person' do
    get person_url(@person)
    assert_response :success
  end

  test 'should get edit' do
    get edit_person_url(@person)
    assert_response :success
  end

  test 'should update person' do
    patch person_url(@person),
          params: { person: { additional_document: @person.additional_document, birthdate: @person.birthdate,
                              carrier: @person.carrier, commercial_name: @person.commercial_name, customer: @person.customer,
                              document_kind: @person.document_kind, document_number: @person.document_number,
                              driver: @person.driver, employee: @person.employee, first_name: @person.first_name,
                              last_name: @person.last_name, mailbox: @person.mailbox,
                              municipal_inscription: @person.municipal_inscription, observation: @person.observation,
                              rural_producer: @person.rural_producer, status: @person.status, supplier: @person.supplier } }

    assert_redirected_to person_url(@person)
  end

  test 'should destroy person' do
    assert_difference('Person.count', -1) do
      delete person_url(@person)
    end

    assert_redirected_to people_url
  end
end
