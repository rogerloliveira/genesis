# frozen_string_literal: true

# Application helpers
module ApplicationHelper
  def boolean_display_span(field)
    if field
      content_tag :span, field, class: 'text-success'
    else
      content_tag :span, field, class: 'text-danger'
    end
  end
end
