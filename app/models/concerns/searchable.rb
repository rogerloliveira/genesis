# frozen_string_literal: true

# Adds dynamic search functionality
module Searchable
  extend ActiveSupport::Concern

  def basic_search(model, approximate_fields = [], exact_fields = [], include_list = nil)
    search_conditions = prepare_search_fields model.arel_table, exact_fields, exact: true
    search_conditions += prepare_search_fields model.arel_table, approximate_fields

    query = include_list.present? ? model.includes(include_list) : model
    query = query.where(*search_conditions) if search_conditions.length.positive?

    query.page(params[:page])
  end

  def prepare_search_fields(arel_table, fields, **options)
    [].tap do |search_conditions|
      fields.each do |field|
        val = params[field]
        next if val.blank?

        if options[:exact]
          search_conditions.push(arel_table[field].eq(val))
        else
          search_conditions.push(arel_table[field].matches(Arel::Nodes::SqlLiteral.new("'%#{val}%'")))
        end
      end
    end
  end
end
