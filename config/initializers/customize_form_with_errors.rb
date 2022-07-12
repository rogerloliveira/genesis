# frozen_string_literal: true

# Disable the form_with_errors feature
module ActionView
  module Helpers
    module Tags
      # Allows access to method name
      class Base
        attr_reader :method_name
      end
    end
  end
end

ActionView::Base.field_error_proc = proc do |html_tag, instance|
  if instance.is_a? ActionView::Helpers::Tags::Label
    html_tag
  else
    class_attr_index = html_tag.index 'class="'

    if class_attr_index
      html_tag.insert class_attr_index + 7, 'error '
    else
      html_tag.insert html_tag.index('>'), ' class=error'
    end

    # rubocop:disable Rails/OutputSafety
    html_tag.safe_concat "<i>#{instance.object.errors[instance.method_name][0].capitalize}</i>"
    # rubocop:enable Rails/OutputSafety
  end
end
