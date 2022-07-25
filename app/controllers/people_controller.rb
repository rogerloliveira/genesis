# frozen_string_literal: true

# PeopleController class
class PeopleController < ApplicationController
  include Searchable
  before_action :set_person, only: %i[show edit update destroy]

  # GET /people
  # GET /people.json
  def index
    @people = basic_search Person,
                           %i[first_name last_name birthdate document_number document_kind
                              rural_producer commercial_name additional_document mailbox municipal_inscription
                              status observation customer supplier carrier driver employee]
  end

  # GET /people/1
  # GET /people/1.json
  def show; end

  # GET /people/new
  def new
    @person = Person.new
  end

  # GET /people/1/edit
  def edit; end

  # POST /people
  def create
    @person = Person.new(person_params)
    respond_to do |format|
      if @person.save
        format.html { redirect_to @person, flash: { success: t(:created_successfully, resource_name: @person.model_name.human) } }
        format.json { render :show, status: :created, location: @person }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @person.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /people/1
  # PATCH/PUT /people/1.json
  def update
    respond_to do |format|
      if @person.update(person_params)
        format.html { redirect_to @person, flash: { success: t(:updated_successfully, resource_name: @person.model_name.human) } }
        format.json { render :show, status: :ok, location: @person }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @person.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /people/1
  # DELETE /people/1.json
  def destroy
    @person.destroy
    respond_to do |format|
      format.html { redirect_to people_url, flash: { danger: t(:deleted_successfully, resource_name: @person.model_name.human) } }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_person
    @person = Person.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def person_params
    params.require(:person).permit(:first_name, :last_name, :birthdate, :document_number, :document_kind, :rural_producer, :commercial_name, :additional_document, :mailbox, :municipal_inscription,
                                   :status, :observation, :customer, :supplier, :carrier, :driver, :employee)
  end
end
