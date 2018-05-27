// This is a JavaScript file
var db_name = '';
var db_version = '';
var sql ={
  MainTableDefine: 'MainTable (id unique, ncode, title, wname, ex)',
};

document.addEventListener('deviceready', function() {
  initDB();
});

function openDB(){
  return window.openDatabase("Database", "1.0", "Database", 200000);
}

function errorHandler(transaction, error){
  console.log('Error was ' + error.message + ' (Code ' + error.code + ')');
}


function initDB(){
  var db = openDB();
  db.transaction(
    function(tx){
      tx.executeSql('DROP TABLE IF EXISTS MainTable', [], function(){}, errorHandler);
      tx.executeSql('CREATE TABLE IF NOT EXISTS ' + sql.MainTableDefine, [], function(){}, errorHandler);
    });
}

function executeQuery(tx) {
  tx.executeSql('DROP TABLE IF EXISTS MainTable');
  tx.executeSql('CREATE TABLE IF NOT EXISTS MainTable (id unique, ncode)');
}

function queryDB(tx) {
  tx.executeSql('SELECT * FROM MainTable', [], querySuccess, errorHandler);
}

function querySuccess(tx, results) {
  var len = results.rows.length;

  window.alert("There are " + len + " rows of records in the database.");
  for (var i=0; i<len; i++){
    console.log("row = " + i + " ID = " + results.rows.item(i).id + " Data = " + results.rows.item(i).data);
  }        
}

// Callback function when the transaction is success.
function successCB() {
  var db = openDB();
  db.transaction(queryDB, errorHandler);
}

function createNovelTable(chapter) {
  var db = openDB();
  db.transaction(
    function(tx){
      tx.executeSql('DROP TABLE IF NOT EXISTS ' + chapter.ncode + 'Table');
      tx.executeSql('CREATE TABLE IF NOT EXISTS ' + chapter.ncode + 'Table (id unique, seek, isdone, date, hasChanged, subtitle, header, body)');
      tx.executeSql('INSERT INTO ' + chapter.ncode + 'Table (id, seek, isdone, date, hasChanged, subtitle, header, body) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [chapter.chapter, 0, 0, chapter.date, chapter.hasChanged, chapter.subtitle, chapter.header, chapter.body],
        function(tx){
          tx.executeSql('SELECT * FROM ' + chapter.ncode + 'Table', [],
            function(tx, results){
              console.log(results);
            },
            errorHandler);
        },
        errorHandler
        );
    }
  );
}


function addBook(book){
  var db = openDB();
  db.transaction(
    function(tx){
      tx.executeSql('CREATE TABLE IF NOT EXISTS ' + sql.MainTableDefine);
      tx.executeSql(
        'INSERT INTO MainTable (ncode, title, wname, ex) VALUES (?, ?, ?, ?)',
        [book.ncode, book.title, book.wname, book.ex],
        function(){},
        errorHandler
        );
    },
    errorHandler,
    function(){}
  );  
}

function getBooks() {
  console.log('Lets get books');
  var db = openDB();
  db.transaction(
    function(tx){
      tx.executeSql('SELECT * FROM MainTable', [],
        function(tx, results){
          console.log('select success');
          var len = results.rows.length;
          for (var i=0; i<len; i++){
            var item =
            '<ons-list-item tappable modifier="longdivider">' +
              '<dl class="searchResultItem">' + 
                '<dt class="titleItem">' + results.rows.item(i).title + '</dt>' +
                '<dt class="wnameItem">作者:' + results.rows.item(i).wname + '</dt>' +
              '</dl>' +
            '</ons-list-item>';
            $('#book_list').append(item);
          }
        },
        errorHandler);
    });
}
