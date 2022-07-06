# frozen_string_literal: true

# Application controller
class ApplicationController < ActionController::Base
  rescue_from ActionController::RoutingError, with: :render_not_found
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  def default_url_options
    { locale: I18n.locale }
  end

  private

  def render_not_found
    render 'errors/not_found'
  end

  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end
end
