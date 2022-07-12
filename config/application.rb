# frozen_string_literal: true

require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Genesis
  # Genesis
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Localization
    config.i18n.available_locales = %i[en-us pt-br]
    config.i18n.default_locale = :'en-us'
    config.i18n.fallbacks = true
    routes.default_url_options[:locale] = :'en-us'
    config.i18n.enforce_available_locales = false

    # Generators
    config.generators do |generate|
      generate.helper false
      generate.assets false
      generate.view_specs false
    end

    config.exceptions_app = routes

    config.active_job.queue_adapter = :sidekiq
  end
end
