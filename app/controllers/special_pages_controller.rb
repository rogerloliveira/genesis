# frozen_string_literal: true

# SpecialPages controller class
class SpecialPagesController < ApplicationController
  skip_before_action :authenticate_user!, only: :home

  def home; end
  def about; end
end
