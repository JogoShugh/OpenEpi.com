fetchInputFieldTemplates = (callback) ->
  templates = $("[class='field-tmpl']")
  count = templates.length
  templates.each ->
    item = $(@)
    that = @
    src = item.attr('src')
    $.ajax(src)
      .done (data) ->
        jadeTmpl = data
        that.tmpl = jadeTmpl
        count--
        if count == 0
          callback()
      .fail (ex) ->
        count--
        if count == 0
          callback()
        error "Error loading input field templates in fetchInputFieldTemplates: " + ex

bindModuleLinks = () ->
  $('.moduleItem a').each ->
    item = $(@)
    moduleName = item.attr('data-moduleName')
    item.bind 'click', ->
      moduleLoad moduleName

moduleLoad = (moduleName) ->
  modulePage = $("#module")
  module = modules[moduleName]
  if not module?
    error "Could not find module #{moduleName}"
    return

  $("#resultsMissing").show()
  $("#resultsPane").hide()

  modulePage.find('.fields').each ->
    fieldContainer = $(@)
    fieldContainer.empty()

    # Create a collection of raw values for a bindable model
    viewModelData = {}    

    fields = module.inputFields
    for field in fields
      viewModelData[field.id] = field.defaultValue

      tmpl = $('#input-' + field.type + '-tmpl')[0]
      html = $.jade(tmpl.tmpl, field);
      fieldContainer.append(html);

      # This calls the jquery mobile type on the field to "vivify it":
      fieldContainer.find("[data-id='#{field.id}']").each ->
        $(@)[field.jqmType]()

    # Create the bindable model with Backbone, Knockback, and Knockout :-D
    model = new Backbone.Model(viewModelData)
    viewModel = kb.viewModel(model)
    ko.applyBindings(viewModel, @)

    # Finallly, rebind the click handler for the "Calculate" button and
    # attach it to the calculate method of the current module
    modulePage.find('.calculate').each ->
      command = $(@)
      command.unbind('click')
      command.bind 'click', ->
        result = module.calculate(viewModel)
        showResult result

    # Show it!
    $.mobile.changePage("#module")
    $(".enterButton").addClass('ui-btn-down')

showResult = (result) ->  
  resultPage = $("#results")
  resultData = $("#resultData")
  drumRoll = $("#drumRoll")
  resultData.hide()  
  drumRoll.show()
  $("#resultsMissing").hide()
  $("#resultsPane").show()  
  $.mobile.changePage("#results")  
  window.setTimeout ->
    drumRoll.fadeOut().promise().done ->
      resultData.html(result)
      resultData.fadeIn()
  ,
    1000

error = (message) ->
  toastr.error message
  console.log 'OpenEpi Error:' + message  

$ ->
  fetchInputFieldTemplates ->
    bindModuleLinks()
    window.setTimeout ->
      $.mobile.changePage "#home"
    , 
      1750