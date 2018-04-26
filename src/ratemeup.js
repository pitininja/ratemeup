(function($) {

	//data
	var Data = {

		//default options data
		default: {
			//
		}, 

		//parse input number element data
		parse: function($input) {
			//default values
			var defaults = {
				min: 1, 
				max: 5, 
				step: 1
			};
			//parse input data
			var inputData = {};
			['min','max','step'].forEach(function(attr) {
				if(Tools.hasAttr($input, attr)) {
					inputData[attr] = parseFloat($input.attr(attr));
				}
			});
			//extend input data with default values
			return $.extend(true, {}, defaults, inputData);
		}, 

		//control input data integrity
		control: function(data) {
			//control min and max integer type
			['min','max'].forEach(function(type) {
				if(!Number.isInteger(data[type])) {
					Tools.error(type+' must be an integer');
					return false;
				}
			});
			//control step
			if(!Number.isInteger(data.step) && data.step !== 0.5 && data.step !== 0.25) {
				Tools.error('step must be an integer or equal to 0.5 or 0.25');
				return false;
			}
			//if controls are ok return true
			return true;
		}

	};

	//methods
	var Methods = {

		//initialization
		init: function(opts) {
			var $input = $(this);
			//settings provided by user
			var settings = $.extend(true, {}, Data.defaults, opts);
			//element type control
			if(!$input.is('input[type="number"]')) {
				Tools.error('target element must be an input number', this);
				return;
			}
			//parse input data
			var data = Data.parse($input);
			//data control
			if(Data.control(data)) {
				//build plugin elements
				var $built = Engine.build($input, data);
				//attach input element to built element
				$built.data('ratemeup-input', $input);
				//attach built element to input element
				$input.data('ratemeup-element', $built);
				//hide original element and append built element
				$input.hide().after($built);
				//bind controls
				Engine.bind($built);
			}
		}, 

		//clear
		clear: function() {
			Engine.clear($(this).data('ratemeup-element'));
		}, 

		//destroy
		destroy: function() {
			//
		}

	};

	//engine
	var Engine = {

		//build rating element
		build: function($input, data) {
			//container
			var $container = $('<div class="ratemeup ratemeup-container"></div>');
			//set input data
			$container
				.attr('data-min', data.min)
				.attr('data-max', data.max)
				.attr('data-step', data.step);
			//vars for outer loop
			var outerMin = data.min;
			var outerMax = data.max;
			var outerStep = data.step;
			var innerCount = 1;
			if(outerStep < 1) {
				innerCount = 1 / outerStep;
				outerStep = 1;
			}
			//current rate value
			var currentVal = data.min;
			//outer loop
			for(var i=outerMin;i<outerMax;i+=outerStep) {
				//build rate element and append to container
				var $outer = $('<div class="ratemeup-outer"></div>');
				//inner loop
				for(var j=0;j<innerCount;j++) {
					//increment current value
					currentVal += data.step;
					//build inner and append to outer
					$('<div class="ratemeup-inner"></div>')
						.attr('data-value', currentVal)
						.appendTo($outer);
				}
				//append outer to container
				$container.append($outer);
			}
			//insert clear button
			$container.append($('<div class="ratemeup-clear">&#x2716;</div>'));
			//return built element
			return $container;
		}, 

		//clear rate value
		clear: function($el) {
			var $input = $el.data('ratemeup-input');
			var $inners = $el.find('.ratemeup-inner');
			var minValue = $el.attr('data-min');
			//clear input value
			$input.val(minValue);
			//remove active class from inners
			$inners.removeClass('active');
			//remove value set class
			$el.removeClass('ratemeup-set');
		}, 

		//bind plugin element controls
		bind: function($el) {
			var $inners = $el.find('.ratemeup-inner');
			//mouseenter for inner hover
			$inners.off('mouseenter.ratemeup').on('mouseenter.ratemeup', function() {
				//set target inner and inners before it as hovered
				Engine.setInnerClass($(this), 'hovered');
			});
			//mouseleave for inner hover
			$el.off('mouseleave.ratemeup').on('mouseleave.ratemeup', function() {
				//remove hovered class from all inners
				$(this).find('.ratemeup-inner').removeClass('hovered');
			});
			//click on inner to rate
			$inners.off('click.ratemeup').on('click.ratemeup', function() {
				var $inner = $(this);
				var $container = $inner.closest('.ratemeup-container');
				var $input = $container.data('ratemeup-input');
				//get clicked inner value
				var innerValue = parseFloat($inner.attr('data-value'));
				//set input value
				$input.val(innerValue);
				//value set class
				$container.addClass('ratemeup-set');
				//set target inner and inners before it as hovered
				Engine.setInnerClass($inner, 'active');
			});
			//click on clear icon
			$el.find('.ratemeup-clear').off('click.ratemeup').on('click.ratemeup', function() {
				Engine.clear($(this).closest('.ratemeup-container'));
			});
		}, 

		//set class to target inner and all inners before it
		setInnerClass: function($inner, innerClass) {
			//all inner elements
			var $inners = $inner.closest('.ratemeup-container').find('.ratemeup-inner');
			//get hovered inner index in inners stack
			var innerIndex = $inners.index($inner);
			var sliceIndex = innerIndex + 1;
			//set target inner and inners before it as hovered
			$inners
				.removeClass(innerClass)
				.slice(0, sliceIndex)
				.addClass(innerClass);
		}

	};

	//tools
	var Tools = {

		//throws error in console
		error: function(message, element) {
			console.error('RateMeUp | '+Tools.ucfirst(message));
			if(typeof element !== 'undefined') {
				console.log(element);
			}
		}, 

		//ucfirst
		ucfirst: function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}, 

		//check if element has target attribute
		hasAttr: function($el, attr) {
			return $el[0].hasAttribute(attr);
		}

	};

	//handler for plugin calls
	$.fn.ratemeup = function(methodOrOpts) {
		//stop right away if targeted element empty
		if(this.length < 1) { return; }
		//call method
		if(Methods[methodOrOpts]) {
			//remove method name from call arguments
			var slicedArguments = Array.prototype.slice.call(arguments, 1);
			//call targeted mathod with arguments
			return Methods[methodOrOpts].apply(this, slicedArguments);
		}
		//call init
		else if(typeof methodOrOpts === 'object' || !methodOrOpts) {
			//call init with arguments
			return Methods.init.apply(this, arguments);
		}
		//error
		else {
			Tools.error('wrong call', this);
		}
	};

})(jQuery);