app.directive('tabHighlight', function(){
	return{
			  restrict: 'A',
			  link: function (scope, element) {
			    // Here is the major jQuery usage where we add the event
			    // listeners mousemove and mouseout on the tabs to initalize
			    // the moving highlight for the inactive tabs
			    var x, y, initial_background = '#e6e6e6';

			    element
			      .removeAttr('style')
			      .mousemove(function (e) {
			        // Add highlight effect on inactive tabs
			        if(!element.hasClass('active'))
			        {
			          x = e.pageX - this.offsetLeft;
			          y = e.pageY - this.offsetTop;

			          // Set the background when mouse moves over inactive tabs
			          element
			            .css({ background: '-moz-radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,190,0.8) 0px, rgba(255,255,190,0.0) 45px), ' + initial_background })
			            .css({ background: '-webkit-radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,190,0.8) 0px, rgba(255,255,190,0.0) 45px), ' + initial_background })
			            .css({ background: 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,190,0.8) 0px, rgba(255,255,190,0.0) 45px), ' + initial_background });
			        }
			      })
			      .mouseout(function () {
			        // Return the inital background color of the tab
			        element.removeAttr('style');
			      });
			  }
	};
});