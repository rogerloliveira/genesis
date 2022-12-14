# frozen_string_literal: true

Rails.application.routes.draw do
  resources :people
  match '/404', to: 'errors#not_found', via: :all
  match '/500', to: 'errors#server_error', via: :all

  devise_for :users
  root to: 'special_pages#home'
  get 'about', to: 'special_pages#about'
  post 'about', to: 'special_pages#about_post'
end
