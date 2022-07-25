# frozen_string_literal: true

# ApplicationRecord class
class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  def human_attribute_name(*attr)
    self.class.human_attribute_name(*attr)
  end

  def self.human_enum_name(enum_name, enum_value)
    I18n.t("activerecord.attributes.#{model_name.i18n_key}.#{enum_name.to_s.pluralize}.#{enum_value}")
  end

  def translated_enum_value(enum_name)
    I18n.t("activerecord.attributes.#{model_name.i18n_key}.#{enum_name.to_s.pluralize}.#{self[enum_name]}")
  end

  def enum_options(enum_name, excluded_keys = [])
    keys = self.class.send(enum_name.to_s.pluralize).keys.reject { |item| excluded_keys.include? item.to_sym }
    keys.collect { |item| [self.class.human_enum_name(enum_name, item), item] }
  end

  def self.enum_options(enum_name, excluded_keys = [])
    keys = send(enum_name.to_s.pluralize).keys.reject { |item| excluded_keys.include? item.to_sym }
    keys.collect { |item| [human_enum_name(enum_name, item), item] }
  end
end
