# frozen_string_literal: true

require 'test_helper'

class SpecialPagesControllerTest < ActionDispatch::IntegrationTest
  test 'should get home' do
    get root_url
    assert_response :success
  end
end
