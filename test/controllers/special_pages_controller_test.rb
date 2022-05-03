require "test_helper"

class SpecialPagesControllerTest < ActionDispatch::IntegrationTest
  test "should get home" do
    get special_pages_home_url
    assert_response :success
  end
end
