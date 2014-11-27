angular.module('foodscan.services', [])

.factory('Articles', function($http, $location, $ionicLoading, _) {
  
  var url = "http://fsserver.kspri.se/api/get/article";
  var articles = [];
  
  return {

    goTo: function(gtin) {
      $ionicLoading.show();
      gtin = gtin.toString();
      while(gtin.length < 14) {
        gtin = "0" + gtin;
      }

      var exists = _.find(articles, function(obj) {
        return obj.dabas.GTIN === gtin;
      })
      if(exists) {
        $ionicLoading.hide();
        return $location.path("/app/article/"+gtin)
      }

      $http.get(url + '?gtin=' + gtin)
      .success(function(data, status) {
        articles.push(data);
        if(status !== 200) {
          $ionicLoading.hide()
          return alert("Ingen artikel hittades.")
        }
        $location.path("/app/article/"+gtin)
      })
      .error(function(status, data) {
        $ionicLoading.hide();
        return alert("Ingen artikel hittades.")
      });
    },

    getArticle: function(gtin, callback) {
      var article = _.find(articles, function(obj) {
        return obj.dabas.GTIN === gtin;
      })
      if(!article)
        return callback("error", null);

      return callback(null, article);
    }
  }
})

.factory('Labels', function() {
  var labels = {
    
  }

})

.factory('ArticleList', function($http, $location, $ionicLoading, _) {

  var original = JSON.parse(window.localStorage.getItem('original')) || [];
  var result = [];

  return {

    setOriginal: function(articles) {
      original = articles;
    },

    getOriginal: function() {
      return original;
    },

    set: function(articles) {
      result = articles;
    },

    get: function(offset, limit) {
      return result.slice(offset, offset+limit);
    },

    total: function() {
      return result.length;
    },

    reset: function() {
      result = original;
    },

    goTo: function(url) {
      $ionicLoading.show();
      $http.get(url)
      .success(function(data, status) {
        /// TA BORT DET HÄR FILTRET
        data = _.filter(data, function(obj) {
          return obj.dabas.productcode !== null;
        })
        data = _.filter(data, function(obj) {
          return obj.dabas.productcode.length > 1;
        })

        
        original = data;
        window.localStorage.setItem('original', JSON.stringify(original));
        $location.path("app/articlelist");
        $ionicLoading.hide();
      })
      .error(function(data, status) {
        $ionicLoading.hide();
        $ionicNavBarDelegate.back();
      })
    }
  }
});