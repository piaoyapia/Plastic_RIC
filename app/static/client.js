var el = x => document.getElementById(x);

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
            el('result-label').innerHTML = `Result = ${response['result']}`;

        }
        el('analyze-button').innerHTML = 'Analyse';
    }

    var fileData = new FormData();
    fileData.append('file', uploadFiles[0]);
    xhr.send(fileData);
}


function data_output(selected){

if(selected = "1_polyethylene_PET" ){
console.log(selected);
}
}

$.ajax({
  url: 'https://raw.githubusercontent.com/F-R-S/Plastic_RIC/master/app/static/data.csv',
  dataType: 'text',
}).done(print_data);
//successFunction

function print_data(data){
    var selection = 4 ;
/// Konstante Überschriften
  // Selektiert die Reihen
  var allRows = data.split(/\r?\n|\r/);
  // Teilt die erste Zeile
  var titel = allRows[0].split(',');
  // Wählt den ersten Eintrag der Ersten Zeile und schreibt in HTML
  el('info_general_titel').innerHTML = titel[0];
  el('info_market_titel').innerHTML = titel[1];
  el('info_recycling_titel').innerHTML = titel[2];
    el('info_alternatives_titel').innerHTML = titel[3];
// Varibel Content
  // Der gewählte Eintrag

  // Splitte die Reihe des Eintrags
  var content = allRows[selection].split(',');
  //Wähle den ersten Eintrags
  el('info_general_content').innerHTML = content[0];
el('info_market_content').innerHTML = content[1];
el('info_recycling_content').innerHTML = content[2];
el('info_alternatives_content').innerHTML = content[3];

}







function successFunction(data) {
  var allRows = data.split(/\r?\n|\r/);
  var table = '<table>';
  for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
    if (singleRow === 0) {
      table += '<thead>';
      table += '<tr>';
    } else {
      table += '<tr>';
    }
    var rowCells = allRows[singleRow].split(',');

    for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
      if (singleRow === 0) {
        table += '<th>';
        table += rowCells[rowCell];
        table += '</th>';
      } else {
        table += '<td>';
        table += rowCells[rowCell];
        table += '</td>';
      }
    }
    if (singleRow === 0) {
      table += '</tr>';
      table += '</thead>';
      table += '<tbody>';
    } else {
      table += '</tr>';
    }
  }
  table += '</tbody>';
  table += '</table>';
  $('body').append(table);
}
