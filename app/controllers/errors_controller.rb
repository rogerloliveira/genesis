# frozen_string_literal: true

# HTTP error pages
class ErrorsController < ApplicationController
  skip_before_action :authenticate_user!

  def not_found
    render 'errors/not_found', layout: 'errors'
  end

  def server_error
    render 'errors/server_error', layout: 'errors'
  end
end
