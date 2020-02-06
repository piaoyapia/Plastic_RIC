//Constant
// 0 = Debug Mode; 1 = Launchmode
var launchmode = 0;
var selection;

//Variable
var el = x => document.getElementById(x);


illu_update();
function illu_update(){
  el("illu").innerHTML.src ="https://raw.githubusercontent.com/piaoyapia/Plastic_RIC/master/app/view/square.JPG?fbclid=IwAR37wDdgmYbOGdW7oOYJPfdkFui5s-GMvQSamlXdkG31sxKW7Tfwh1FUzdc";
}


function set_selection() {
  selection = 1;
  //hide, if the launchmode is on
  if (launchmode == 1) {
    $('.info-box').hide();
    $('.analyze-button').hide();
    $('.result-label').hide();
  }

  if (launchmode ==0){
    var ueberschrift = "Dies ist Überschrift.";
    var text = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labor.";
    el("info_general_title").innerHTML = ueberschrift;
    el("info_market_title").innerHTML = ueberschrift;
    el("info_recycling_title").innerHTML = ueberschrift;
    el("info_alternatives_title").innerHTML = ueberschrift;
    el("info_general_content").innerHTML = text;
    el("info_market_content").innerHTML = text;
    el("info_recycling_content").innerHTML = text;
    el("info_alternatives_content").innerHTML = text;
    el("result-label").innerHTML = "Das ist PET.";
  }

}

function showPicker(inputId) {
  el("file-input").click();
  data_output("1_polyethylene_PE");
}

function showPicked(input) {
  el("upload-label").innerHTML = input.files[0].name;

  var reader = new FileReader();
  reader.onload = function(e) {
    el("image-picked").src = e.target.result;
    el("image-picked").className = "";
    // show analyze button

    $(".analyze-button").show();
    el("analyze-button").innerHTML = "Start Analysis";
  };
  reader.readAsDataURL(input.files[0]);
}

function analyze() {

  var uploadFiles = el("file-input").files;
  // hier implementieren, dass das Bild schon quadratisch zugeschnitten wird.

  if (uploadFiles.length != 1) alert("Please select one picture to analyze.");

  var xhr = new XMLHttpRequest();
  var loc = window.location;
  xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`, true);
  xhr.onerror = function() {
    alert(xhr.responseText);
  };
  xhr.onload = function(e) {
    if (this.readyState === 4) {

      // Restart Analyzing
      el("analyze-button").innerHTML = "Restart Analysis";

      var response = JSON.parse(e.target.responseText);

      //später hier debuggen: Resultlabel in Antwort umwandeln
      el("result-label").innerHTML = `${response["result"]}`;
      var response_for_selection = `${response["result"]}`;
      var split = response_for_selection.split("_", 1);
      selection = split[0];
}
      // show result boxes, to fill them up:
      activate_result();
      // Update of the texts through csv - used in update_text
      update_text(selection);


  }

  // Analyzing
  el("analyze-button").innerHTML = "Analyzing...";

  var fileData = new FormData();
  fileData.append("file", uploadFiles[0]);
  xhr.send(fileData);

}

function activate_result() {
  // was inside the main loop before
  $(".result-label").show();
  $(".info-box").show();
}


function data_output(selected) {

  if (selected = '1_polyethylene_PET') {
    console.log(selected);
  }
}

$.ajax({
  url: 'https://raw.githubusercontent.com/piaoyapia/Plastic_RIC/master/app/static/data.csv',
  dataType: 'text',
}).done(print_data);
//successFunction

function print_data(data) {
  all_data = data;
}

function update_text(selection) {


  if (selection != 99) {
    /// constant titles --> csv headlines
    // rows get selected
    var allRows = all_data.split(/\r?\n|\r/);
    // Splits the first row
    var title = allRows[0].split('§');
    // Chooses the first/second/third/forth entry of the first row and writes it in HTML
    el("info_general_title").innerHTML = title[0];
    el("info_market_title").innerHTML = title[1];
    el("info_recycling_title").innerHTML = title[2];
    el("info_alternatives_title").innerHTML = title[3];
    //please note that the 'plastic-name-title' is only the heading of the section. The content will be examined below!!
    //el('info_plasticName_title').innerHTML = title[4];

    // <--- these titles stays the same for every possible content.


    // The choosen content: Splits the rows of the entry:
    var content = allRows[selection].split('§');
    // Choose the first/second/third/forth column entry of the choosen row.
    //Row gets choosen by the structure of the data.csv (4x4 table)
    el("info_general_content").innerHTML = content[0];
    el("info_market_content").innerHTML = content[1];
    el("info_recycling_content").innerHTML = content[2];
    el("info_alternatives_content").innerHTML = content[3];
    el("plasticName_content").innerHTML = content[4];

    //Update label needed for analysis:
    el("result-label").innerHTML = `${"The identified Plastic is " + content[4]}`;

  }

}
