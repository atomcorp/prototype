jQuery(document).ready(function($) {


(function swapImage() {
	$('.navigation__product-categories li').hover(function(event) {
		event.preventDefault();
		var $this = $(this);
		$this.find('img').attr('src', '/source/img/examples/wireframe-yel.svg');
	}, function() {
		var $this = $(this);
		$this.find('img').attr('src', '/source/img/examples/wireframe.svg');
	});
})();

(function showMenu() {
	$('.hamburger').on('click', function(event) {
		event.preventDefault();
		$('.header__mobile-collapse').toggleClass('mobile-menu');
	});
})();
	
(function menu() {

	var $linkList = $('.navigation__item--parent');
	var $dropDownItems = $('.navigation__product-categories');
	var $fullscreenDestination = $('.dropdown-menu-location__fullscreen');
	var $smallScreenDestination = '';
	$dropdownHanger = $('.dropdown-menu__hidden');
	var removed = '';
	$linkList.on('click', $dropDownItems, function(event) {
		event.preventDefault();
		var $this = $(this);
		var windowWidth = $(window).width();
		var ifAlreadySlected = 0;
		if (!$this.hasClass('navigation-selected')) {
			// remove selected from everywhere
			$this.siblings().removeClass('navigation-selected');
			// remove a detach $fullscreenDestination if necesary
			if (windowWidth > 768) {
				removed = $fullscreenDestination.find('.navigation__product-categories').detach();
				$dropdownHanger.append(removed);
			} else {
				removed = $this.siblings().find('.navigation__product-categories').detach();
				$dropdownHanger.append(removed);
			}
			$this.addClass('navigation-selected');
			var target = $this.attr("button"); // get button attr value
			// look for correct dropdown in either hidden hanger or other Links
			var dropdown = $dropdownHanger.find($('[dropdown="' + target + '"]'));
			// cut and paste dropdown in viewable location (depending on screen size) 
			var display = dropdown.detach();
			// test screen size
			if (windowWidth > 769) {
				display.prependTo($fullscreenDestination);
			} else {
				display.appendTo($this);
			}

		} else {
			$this.removeClass('navigation-selected');
			if (windowWidth > 768) {
				removed = $fullscreenDestination.find('.navigation__product-categories').detach();
				$dropdownHanger.append(removed);
			} else {
				removed = $this.find('.navigation__product-categories').detach();
				$dropdownHanger.append(removed);
			}
		}
		
		// add 'selected' calss to button when clicked (or if it already has one remove that and ignore)
		// if thingy has slected move the html up else move it back down
		// got to check for sizes as well 
	});

	// Resize checks
	var resizeTimer;
	var originalWidth = $(window).width();
	$(window).on('resize', function(e) {
	  	clearTimeout(resizeTimer);
	  	resizeTimer = setTimeout(function() {
	  		var newWidth = $(window).width();
			if (originalWidth >= 768 && newWidth <= 767 ) {
				// screen was monitor then became mobile
				// detach from $fullscreenDestination
				$linkList.removeClass('navigation-selected');
				removed = $fullscreenDestination.find('.navigation__product-categories').detach();
				$dropdownHanger.append(removed);
			} else if (originalWidth <= 767 && newWidth >= 768 ) {
				// screen was mobile then became big
				// detach from $fullscreenDestination
				$linkList.removeClass('navigation-selected');
				removed = $linkList.find('.navigation__product-categories').detach();
				$dropdownHanger.append(removed);
			}		// after business make new width original
			originalWidth = newWidth;
	  }, 250);
	});

})();


// Do More Links bit
(function moreLinks() {
	var $buttons = $('li.icon-link');
	var $dropDownList = $('.more-links__dropdowns');
	var $dropDownItems = $('.more-links__dropdown');
	var existingTarget = '';
	$buttons.on('click', function(event) {
		event.preventDefault();
		var $this = $(this);
		var target = $this.attr("button"); // get attribute
		var dropDown = $dropDownList.find($('[dropdown="' + target + '"]')); // get right dropdown item
		// add show onto target
		// remove show from every target
		// except if target already has show, in which case remove
		if (!dropDown.hasClass('show')) {
			$dropDownItems.removeClass('show');
			dropDown.addClass('show');
		} else {
			dropDown.removeClass('show');
		}
	});
})();

// Parallax

$(window).bind('scroll',function(e){
	parallaxScroll();
});

function parallaxScroll(){
	var scrolledY = $(window).scrollTop();
	$('.hero-image').css('margin-top','-'+((scrolledY*2))+'px');
	$('.get-closer').css('margin-top','-'+((scrolledY*0.4))+'px');
}

parallaxScroll();
	
});