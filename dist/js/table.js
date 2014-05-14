
//Spinner Options
var opts = {
  lines: 13, // The number of lines to draw
  length: 10, // The length of each line
  width: 10, // The line thickness
  radius: 20, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#6C8CD5', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '100%', // Top position relative to parent
  left: '50%' // Left position relative to parent
};

//Target for loading spinner
var target = document.getElementById('spin');

var init = {
  items: [],
  start: 0,
  spinner: new Spinner(opts),
  url: function(count){
      var url = "http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/DataCollection/MapServer/2/query?where=OBJECTID+>+"+ count +"&outFields=*&f=pjson";
        $.getJSON(url , function( data ) {
          init.spinner.spin(target);

          console.log(data)
          for(each in data.features){
            var descr = data.features[each].attributes.DESCRIPTION_OF_PLAN;
            var plnNum = data.features[each].attributes.PLAN_NUMBER;
            var numSh = data.features[each].attributes.NUMBER_OF_SHEETS;
            var projectOnFile = data.features[each].attributes.PROJECT_ON_FILE;
            var ptype = data.features[each].attributes.PLAN_TYPE;
            var pYear = data.features[each].attributes.PLAN_YEAR;
            var pID = data.features[each].attributes.PLAN;
            var hyperlink = 'http://gis.raleighnc.gov/publicutility/devplans/' + pID;


            init.items.push([ptype, plnNum, pYear, pID, descr, numSh, '<a href=' + '"' + hyperlink + '"' + '>'+ pID + '</a>']);
           
          }
            //Recalls data if the response exceeds the max freatures returned
            if (data.features.length == 1000 ){
                init.start = init.start + 1000
                init.url(init.start);
            }
            //Runs after all data has been loading to the array, and creates table
            else {
              console.log('Data Finished Loading')
              createTable(init.items)
              init.spinner.stop();
            }

        });
        
      }
}

init.url(init.start);


function createTable(info){
  //Allows the table to be sorted by clicking on headings
  jQuery.fn.dataTableExt.oSort['string-case-asc']  = function(x,y) {
    return ((x < y) ? -1 : ((x > y) ?  1 : 0));
  };
 
  jQuery.fn.dataTableExt.oSort['string-case-desc'] = function(x,y) {
    return ((x < y) ?  1 : ((x > y) ? -1 : 0));
  };
  //Initiates the data table
  $(document).ready(function() {
    $('#datatable').dataTable({
              "sPaginationType": "bootstrap",
              "aaData": info,
              "bProcessing":true,
              "bDeferRender": true,
              "bRetrieve": true,
              "iDisplayLength": 5,
              "aLengthMenu": [5, 10, 15, 20],
              "aaSorting": [ [0,'asc'], [1,'asc'] ],
              "aoColumns": [
            { "sTitle": "PLAN TYPE" },
            { "sTitle": "PLAN #"},
            { "sTitle": "PLAN YEAR" },    
            { "sTitle": "PLAN", "sClass": "center" },
            { "sTitle": "DESCRIPITION", "sClass": "center" },
            { "sTitle": "# OF SHEETS", "sClass": "center"},
            { "sTitle": "Link TO FOLDER", "sClass": "center"}   
          ]
    });
  });
}


