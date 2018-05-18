(function(){
  var list = [];
  $('.novellist').each(function(i,elm){
    var detail = {};
    detail.html = $(elm).html();
    detail.title = $(elm).find('li.title').text();
    //detail.url = $(elm).find('li.title').attr('href');
    detail.wname = $(elm).find('li:eq(1)').text().split('：')[1].trim();
    detail.stories = $(elm).find('li:eq(2)').text().split('／')[0].trim();
    detail.attention = $(elm).find('li.attention').text().split('：')[1].trim();
    detail.date = $(elm).find('li.date').text().split('：')[1].trim();
    detail.detail = $(elm).find('li.ex').text();
    detail.keyword = [];
    $(elm).find('li.keyword a').each(function(idx, elem){
      detail.keyword.push($(elem).text());
    });
    detail.ncode = $(elm).find('ul li:eq(1)').text().split('：')[1].trim();
    detail.follower = $(elm).find('ul li:eq(4)').text().split('：')[1].trim();
    detail.pt = $(elm).find('ul li:eq(5)').text().split('：')[1].trim();
    detail.bookmark = $(elm).find('ul li:eq(6)').text().split('：')[1].trim();
    list.push(detail);
  });
  return list;
})();