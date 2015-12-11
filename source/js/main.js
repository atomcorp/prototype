jQuery(document).ready(function($) {

	function c(string) {
		var x = console.log(string);
		return x;
	}

// todo
// This will have to be redone/removed
// Use inline SVG or CSS to change colour
(function swapImage() {
	$('.navigation__product-categories li').hover(function(event) {
		event.preventDefault();
		var $this = $(this);
		$this.find('img').attr('src', '/source/img/examples/wireframe-yel.svg');
		$this.find('div').addClass('yellow');
	}, function() {
		var $this = $(this);
		$this.find('img').attr('src', '/source/img/examples/wireframe.svg');
		$this.find('div').removeClass('yellow');
	});
})();

(function showMenu() {
	$('.hamburger').on('click', function(event) {
		event.preventDefault();
		$('.header__mobile-collapse').toggleClass('mobile-menu');
	});
})();

function dropDownMenu() { // New
	var $menu = $('.navigation__item--parent'); // this gets clicks
	var $dropdown = $('.dropdown-menu__hidden'); // this gets picked

	var dropdownClass = 'navigation__product-categories';
	var bootstrapWidth = 768; // When width turns from fluid to fixed

	$menu.on('click', function(event) {
		event.preventDefault();
		var $this = $(this);
		var target = $this.attr("button");
		var windowWidth = window.innerWidth;

		// check clicked status of item
		if ($this.hasClass('selected')) { 
			// hide this submenu
			hideDropdown(checkHeight(windowWidth));
		} else if ($this.siblings().hasClass('selected')) {
			// hide other dropdown (not by slideUp)
			hideDropdown(checkHeight(windowWidth));
			// add selected  to this
			$this.addClass('selected');
			// show this dropdown
			// var dropdown = getDropdown(target);
			displayDropdown($this, getDropdown(target), checkHeight(windowWidth));
		} else {
			// add selected to this
			$this.addClass('selected');
			// find related dropdown 
			// var dropdown = getDropdown(target);
			// display dropdown
			displayDropdown($this, getDropdown(target), checkHeight(windowWidth));
		}
	});



	// HELPER FUNCTIONS

	function getDropdown(target) {
		var dropdown = $dropdown.find($('[dropdown="' + target + '"]'));
		return dropdown;
	}

	function displayDropdown(menu, dropdown, largeScreen) {
		// TODO check screen size ; add animation
		if (largeScreen) {
			animateDropdown(dropdown, largeScreen);
		} else {
			// copy dropdown, place under relevant category and show
			dropdown.clone().insertAfter(menu).show();
			// var replacedDropdown = dropdown.clone().insertAfter(menu).slideDown({
			// 	duration: 700,
			// 	method: 'easeInOutCubic'
			// });
			// animateDropdown(replacedDropdown, largeScreen);
		}
	}

	function hideDropdown(largeScreen) {
		// if large screen - hide all divs in .dropdown-menu__hidden
		if (largeScreen) {
			$dropdown.children().removeClass('show').attr('style','');
		} else if (!largeScreen) {
			// if small remove dropdown under .selected
			$menu.siblings('.navigation__product-categories').remove();
		}
		$menu.removeClass('selected');

	}

	function checkHeight(windowWidth) { // this should be Width not height :/
		if (windowWidth >= bootstrapWidth) {
			return true;
		} else if (windowWidth < bootstrapWidth) {
			return false;
		}
	}

	function animateDropdown(dropdown, largeScreen) {
		// see http://easings.net/ for easing examples
		var dropdownHeight = '';
		if (largeScreen) {
			dropdownHeight = "-"+dropdown.height()+"px";
			dropdown.addClass('show');
			dropdown.animate({
				bottom: dropdownHeight
			}, 700, 'easeInOutCubic');
		} else {
			// get height of dropdown
			// get next li
			// add height on li
			dropdown.addClass('show');
		}
	}

	var resizeTimer;
	var originalWidth = $(window).width();
	$(window).on('resize', function(e) {
	  	clearTimeout(resizeTimer);
	  	resizeTimer = setTimeout(function() {
	  		var newWidth = $(window).width();
			if (originalWidth >= 768 && newWidth <= 767 ) {
				c('was big now small');
				hideDropdown(checkHeight(originalWidth));
			} else if (originalWidth <= 767 && newWidth >= 768 ) {
				c('was small now big');
				hideDropdown(checkHeight(originalWidth));
			}		// after business make new width original
			originalWidth = newWidth;
	  }, 100);
	});

	// check click status of clicked item
	// check if any items have click
	// get value of clicked target
	// get matched sub-menu of target
	// attached

	// function WHEN SUB-MENU PICKED
	// All submenus live (hidden) in 'dropdown-menu-location__fullscreen'
	// When screen: fullsize toggle appled to make visible
	// When mobile: copy made of sub-menu and made visible

	// function SLIDE IN + OUT
	// use offset to move sub-menu above menu

	// slide down
	// bottom of submenu rests at bottom of menu
	// minus height of submenu from bottom of submenu
	// 

}

dropDownMenu();

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
	var scrolledY = $(window).scrollTop();
	parallaxScroll(scrolledY);
});

function parallaxScroll(scrolledY){
	$('.hero-image').css('bottom','-'+((scrolledY*0.4))+'px');
	$('.get-closer').css('top','-'+((scrolledY*0.2))+'px');
	$('.brit-logo').css('top','-'+((scrolledY*0.6))+'px');
}

// when nav bar goes past (eg) 600px slides up
// iff scroll height is less than previous scroll it down

/* Credit Medium: https://medium.com/@mariusc23/hide-header-on-scroll-down-show-on-scroll-up-67bbaae9a78c#.e93rp1851 */

// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var $header = $('.header');
var navbarHeight = $header.outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
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
        if ($('.navigation-selected').length > 0) {
        	$('.navigation-selected').trigger('click');
        }
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $header.removeClass('nav-up').addClass('nav-down');
            $('.header__mobile-collapse');
        }
    }
    lastScrollTop = st;

}

// Meekats bit 
// Todo this will be cleaned up calsses etc

$('.show-meekats').on('click', function(event) {
	event.preventDefault();
	var $this = $(this);
	var $heroContainer = $('.hero__background-container');
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
		}
	});
});

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
	
});