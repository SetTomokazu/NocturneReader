//Device Ready
document.addEventListener('deviceready', function () {
  openUrl(noc.urlTop);
  initDB();
});

// 画面表示開始
document.addEventListener('init', function (event) {
  var page = event.target;
  console.log('init ' + page.id);
  switch (page.id) {
    case 'main':
      //$('#book_list').html="";
      //getBooks();
      break;
    case 'detail':
      //getChapters(page.data.ncode);
      break;
    case 'page':
      getText(page.data.ncode, page.data.id);
      break;
    default:
      // 何もしない
      break;
  }
});

//画面表示
document.addEventListener('show', function (event) {
  var page = event.target;
  switch (page.id) {
    case 'main':
      getBooks();
      break;
    case 'detail':
      getChapters(page.data.ncode);
      break;
    default:
      // 何もしない
      break;
  }
});


//画面非表示
document.addEventListener('hide', function (event) {
  //var page = event.target;
  //console.log('show ' + page.id);
});

//画面破棄
document.addEventListener('destroy', function (event) {
  //var page = event.target;
  //console.log('show ' + page.id);
});
