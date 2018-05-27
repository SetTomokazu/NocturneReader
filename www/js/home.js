// 起動時の処理
document.addEventListener('init', function(event) {
  var page = event.target;
  console.log('init ' + page.id);
  if(page.id == 'main'){
    getBooks();
  } else if(page.id == 'detail') {
    getChapters(page.data.ncode);
  } else {
    //何もしない
  }
});

document.addEventListener('show', function(event) {
  //var page = event.target;
  //console.log('show ' + page.id);
});


function enter(ncode){
  var content = document.getElementById('mainNavigator');
  content.pushPage('detail.html', {data: {ncode: ncode}});
}