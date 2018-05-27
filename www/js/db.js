// This is a JavaScript file
var db_name = '';
var db_version = '';
var sql = {
  MainTableDefine: 'MainTable (id unique, ncode, title, wname, ex)',
};

document.addEventListener('deviceready', function () {
  initDB();
});

function openDB() {
  return window.openDatabase("Database", "1.0", "Database", 200000);
}

function errorHandler(transaction, error) {
  console.log('Error was ' + error.message + ' (Code ' + error.code + ')');
}


function initDB() {
  var db = openDB();
  db.transaction(
    function (tx) {
      tx.executeSql('DROP TABLE IF EXISTS MainTable', [], function () { }, errorHandler);
      tx.executeSql('CREATE TABLE IF NOT EXISTS ' + sql.MainTableDefine, [], function () { }, errorHandler);
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
  for (var i = 0; i < len; i++) {
    console.log("row = " + i + " ID = " + results.rows.item(i).id + " Data = " + results.rows.item(i).data);
  }
}

// Callback function when the transaction is success.
function successCB() {
  var db = openDB();
  db.transaction(queryDB, errorHandler);
}

function updateChapter(chapter) {
  var db = openDB();
  db.transaction(
    function (tx) {
      //tx.executeSql('DROP TABLE IF EXISTS ' + chapter.ncode + 'Table');
      //tx.executeSql('CREATE TABLE IF NOT EXISTS ' + chapter.ncode + 'Table (id unique, seek, isdone, date, hasChanged, subtitle, header, body)');
      tx.executeSql('UPDATE ' + chapter.ncode + 'Table  SET seek = 0, isdone = 0, subtitle = ?, header=?, body=? where id=?',
        [chapter.subtitle, chapter.header, chapter.body, chapter.chapter],
        function (tx) {
          //tx.executeSql('SELECT * FROM ' + chapter.ncode + 'Table', [],
          //  function (tx, results) { },
          //  errorHandler);
        },
        errorHandler
      );
    }
  );
}

function addBook(book) {
  var db = openDB();
  db.transaction(
    function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS ' + sql.MainTableDefine);
      tx.executeSql(
        'INSERT INTO MainTable (ncode, title, wname, ex) VALUES (?, ?, ?, ?)',
        [book.ncode, book.title, book.wname, book.ex],
        function () { },
        errorHandler
      );
      tx.executeSql('DROP TABLE IF EXISTS ' + book.ncode + 'Table');
      tx.executeSql('CREATE TABLE IF NOT EXISTS ' + book.ncode + 'Table (id unique, seek, isdone, date, hasChanged, subtitle, header, body)');
      for (var i in book.list) {
        if (book.list[i].isChapterTitle == false) {
          tx.executeSql(
            'INSERT INTO ' + book.ncode + 'Table (id, date, hasChanged, subtitle) VALUES (?, ?, ?, ?)',
            [book.list[i].url.split('/')[1], book.list[i].date, book.list[i].hasChanged, book.list[i].subtitle]
          );
        }
      }
    },
    errorHandler,
    function () { }
  );
}

function getBooks() {
  console.log('Lets get books');
  var db = openDB();
  db.transaction(
    function (tx) {
      tx.executeSql('SELECT * FROM MainTable', [],
        function (tx, results) {
          console.log('select success');
          var len = results.rows.length;
          for (var i = 0; i < len; i++) {
            var item =
              '<ons-list-item tappable modifier="longdivider" onclick="enter(' + "'" + results.rows.item(i).ncode + "'" + ')">' +
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

function getChapters(ncode) {
  var db = openDB();
  db.transaction(
    function (tx) {
      tx.executeSql('SELECT * FROM ' + ncode + 'Table', [],
        function (tx, results) {
          console.log('select success');
          var len = results.rows.length;
          for (var i = 0; i < len; i++) {
            var item =
              '<ons-list-item tappable modifier="longdivider">' +
              '<dl class="searchResultItem">' +
              '<dt class="titleItem">' + results.rows.item(i).subtitle + '</dt>' +
              '<dt class="wnameItem">更新日:' + results.rows.item(i).date + '</dt>' +
              '</dl>' +
              '</ons-list-item>';
            $('#chapter_list').append(item);
          }
        },
        errorHandler);
    });
}
