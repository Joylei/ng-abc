var app = angular.module('app', []);
app.controller('PPTCtrl',
  ['$scope','$http','$log','$timeout','PPTStore',
    function($scope, $http, $log, $timeout, PPTStore){
      $log.log('PPTCtrl instantiated');

      function setupPPT(source){
        var slideshow = remark.create({
          source: source
          //,highlightStyle: 'monokai'
        });
        $log.log('PPT initialized');
      }

      $scope.state = { loading: true, error:false };

      $scope.hideLoading = function(){

        $scope.$evalAsync(function(){
          $scope.state.loading = false;
        });
      };
      $scope.showError = function(err){
        $scope.state.loading = false;
        $scope.state.error = err || 'Something is wrong!';
      };

      function init(){
        $log.log('PPTCtrl.init()');

        PPTStore.fetch().then(function(data){
          $log.log('PPT Data fetched');

          //setupPPT(res.data);
          $scope.hideLoading();

          //delay to wait the angular $digest complete
          $timeout(function(){
            setupPPT(data);
          }, 250);
        },function(err){
          $log.log('Error:', err);

          $scope.showError('Something is wrong, please try again later!');
        });
      }

      init();//initialize
}]);

app.service('PPTStore', ['$http','$log',function($http, $log){
  $log.log('PPTStore instantiated');
  var PPTURL = "./ppt.md";

  this.fetch = function(){
    $log.log('PPTStore.fetch() called');
    return $http.get(PPTURL).then(function(res){
      return res.data;
    });
  };
}]);

app.service('Utils',[function(){

  this.resolveUrl = (function(){
    var img = document.createElement('img');

    return function qualifyURL(url){
      img.src = url; // set string url
      url = img.src; // get qualified url
      img.src = null; // no server request
      return url;
    };
  })();
}]);

app.directive('pptPreview',
  ['$document','$window','$log', 'Utils',
    function($document, $window,$log, Utils){
      $log.log('pptPreview instantiated');
      var KEY_ESC = 27;

      function link(scope, element, attr){
        $log.log('pptPreview linking');

        var $preview = null;

        function hidePreview(){
          if($preview){
            $preview.addClass('hidden');
          }
        }

        function showPreview(url){
          if(/examples/.test(url)){
            //invalid caches
            var fullUrl = Utils.resolveUrl(url);
            url = './liveeditor/?' + decodeURIComponent(fullUrl);
          }

          if(!$preview){
            $preview = $('.preview');

            $preview.find('a.close').on('click', function(e){
              e.preventDefault();
              hidePreview();
            });
          }
          $log.log($preview);
          $preview.find('a.new').attr('href', url);
          $preview.find('iframe').attr('src', url);
          $preview.removeClass('hidden');
          $log.log('preview show');
        }

        function clickHandler(e){
          var $el = $(this);
          if($el.hasClass('close') || $el.hasClass('new')){
            return;
          }

          e.preventDefault();
          //$log.log($el);
          var url = $el.attr('href');
          $log.log("preview url: ", url);
          showPreview(url);
        }

        function keypressHandler(e){
          $log.log(e);
          if(e.keyCode === KEY_ESC){
            e.preventDefault();
            hidePreview();
            $log.log('preview hide');
          }
        }

        //hook the click event
        $(document).on('click', 'a', clickHandler)
          .on('keypress',keypressHandler);

        //clean on element destroy
        element.on('$destroy',function(){
          //unhook the events
          $document.off('click', clickHandler)
            .off('keypress', keypressHandler);

          if($preview){
            $preview.remove();
          }
          $log.log('preview destroy');
        });

        $log.log('pptPreview linked');
      }
      return {
        restrict: 'ACE',
        scope : {
        },//new scope
        link:link
      };
}]);
