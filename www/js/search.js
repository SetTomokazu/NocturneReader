
var noc = {
  urlEnter: 'https://noc.syosetu.com/',
  urlTop: 'https://noc.syosetu.com/top/top/',
  urlSearch: 'https://noc.syosetu.com/search/search/search.php?',
  urlBook: 'https://novel18.syosetu.com/',
};

var browser = undefined;
var isLoading = false;
var requestUrl = [];
var loadingUrl = '';

function openUrl(url) {
  if(browser == undefined) {
    isLoading = true;
    loadingUrl = url;
    browser = window.open(loadingUrl,'_blank', 'hidden=yes');
    with(browser){
      addEventListener('loadstop', loadStopCallback);
      addEventListener('loadstop', urlLoadStopCallback);
    }
  } else {
    if(url != ''){
      requestUrl.push(url);
    }
    if(isLoading){
      console.log("queue " + url);
      //まだ何もしない
    } else {
      if(requestUrl.length > 0){
        loadingUrl = requestUrl.shift();
        isLoading = true;
        browser.executeScript( {code: '(function(){window.location.href = "' + loadingUrl + '";})()'}, function(){});
      }
    }
  }
}

function urlLoadStopCallback(event) {
  //console.log( 'request\t:' + loadingUrl + '\ncurrent\t:' + event.url);
  console.log( 'current\t:' + event.url);
  if(loadingUrl === '') {
    isLoading = false;
  } else {
    if(event.url === loadingUrl) {
      if(requestUrl.length > 0){
        loadingUrl = requestUrl.shift();
        browser.executeScript( {code: '(function(){window.location.href = "' + loadingUrl + '";})()'}, function(){});
      } else {
        loadingUrl = '';
        isLoading = false;
      }
    } else {
      browser.executeScript( {code: '(function(){window.location.href = "' + loadingUrl + '";})()'}, function(){});
    }
  }
}

function loadStopCallback(event) {
  if(event.url === noc.urlEnter) {
    //年齢確認画面の場合YESを押して入場する
    browser.executeScript({ code: "$('#yes')[0].click();" }, function(){});
  } else if(event.url.indexOf(noc.urlSearch) !== -1) {
    //検索結果画面なので解析する
    browser.executeScript({
      code: getSearchResultsCode
    }, showSearchResults);
  } else if(event.url.indexOf(noc.urlBook) !== -1) {
    var suburl = event.url.replace(noc.urlBook, '');
    var count = suburl.split('/').length - 1;
    if(count == 1) {
      browser.executeScript({
        code: getBookDetailCode
      }, function(data){
        addBook(data[0]);
        for(var i in data[0].list) {
          openUrl(noc.urlBook + data[0].list[i].url);
        }
      });
    } else if(count == 2) {
      browser.executeScript({
        code: getStoryDetailCode
      }, function(data){
        updatePage(data[0]);
      });
    } else {
      //ありえないはず
    }
  } else {
    //他は未作成
  }
}

function search() {
  searchResultsList = [];
  $('#result_list').html('');
  $('#modal').show();
  openUrl(createSearchURL());
}

var getSearchResultsCode = `
  (function(){
    var result = {};
    result.searchdate = $('.searchdate_box').text();
    result.list = [];
    result.has_next = ($('a.nextlink')[0] === null) ? false : true;
    result.html = $('body').html();
    $('.novellist').each(function(i,elm){
      var detail = {};
      detail.html = $(elm).html();
      detail.title = $(elm).find('li.title').text();
      detail.url = $(elm).find('li.title').attr('href');
      detail.wname = $(elm).find('li:eq(1)').text().split('：')[1].trim();
      detail.stories = $(elm).find('li:eq(2)').text().split('／')[0].trim();
      detail.attention = $(elm).find('li.attention').text().split('：')[1].trim();
      var d = new Date($(elm).find('li.date').text().split('：')[1].trim());
      detail.date = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
      detail.detail = $(elm).find('li.ex').text();
      detail.keyword = [];
      $(elm).find('li.keyword a').each(function(idx, elem){
        detail.keyword.push($(elem).text());
      });
      detail.ncode = $(elm).find('ul li:eq(1)').text().split('：')[1].trim();
      detail.follower = $(elm).find('ul li:eq(4)').text().split('：')[1].trim();
      detail.pt = $(elm).find('ul li:eq(5)').text().split('：')[1].trim();
      detail.bookmark = $(elm).find('ul li:eq(6)').text().split('：')[1].trim();
      result.list.push(detail);
    });
    return result;
  })();
  `;

var getBookDetailCode = `
  (function(){
    var result = {};
    //result.html = $('body').html();
    var suburl = location.href.replace("https://novel18.syosetu.com/", "");
    result.ncode = suburl.split('/')[0];
    result.title = $('div.novel_title').text();
    result.wname = $('div.novel_writername').text().split('：')[1].trim();
    result.ex = $('div.novel_ex').text();
    result.list = [];
    var chapter = "";
    $('.novel_sublist li').each(function(i,elm){
      var page = {};
      if( $(elm).hasClass('chapter') ){
        chapter = $(elm).text();
      }else{
        page.chapter = chapter;
        page.subtitle = $(elm).find('a').text();
        page.url = $(elm).find('a').attr('href').substr(1);
        page.index = page.url.split('/')[1];
        var datetext = $(elm).find('span.kaikou').text().trim();
        page.hasChange = (datetext.indexOf("改稿") !==-1);
        if(page.hasChange) {
          datetext = datetext.split('（')[1].split(' ')[0];
        }
        var d = new Date(datetext.trim());
        page.date = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
        result.list.push(page);
      }
    });
    return result;
  })();
  `;

var getStoryDetailCode = `
  (function(){
    var result = {};
    var suburl = location.href.replace("https://novel18.syosetu.com/", "");
    result.html = $('body').html();
    result.ncode = suburl.split('/')[0];
    result.index = suburl.split('/')[1];
    result.subtitle = $('.novel_subtitle').text().trim();
    result.header = $('#novel_p').html().trim();
    result.body = $('#novel_honbun').html().trim();
    return result;
  })();
  `;

function showSearchResults(data) {
  console.log(data[0].has_next);
  for(let item of data[0].list) {
    $('#result_list').append(createSearchResultItem(item));
  }
  if(data[0].has_next) {
    $('#result_list').append(createSearchNextItem());
  }
  $('#modal').hide();
}

function createSearchURL() {
  var baseurl = noc.urlSearch;
  baseurl += 'word=' + encodeURIComponent($('#word')[0].value.replace(/　/g, " ").trim().replace(/ /g, "+"));
  baseurl += '&notword=' + encodeURIComponent($('#notword')[0].value.replace(/　/g, " ").trim().replace(/ /g, "+"));
  baseurl += '&title=' + ($('#title')[0].checked ? $('#title')[0].value : "");
  baseurl += '&ex=' + ($('#ex')[0].checked ? $('#ex')[0].value : "");
  baseurl += '&keyword=' + ($('#keyword')[0].checked ? $('#keyword')[0].value : "");
  baseurl += '&wname=' + ($('#wname')[0].checked ? $('#wname')[0].value : "");
  baseurl += '&order=' + $('#order')[0].value;
  baseurl += '&type=' + $('#type')[0].value;
  return baseurl;
}

function createSearchResultItem(item) {
  var result =
    '<ons-list-item tappable modifier="longdivider" onclick="downloadStories(' + "'" + item.ncode + "'" + ')">' +
      '<dl class="searchResultItem">' + 
        '<dt class="titleItem">' + item.title + '</dt>' +
        '<dt class="wnameItem">作者:' + item.wname + '</dt>' +
        '<dt class="storyItem">' + item.stories + '</dt>' +
        '<dt class="wnameItem">最終更新日:' + item.date + '</dt>' +
        '<dt>' +
          '<details>' +
            '<summary>あらすじ</summary>' +
              item.detail +
          '</details>' +
        '</dt>' +
      '</dl>' +
    '</ons-list-item>';
   return result;
}

function createSearchNextItem() {
  var result = 
    '<ons-list-item tappable modifier="longdivider" onclick="searchNext()">' +
      '<label>' + '次を表示する' + '</label>' +
    '</ons-list-item>';
  return result;
}

function searchNext() {
  $('#result_list ons-list-item').filter(':last').remove();
  $('#modal').show();
  browser.executeScript({code: "$('a.nextlink')[0].click();"}, function(){});
}

function getLocaleString(date) {
  var d = new Date(date);
  return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
}

function downloadStories(url) {
  console.log(noc.urlBook + url.toLowerCase() +'/');
  openUrl(noc.urlBook + url.toLowerCase() +'/');
}
