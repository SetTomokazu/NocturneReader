// This is a JavaScript file

// ローカルストレージをセットします。
function localStorageSetItem() {
  var obj = { url: "https://monaca.io"}
  localStorage.setItem(KEY, JSON.stringify(obj));
  alert("Local Storage: データーをセットしました。")
}
// ローカルストレージの値を取得します。。
function localStorageGetItem() {
  var item = localStorage.getItem(KEY);
  var obj = JSON.parse(item);
  document.getElementById("content").innerHTML = "url: " + obj.url;
}
// ローカルストレージの指定されたキー名のデータを消去します。
function localStorageRemoveItem() {
  localStorage.removeItem(KEY);
  document.getElementById("content").innerHTML = "";
}
// ローカルストレージの全データを消去します。
function localStorageClear() {
  localStorage.clear();
  document.getElementById("content").innerHTML = "";
}
// ローカルストレージ操作関連
util = {
  getItems: function() {
    var items = localStorage.getItem('my_items');
    if(items !== null) {
      return JSON.parse(items);
    } else {
      return [];
    }
  },
  getItem: function(index) {
    var items = this.getItems();
    return items[index];
  },
  addItem: function(memo) {
    var items = this.getItems();
    items.unshift(memo);
    localStorage.setItem('my_items', JSON.stringify(items));
  },
  changeItem: function(index, memo) {
    var items = this.getItems();
    items[index] = memo;
    localStorage.setItem('my_items', JSON.stringify(items));
  },
  removeItem: function(index) {
    var items = this.getItems();
    items.splice(index, 1);
    localStorage.setItem('my_items', JSON.stringify(items));
  }
};