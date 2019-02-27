//Constant
// 0 = Debug Mode 1 = Launchmode
launchmode = 1;

//Variable
var el = x => document.getElementById(x);


function set_selection()
{
selection = 1;
}

function showPicker(inputId) { el('file-input').click();
data_output("1_polyethylene_PE");
 }

function showPicked(input) {
    el('upload-label').innerHTML = input.files[0].name;
    var reader = new FileReader();
    reader.onload = function (e) {
        el('image-picked').src = e.target.result;
        el('image-picked').className = '';
    }
    reader.readAsDataURL(input.files[0]);
}

function analyze() {
    var uploadFiles = el('file-input').files;
    if (uploadFiles.length != 1) alert('Please select 1 file to analyze!');

    el('analyze-button').innerHTML = 'Analyze...';
    var xhr = new XMLHttpRequest();
    var loc = window.location
    xhr.open('POST', `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`, true);
    xhr.onerror = function() {alert (xhr.responseText);}
    xhr.onload = function(e) {
        if (this.readyState === 4) {
            var response = JSON.parse(e.target.responseText);
            el('result-label').innerHTML = chooseResult(`${response['result']}`);

            var response_for_selection = `${response['result']}`;
            var split = response_for_selection.split("_",1);
            selection = split[0];
            update_text();
        }
        el('analyze-button').innerHTML = 'Analyse';
    }

    var fileData = new FormData();
    fileData.append('file', uploadFiles[0]);
    xhr.send(fileData);
}

//neu:

function chooseResult(result){
  var plastics_origin= ['1_polyethylene_PET', '2_high_density_polyethylene_PE-HD', '3_polyvinylchloride_PVC', '4_low_density_polyethylene_PE-LD', '5_polypropylene_PP','6_polystyrene_PS', '7_other_resins'];
  var pos=plastics_origin.indexOf('result');

  var plastics= ['PET', 'PE-HD', 'PVC', 'PE-LD', 'PP','PS', 'other resins'];
  return "The identified Plastic is" + plastics[pos];
}
//neu Ende


function data_output(selected){

if(selected = "1_polyethylene_PET" ){
console.log(selected);
}
}

$.ajax({
  url: 'https://raw.githubusercontent.com/piaoyapia/Plastic_RIC/master/app/static/data.csv',
  dataType: 'text',
}).done(print_data);
//successFunction

function print_data(data){
all_data = data;
}

function update_text(){
if(selection != 99){
/// Konstante Überschriften
  // Selektiert die Reihen
  var allRows = all_data.split(/\r?\n|\r/);
  // Teilt die erste Zeile
  var titel = allRows[0].split('§');
  // Wählt den ersten Eintrag der Ersten Zeile und schreibt in HTML
  el('info_general_titel').innerHTML = titel[0];
  el('info_market_titel').innerHTML = titel[1];
  el('info_recycling_titel').innerHTML = titel[2];
  el('info_alternatives_titel').innerHTML = titel[3];
// Varibel Content
  // Der gewählte Eintrag

  // Splitte die Reihe des Eintrags
  var content = allRows[selection].split('§');
  //Wähle den ersten Eintrags
  el('info_general_content').innerHTML = content[0];
  el('info_market_content').innerHTML = content[1];
  el('info_recycling_content').innerHTML = content[2];
  el('info_alternatives_content').innerHTML = content[3];
}
}
