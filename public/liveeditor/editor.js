angular.module('app.editor', [])
  .directive('liveEditor', ['$http', '$log', function($http, $log) {
    function handleError(err) {
      $log.error('err:', err);
    }

    function debounce(fn, delay) {
      var timer = null;
      return function() {
        var context = this,
          args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
          fn.apply(context, args);
        }, delay);
      };
    }

    function view($iframe, html) {
      $log.log('preview content');

      //write after doc cleared
      $iframe.off('load').on('load',function(){
        var doc = this.contentWindow ||
          this.contentDocument.document ||
          this.contentDocument;

        try {
          doc.document.open();
          doc.document.write(html);
        } catch (err) {
          handleError(err);
        } finally {
          doc.document.close();
        }
      });
      //clear doc by reload blank page
      $iframe.attr('src', 'about:blank');
    }

    function link($scope, $element, $attrs, $ctrl) {
      var editor = ace.edit($element.find('section')[0]),
        $preview = $element.find('iframe'),
        doc = editor.getSession();

      editor.setTheme('ace/theme/monokai');
      doc.setMode('ace/mode/html');
      doc.setTabSize(2);
      editor.session.setUseWorker(false);

      doc.on('change', debounce(function(){
        $log.log('editor doc changed');
        view($preview, doc.getValue());
      }, 500));

      //reload content after souce changed
      $scope.$watch('source', function(src) {
        $log.log('editor load src:' + src);
        if (src) {
          $http.get(src).then(function(res) {
            doc.setValue(res.data || '');
          }, handleError);
        }
      });
    }
    return {
      scope: {
        source: '='
      },
      templateUrl: 'editor.html',
      link: link
    };
  }]);
