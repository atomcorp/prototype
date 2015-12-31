jQuery(document).ready(function($) {

var bootstrapWidth = 768; // When width turns from fluid to fixed

// easy console log
function c(string) {
	var x = console.log(string);
	return x;
}

// Global check WIDTH !!!!!!!!!!!!!!!!!!!!!!!! Not Height
function checkHeight(windowWidth) { // this should be Width not height :/
	if (windowWidth >= bootstrapWidth) {
		return true;
	} else if (windowWidth < bootstrapWidth) {
		return false;
	}
}

// View Menu on Mobile Devices 
(function showMobileMenu() {
	$('.hamburger').on('click', function(event) {
		event.preventDefault();
		// this is because 'display: block' messes up large screen mode
		$('.header__mobile-collapse').toggleClass('show-inline-block');
		// this adds overflow for scrolling
		$('.header').toggleClass('mobile-scroll');
		if ($('.header').hasClass('mobile-scroll')) {
			// add event listener
			$('.header').on('click', function(event) {
				event.preventDefault();
				var count = $('.header-background').outerHeight() + $('.header__mobile-collapse').outerHeight() + $('.more-links').outerHeight();
				$('body').css({
					'overflow': 'hidden',
					'max-height': count
				});
			});
		} else {
			// removes event listener
			$('.header').off();
			$('body').attr('style', '');
		}
	});

})();

// Navigation Menu Functionality
(function dropDownMenu() { // New
	var $menu = $('.navigation__item--parent'); // this gets clicks
	var $dropdown = $('.dropdown-menu__hidden'); // this gets picked

	var dropdownClass = 'navigation__product-categories';
	

	// Main Logic when user clicks a link
	$menu.on('click', function(event) {
		event.preventDefault();
		var $this = $(this);
		var target = $this.attr("button");
		var windowWidth = window.innerWidth;

		// check clicked status of item
		if ($this.hasClass('selected')) { 
			// hide this submenu
			hideDropdown(checkHeight(windowWidth), true);
		} else if ($this.siblings().hasClass('selected')) {
			// hide other dropdown (not by slideUp)
			hideDropdown(checkHeight(windowWidth), false);
			// add selected  to this
			$this.addClass('selected');
			// show this dropdown
			// var dropdown = getDropdown(target);
			displayDropdown($this, getDropdown(target), checkHeight(windowWidth), false);
		} else {
			// add selected to this
			$this.addClass('selected');
			// find related dropdown 
			// var dropdown = getDropdown(target);
			// display dropdown
			displayDropdown($this, getDropdown(target), checkHeight(windowWidth), true);
		}
	});

	// HELPER FUNCTIONS
	function getDropdown(target) {
		var dropdown = $dropdown.find($('[dropdown="' + target + '"]'));
		return dropdown;
	}
	
	function displayDropdown(menu, dropdown, largeScreen, doAnimate) {
		// todo: check screen size ; add animation
		if (largeScreen) {
			if (doAnimate) {
				animateDropdown(dropdown, largeScreen, 'up');
			} else {
				var dropdownHeight = "-"+dropdown.height()+"px";
				dropdown.css('bottom', dropdownHeight).addClass('show');
			}
		} else {
			// copy dropdown, place under relevant category and show

			dropdown.clone().insertAfter(menu).show();
			// todo: add animation for submenus to appear/disappear
			// var replacedDropdown = dropdown.clone().insertAfter(menu).slideDown({
			// 	duration: 700,
			// 	method: 'easeInOutCubic'
			// });
			// animateDropdown(replacedDropdown, largeScreen);
		}
	}

	// Hide the sub-menu
	function hideDropdown(largeScreen, doAnimate) {
		// if large screen - hide all divs in .dropdown-menu__hidden
		if (doAnimate) {
			if (largeScreen) {
				animateDropdown($dropdown.children(), largeScreen, 'down');
				// 
			} else if (!largeScreen) {
				// if small remove dropdown under .selected
				$menu.siblings('.navigation__product-categories').remove();
			}
		} else {
			if (largeScreen) {
				$dropdown.children().removeClass('show').attr('style','');
				// 
			} else if (!largeScreen) {
				// if small remove dropdown under .selected
				$menu.siblings('.navigation__product-categories').remove();
			}
		}
		$menu.removeClass('selected');

	}

	function animateDropdown(dropdown, largeScreen, direction) {
		// see http://easings.net/ for easing examples
		var dropdownHeight = '';
		if (largeScreen) {
			if (direction === 'up') {
				dropdownHeight = "-"+dropdown.height()+"px";
				dropdown.addClass('show');
				dropdown.animate({
					bottom: dropdownHeight
				}, 400, 'easeOutSine');
			} else if (direction === 'down') {
				dropdown.remove('show');
				dropdown.animate({
					bottom: 0
				}, 400, 'easeOutSine');
			}
		} else {
			dropdown.addClass('show');
		}
	}

	// This checks whether the user has resized the window
	// If moved from mobile to desktop (& vice-versa)
	// resets menus to provent weirdness
	var resizeTimer;
	var originalWidth = $(window).width();
	$(window).on('resize', function(e) {
	  	clearTimeout(resizeTimer);
	  	resizeTimer = setTimeout(function() {
	  		var newWidth = $(window).width();
	  		var minorResize = true; // resize 
			if (originalWidth >= 768 && newWidth <= 767 ) { // was big, now small 
				hideDropdown(checkHeight(originalWidth), false);
				minorResize = false;
			} else if (originalWidth <= 767 && newWidth >= 768 ) { // was small, now big
				$('.header__mobile-collapse').removeClass('show-inline-block');

				hideDropdown(checkHeight(originalWidth), false);
				minorResize = false;
			}
			// after business make new width original
			originalWidth = newWidth;
	  }, 100);
	});

})();


// Do More Links bit
(function moreLinks() {
	var $buttons = $('li.icon-link');
	var $dropdownList = $('.more-links__dropdowns');
	var $dropdownItems = $('.more-links__dropdown');
	var $menu = $('.more-links');
	var existingTarget = '';
	$buttons.on('click', function(event) {
		event.preventDefault();
		var $this = $(this);
		var target = $this.attr("button"); // get attribute
		var dropdown = $dropdownList.find($('[dropdown="' + target + '"]')); // get right dropdown item
		var dropdownHeight = '';
		var menuHeight = '';
		var windowWidth = window.innerWidth;
		// add show onto target
		// remove show from every target
		// except if target already has show, in which case remove
		
		if (!dropdown.hasClass('show')) {
			$dropdownItems.removeClass('show');
			dropdown.addClass('show');
			if (checkHeight(windowWidth)) { // if large screen, animate
				// get height of dropdown
				dropdownHeight = dropdown.outerHeight();
				// get height of menu
				menuHeight = $menu.height();
				// subtract height of dropdown from dropdown 'top'
				$dropdownList.css('top', "-"+dropdownHeight+"px");
				// add height of dropdown as padding-bottom to container
				$menu.css('padding-bottom', dropdownHeight);
				// animate: add height of dropdown AND height of menu to dropdown
				$dropdownList.animate({
					top: menuHeight
				}, 400, 'easeOutSine');
			}
		} else {
			if (checkHeight(windowWidth)) { // if large screen
				// get height of dropdown
				dropdownHeight = dropdown.height();
				// get height of menu
				menuHeight = $menu.height();
				var remove = (menuHeight - dropdownHeight);
				$dropdownList.animate({
					top: remove
				}, 400, 'easeOutSine', function() {
					dropdown.removeClass('show');
				});
			} else {
				dropdown.removeClass('show');
			}
		}
	});
})();

// Parallax

$(window).bind('scroll',function(e){
	var scrolledY = $(window).scrollTop();
	parallaxScroll(scrolledY);
});

function parallaxScroll(scrolledY){
	$('.hero-image').css('bottom','-'+((scrolledY*0.4))+'px');
	$('.get-closer').css('top',(scrolledY*0.3)+'px');
	$('.category__page-heading').css('top',(scrolledY*0.3)+'px');
	$('.brit-logo').css('top','-'+((scrolledY*0.6))+'px');
}

// when nav bar goes past (eg) 600px slides up
// iff scroll height is less than previous scroll it down

/* Credit Medium: https://medium.com/@mariusc23/hide-header-on-scroll-down-show-on-scroll-up-67bbaae9a78c#.e93rp1851 */

// Hide Header on on scroll down
(function checkUsersScroll() { 
	var didScroll;
	var lastScrollTop = 0;
	var delta = 5;
	var $header = $('.header');
	var navbarHeight = $header.outerHeight();
	

	$(window).scroll(function(event){
	    didScroll = true;
	});

	setInterval(function() {
		var windowWidth = window.innerWidth;
	    if (didScroll && checkHeight(windowWidth)) {
	        hasScrolled();
	        didScroll = false;
	    }
	}, 250);

	function hasScrolled() {
	    var st = $(this).scrollTop();
	    
	    // Make sure they scroll more than delta
	    if (Math.abs(lastScrollTop - st) <= delta)
	        return;
	    
	    // If they scrolled down and are past the navbar, add class .nav-up.
	    // This is necessary so you never see what is "behind" the navbar.
	    if (st > lastScrollTop && st > navbarHeight){
	        // Scroll Down
	        $header.removeClass('nav-down').addClass('nav-up');
	        $('.header__mobile-collapse').addClass('mobile-menu');
	        if ($('.selected').length > 0) {
	        	$('.selected').trigger('click');
	        }
	        $('.header__mobile-collapse').removeClass('show-inline-block');
	    } else {
	        // Scroll Up
	        if(st + $(window).height() < $(document).height()) {
	            $header.removeClass('nav-up').addClass('nav-down');
	        }
	    }
	    lastScrollTop = st;
	}
})();


// Meekats bit 
// todo: this will be cleaned up classes etc ((?) - this will be removed...)
function meekat() {
	$('.show-meekats').on('click', function(event) {
		event.preventDefault();
		var $this = $(this);
		var $heroContainer = $('.hero__background-container');
		var video = $('video');

		$.each($heroContainer, function(index, val) {
			var $this = $(this);
			if ($this.children('video').hasClass('selected')) {
				$this.children('.hero-image').removeClass('disappear');
				$this.children('.hero-image--small').removeClass('disappear');
				$this.children('video').addClass('disappear').removeClass('selected appear');
			} else {
				$this.children('.hero-image').addClass('disappear');
				$this.children('.hero-image--small').addClass('disappear');
				$this.children('video').removeClass('disappear').addClass('selected appear');
				video.play();

			}
		});
	});
}


// Image processing
// Swap 1kb blurry images for nice ones on page load

// find each image which pre-loaded class
// remove class and add new post-loaded class
// amend url to redirect to big image
/* Inspired by https://css-tricks.com/the-blur-up-technique-for-loading-background-images/ */

(function swapImageQuality() {
	var preLoadedImage = $('.pre-loaded');
	var postLoadedClass = 'post-loaded';
	var largeDirectory = '/large/';
	$.each(preLoadedImage, function(index, val) {
		var $this = $(this);
		var url = $this.attr('src'); // eg /source/img/small/large--hero-girl.jpg
		var changeFolder = url.replace('/small/', largeDirectory);
		var changeFileType = changeFolder.replace('.png', '.jpg');
		$this.attr('src', changeFileType);
		$this.removeClass('pre-loaded').addClass(postLoadedClass);
	});
})();


// Swap SVG image tags of inline SVGS so you can manipulate colour with css, emoves style head
/* http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement */
$('img.svg').each(function(){
    var $img = $(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');
    $.get(imgURL, function(data) {
        // Get the SVG tag, ignore the rest
        var $svg = $(data).find('svg');
        // Add replaced image's ID to the new SVG
        if(typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if(typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass+' replaced-svg');
        }
        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a ');
        $svg.find('style').remove();
        // Replace image with new SVG
        $img.replaceWith($svg);
    }, 'xml');
});

// Slideshow / Carousel

// there is a responsive option thingy

if ($('.carousel').length > 0) {
	$('.carousel').slick({
		centerMode: true,
		centerPadding: '25%',
		slidesToShow: 1,
		dots: false, 
		prevArrow: '<div class="previous-slide slide-arrow"><div class="icon-container"><div class="icon"><img src="/source/img/carousel-arrow.svg" class="responsive-image"></div></div></div>',
		nextArrow: '<div class="slide-arrow next-slide"><div class="icon-container"><div class="icon"><img src="/source/img/carousel-arrow.svg" class="responsive-image flip"></div></div></div>',
		responsive: [
			{	
				breakpoint: 768,
				settings: {
					centerMode: false,
					dots: true,
					arrows: false,
					infinite: false
				}
		}
		]
	});
}


}); // END JQUERY