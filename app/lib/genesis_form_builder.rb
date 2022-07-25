# frozen_string_literal: true

# Custom input builders
class GenesisFormBuilder < ActionView::Helpers::FormBuilder
  include Rails.application.routes.url_helpers
  include ActionView::Helpers::UrlHelper

  def enum_field(method, options = {})
    excluded_keys = options.key?(:except) ? options[:except] : []
    select method, @object.enum_options(method, excluded_keys), {}, options
  end

  def text_field(method, options = {})
    set_options(method, options) if @object
    super method, options
  end

  def label(method, text = nil, options = {}, &)
    set_label_options method, options if @object
    super(method, text, options, &)
  end

  def number_field(method, options = {})
    set_options(method, options) if @object

    super method, options
  end

  def date_field(method, options = {}, _html_options = {})
    @template.text_field(@object_name, method, objectify_options(options.merge(type: :date)))
  end

  def switch_field(method, options = {})
    @template.content_tag(:div, class: 'switch-toggle') do
      toggle_box = check_box(method, { checked: @object.send(method) }.merge(options))
      opts = options.merge(for: "#{@object_name}_#{method}")
      opts[:style] = "--on-icon: '#{options[:'data-on-icon']}';" if options.key? :'data-on-icon'
      opts[:style] += "--off-icon: '#{options[:'data-off-icon']}';" if options.key? :'data-off-icon'
      toggle_box + @template.content_tag(:label, nil, opts)
    end
  end

  private

  def set_options(method, options)
    @object.class.validators.map do |validator|
      next unless validator.attributes.include?(method)

      options[:required] = true if validator.is_a? ActiveRecord::Validations::PresenceValidator
      options[:maxlength] = validator.options[:maximum] if validator.is_a? ActiveRecord::Validations::LengthValidator
      options[:size] = nil
      set_numericality_options(validator, options) if validator.is_a? ActiveModel::Validations::NumericalityValidator
    end
  end

  def set_numericality_options(validator, options)
    if (gt = validator.options[:greater_than])
      options[:min] = gt
    end
    if (lt = validator.options[:less_than])
      options[:max] = lt
    end
    options[:step] = :any
  end

  def set_label_options(method, options)
    @object.class.validators.map do |validator|
      next unless validator.attributes.include?(method)

      options[:'data-required'] = true if validator.is_a?(ActiveRecord::Validations::PresenceValidator)
    end
  end
end
