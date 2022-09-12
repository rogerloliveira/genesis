# frozen_string_literal: true

# SpecialPages controller class
class SpecialPagesController < ApplicationController
  def home; end

  def about; end

  def about_post
    my_params = params.except(:locale, :controller, :action, :authenticity_token)
    flash.now[:danger] = my_params
    render 'about'
  end
end
