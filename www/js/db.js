// This is a JavaScript file
var db_name = '';
var db_version = '';

var db = undefined;
document.addEventListener('deviceready', function() {
  db = window.openDatabase("Database", "1.0", "Database", 200000);
});

function executeQuery(tx) {
  tx.executeSql('DROP TABLE IF EXISTS MainTable');
  tx.executeSql('CREATE TABLE IF NOT EXISTS MainTable (id unique, ncode)');
  tx.executeSql('INSERT INTO MainTable (id, ncode) VALUES (1, "あいうえお")');
  tx.executeSql('INSERT INTO MainTable (id, ncode) VALUES (2, "かきくけこ")');
  tx.executeSql('INSERT INTO MainTable (id, ncode) VALUES (3, "さしすせそ")');
  tx.executeSql('INSERT INTO MainTable (id, ncode) VALUES (4, "たちつてと")');        
  tx.executeSql('INSERT INTO MainTable (id, ncode) VALUES (5, "なにぬねの")');
  tx.executeSql('INSERT INTO MainTable (id, ncode) VALUES (6, "はひふへほ")');
  tx.executeSql('INSERT INTO MainTable (id, ncode) VALUES (7, "まみむめも")');
}

function queryDB(tx) {
  tx.executeSql('SELECT * FROM MainTable', [], querySuccess, errorCB);
}

function querySuccess(tx, results) {
  var len = results.rows.length;
  window.alert("There are " + len + " rows of records in the database.");
  for (var i=0; i<len; i++){
      window.alert("row = " + i + " ID = " + results.rows.item(i).id + " Data = " + results.rows.item(i).data+"<br/>");
  }        
}

//Callback function when the transaction is failed.
function errorCB(err) {
  console.log("Error occured while executing SQL: "+err.code);
}

// Callback function when the transaction is success.
function successCB() {
  var db = window.openDatabase("Database", "1.0", "Database", 200000);
  db.transaction(queryDB, errorCB);
}

function createDB(){
  var db = window.openDatabase("Database", "1.0", "Database", 200000);
  db.transaction(executeQuery, errorCB, successCB);
}

function createNovelTable(chapter) {
  db.transaction(
    function(tx){
      tx.executeSql('CREATE TABLE IF NOT EXISTS ' + chapter.ncode + 'Table (id unique primary key, seek real, isdone integer, date text, hasChanged integer, subtitle text, header text, body text)');
      tx.executeSql('INSERT INTO ' + chapter.ncode + 'Table (id, seek, isdone, date, hasChanged, subtitle, header, body) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [chapter.chapter, 0, 0, chapter.date, (chapter.hasChanged ? '1' : '0'), chapter.subtitle, chapter.header, chapter.body]
        );
    },
    errorCB,
    function(){}
  );
}
