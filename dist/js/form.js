var init = {
  items: [],
  start: 0,
  deleteID: 0,
  fieldsurl: 'http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/DataCollection/FeatureServer/2?f=pjson',
  updateurl: 'http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/DataCollection/FeatureServer/2/addFeatures',
  deleteurl: 'http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/DataCollection/FeatureServer/2/deleteFeatures',
  post:{"attributes" :{}},
  fieldlengths: {},
  indata: [],
  DataObj: function(){ for (each in init.post.attributes){
    init.post.attributes[each] = $(init.post.attributes[each]).val();
    init.post.attributes.PLAN = init.post.attributes.PLAN_TYPE + '-' + init.post.attributes.PLAN_NUMBER + '-' + init.post.attributes.PLAN_YEAR
      if (init.post.attributes.NUMBER_OF_SHEETS == ""){
        init.post.attributes.NUMBER_OF_SHEETS = 0
      }
    } 
        
        
  },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  url: function(){
      var url = init.fieldsurl;
        $.getJSON(url , function( data ) {
          console.log(data)
          for(each in data.fields){
            var field = data.fields[each].name;
            var fieldType = data.fields[each].type;
            var fieldlen = data.fields[each].length;

            var formControls = {
              "esriFieldTypeString" : '<div id="'+field+'div" class="form-group"><label for="' + field +'">'+field+'</label><input id="'+ field +'" type="text" maxlength="'+ fieldlen +'" class="form-control" placeholder=""></div>',
              "esriFieldTypeSmallInteger": '<div id="'+field+'div" class="form-group"><label for="' + field +'">'+field+'</label><input id="'+ field +'" type="number" maxlength="'+ fieldlen +'" class="form-control" placeholder=""></div>',
              "PLAN": '<fieldset disabled><div id="'+field+ 'div" class="form-group"><label for="'+ field +'">'+ field +'</label><input type="text" id="' + field + '" maxlength="'+ fieldlen +'" class="form-control" placeholder="..."></div>',
              "CALENDEAR_YEAR":  '<div id="'+field+'div" class="form-group"><label for="'+ field + '">CALENDAR YEAR</label><input type="date" class="form-control" id="'+ field +'" placeholder="mm/dd/yyyy"></div>'


            }

            //Create Post Template
            if (field != 'OBJECTID' || field != 'ID'){
              init.post.attributes[field] = '#' + field
              init.fieldlengths[field] = fieldlen
            }
          

            
            if (fieldType == "esriFieldTypeSmallInteger" || fieldType == "esriFieldTypeDouble"){
              $("#updater").append(formControls.esriFieldTypeSmallInteger)
            }
            else if (field == "PLAN"){
              $("#updater").append(formControls.PLAN)
            }
            else if (field == "CALENDEAR_YEAR"){
              $("#updater").append(formControls.CALENDEAR_YEAR)
            }
            else if (fieldType == "esriFieldTypeString" && field != "LINK"){
              $("#updater").append(formControls.esriFieldTypeString)
            }
      

        }
        //Adds the submit button
        $("#updater").append('<button id="update" type="submit" class="btn btn-primary btn-lg">Submit</button>')

      });
    }, //End of url()
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
submintForm: function(){
      $("#updater").validate();

var jsonlist = []; 
$("form").submit(function(){
  init.DataObj();
  init.indata.push(init.post);
  
  $.ajax({
    url: init.updateurl,
    type: 'POST',
    dataType: 'json',
    data: {f: 'json',
      features: JSON.stringify(init.indata)
    },
    success: function (response){
      console.log(response);
      
      if (response.addResults[0].success == true){
      init.deleteID = response.addResults[0].objectId
      bootbox.alert('Object ' + init.deleteID + ' was Created<br><strong class="text-success">ADD COMPLETED</strong><p class="text-muted">Click Add New Record <strong class="text-warning">BEFORE</strong> entering new data</p>');
      $("#updater").remove();
        $("#frame").append('<a id="new" class="btn btn-success btn-lg" href="../DevPlans/DevPlanSearch.html">Add New Record</a>')
        $("#frame").append('<button id="delete" type="button" class="btn btn-danger btn-lg">Delete Last Record</button>')
        $("#delete").click(function(){
   $.ajax({
    url: init.deleteurl,
    type: 'POST',
    dataType: 'json',
    data: {f: 'json',
      objectIds: init.deleteID
    },
    success: function (response){
      console.log(response);
      $("#delete").remove();
      bootbox.alert('Object ' + init.deleteID +' Removed...<br><strong class="text-success">DELETE SUCCESSFUL</strong>');
    },
    error: function (error){
      console.log(error)
      bootbox.alert('<h1 class="text-danger">FAILURE</h1><h3>The Record WAS <strong class="text-danger">NOT Deleted!!!</strong></h3><p>If you still wish to delete the added feature please make changes via Microsoft Access</p><p class="text-muted">Future updates will allow you to make further changes in the browser...Sorry for the inconvience</p>');
    }
        
      }); //End of Post Delete
    }); //End of Delete
      }
      else {
         bootbox.alert('<h1 class="text-danger">FAILURE</h1><h3>The Record <strong class="text-danger">WAS NOT ADDED!!!</strong></h3><h4 class="text-warning">Code: '+ response.addResults[0].error.code+', ' + response.addResults[0].error.description + '</h4><p>Please check to make sure all fields are filled out correctly</p><p class="text-muted">If the problem persists please call 919-996-2369</p>');
         $("#updater").remove();
          $("#frame").append('<a id="try" class="btn btn-warning btn-lg" href="../devApp/Update.html">Try Again</a>')
      }
      $('form').each(function(){
        this.reset();
      });
    //   if ($("#delete").length > 0){
    //     return
    //   }
    //   else{
        

    // }
    },
    

  });//End of Post update
  
  

return false
});



}//End of submitForm()

}//End of init


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
init.url();
init.submintForm();
