class SpecialPagesController < ApplicationController
  def home
    flash[:danger] = 'Danger message'
    flash[:warning] = 'Warning message'
  end
end
