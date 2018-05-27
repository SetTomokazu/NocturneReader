// 起動時の処理
document.addEventListener('init', function(event) {
  var page = event.target;
  console.log('init ' + page.id);
  if(page.id == 'home'){
    getBooks();
  }
});

document.addEventListener('show', function(event) {
  var page = event.target;
  console.log('show ' + page.id);
});
