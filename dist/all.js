jQuery(document).ready(function($) {

// console.time('label');

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
	var cover = $('<div class="cover"></div>');
	var $header = $('.header');
	$('.hamburger').on('click', function(event) {
		event.preventDefault();
		// this is because 'display: block' messes up large screen mode
		$('.header__mobile-collapse').toggleClass('show-inline-block');
		// this adds overflow for scrolling
		$header.toggleClass('mobile-scroll');
		// adds background that can be pressed to close menu
		cover.appendTo('.header');
		if ($header.hasClass('mobile-scroll')) {
			// add event listener
			$header.on('click', function(event) {
				event.preventDefault();
				var count = $('.header-background').outerHeight() + $('.header__mobile-collapse').outerHeight() + $('.more-links').outerHeight();
				$('body').css({
					'overflow': 'hidden',
					'max-height': count
				});
			});
			$('.cover').on('click', function(event) {
				event.preventDefault();
				$('.hamburger').trigger('click');
			});
		} else {
			// removes event listener
			$header.off();
			$('.cover').remove();
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
		if (checkHeight(windowWidth)) {
			removeMoreLinks(true);
		}
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
		if (largeScreen) {
			if (doAnimate) {
				animateDropdown(dropdown, largeScreen, 'up');
			} else {
				var dropdownHeight = "-"+dropdown.height()+"px";
				dropdown.addClass('show');
				$dropdown.css('bottom', dropdownHeight)
					.animate({
						height: dropdown.height()
					}, 200, 'easeOutSine');
			}
		} else {
			$('.navigation--parent .navigation__product-categories').remove();
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
				animateDropdown($dropdown.find('.navigation__product-categories'), largeScreen, 'down');
				// 
			} else if (!largeScreen) {
				// if small remove dropdown under .selected
				$menu.siblings('.navigation__product-categories').remove();
			}
		} else {
			if (largeScreen) {
				$dropdown.find('.navigation__product-categories').removeClass('show').attr('style','');
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
		// var dropdownHeight = '';
		if (largeScreen) {
			if (direction === 'up') {
				dropdown.addClass('show');
				$dropdown
					.css('height', dropdown.height())
					.css('top', '-'+dropdown.height()+'px')
					.animate({
						top: 0
					}, 400, 'easeOutSine');
			} else if (direction === 'down') {
				$dropdown.animate({
					top: '-'+dropdown.height()+'px'
				}, 400, 'easeOutSine', function() {
					$dropdown.css('height', 0);
					dropdown.removeClass('show');
				});


			}
		} else {
			dropdown.addClass('show');
		}
	}

	// Links for changing language, search etc
	(function moreLinks() {
		var $menu = $('.icon-links');
		var $menuLink = $menu.children('li');
		var $dropdown = $('.more-links__dropdowns');
		$menuLink.on('click', function(event) {
			event.preventDefault();
			var $this = $(this);
			var target = $this.attr("button");
			var $chosen = $dropdown.find($('[dropdown="' + target + '"]')); // get right dropdown item
			var menuHeight = $menu.height();
			var dropdownHeight = $chosen.height();
			var windowWidth = window.innerWidth;
			if  (checkHeight(windowWidth)) {
				hideDropdown(true, true);
				if ($this.hasClass('selected')) { 
					// hide dropdown
					$this.removeClass('selected');
					$currentSelection.animate({'top': '-' + $currentSelection.height() + 'px'}, 400, function() {
						$(this).removeClass('show');
					});
					$currentSelection = '';
				} else if ($this.siblings().hasClass('selected')) {
					// swap open dropdown for new (don't animate)
					$this.siblings().removeClass('selected');
					$this.addClass('selected');
					$currentSelection.removeClass('show').css(' ');
					$chosen.css({top: menuHeight}).addClass('show');
					$currentSelection = $chosen;
				} else {
					// add selected to this
					$this.addClass('selected');
					$chosen.css('top', '-' + dropdownHeight + 'px').addClass('show');
					$chosen.animate({top: menuHeight}, 500, 'easeOutSine');
					$currentSelection = $chosen;
				}
			} else if (!$this.hasClass('selected')) {
				$menuLink.removeClass('selected');
				$this.addClass('selected');
				$('.more-links__dropdown').removeClass('show');
				$chosen.addClass('show');	
			} else {
				$this.removeClass('selected');
				$chosen.removeClass('show');
				$currentSelection = '';
			}
		});
	})();

	function removeMoreLinks(animate) {
		if ($('.icon-link').hasClass('selected')) {
			$('.icon-link').removeClass('selected');
			var dropdown = $('.more-links__dropdowns .show');
			if (animate) {
				dropdown.animate({'top': '-' + dropdown.height() + 'px'}, 400, function() {
					$(this).removeClass('show').css(' ');
				});
			} else {
				dropdown.css({'top':0}).removeClass('show');
			}
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
	  		$dropdown.animate({
	  				height: $('.navigation__product-categories.show').height()
	  			}, 200, 'easeOutSine');
			if (originalWidth >= 768 && newWidth <= 767 ) { // was big, now small 
				hideDropdown(checkHeight(originalWidth), false);
				$dropdown.css('height',0);
				minorResize = false;
				removeMoreLinks(false);
			} else if (originalWidth <= 767 && newWidth >= 768 ) { // was small, now big
				$('.header__mobile-collapse').removeClass('show-inline-block');
				removeMoreLinks(false);
				hideDropdown(checkHeight(originalWidth), false);
				minorResize = false;
			}
			// after business make new width original
			originalWidth = newWidth;
	  }, 100);
	});
})();

// Parallax

(function parallaxFunction () {

	$(window).bind('scroll',function(e){
		var scrolledY = $(window).scrollTop();
		parallaxScroll(scrolledY);
	});

	function parallaxScroll (scrolledY) { 
		if (scrolledY < $('.hero-image').height() && $(window).width()) {
			$('.hero-image').css('top',((scrolledY*1))+'px');
			$('.category__page-heading').css('top',(scrolledY*0.3)+'px');
			$('.brit-logo').css('top','-'+((scrolledY*0.6))+'px');
			$('.get-closer').css('top',((scrolledY*0.2))+'px');
			// todo: maybe animate the diagonal line

		}
	}

})();


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

// Slideshow / Carousel (slick.js)

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
	// without these before/afters the arrows will 
	// float above the images when the carousel is sliding
	$('.carousel').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
		$('.slick-list').addClass('high-z-index');
	});
	$('.carousel').on('afterChange', function (event, slick, currentSlide, nextSlide) {
		$('.slick-list').removeClass('high-z-index');
	});
}

// Front Page
//
if ($('.front__carousel').length > 0) {
	$('.front__carousel').slick({
		prevArrow: '',
		nextArrow: ''

	});
	// without these before/afters the arrows will 
	// float above the images when the carousel is sliding
	$('.carousel').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
		$('.slick-list').addClass('high-z-index');
	});
	$('.carousel').on('afterChange', function (event, slick, currentSlide, nextSlide) {
		$('.slick-list').removeClass('high-z-index');
	});
}

(function showHideCategory() {
	var $products = $('.category__group__content');
	var $buttons = $('.category__show-products');
	$products.addClass('hidden-xs');
	$buttons.on('click', function(event) {
		event.preventDefault();
		$(this).next().removeClass('hidden-xs');
		$(this).remove();
	});

})();

// this isn't very necessary

(function makeWavesurfer() {
	if ($('#waveform').length > 0) {
		var wavesurfer = Object.create(WaveSurfer);

		wavesurfer.init({
			container: '#waveform',
			waveColor: 'violet',
			progressColor: 'purple',
			barWidth: 3,
			hideScrollbar: true
		});

		var actualTime = 0;

		$('.play').on('click', function () {
			if (!wavesurfer.isPlaying()) {
				wavesurfer.play();
				actualTime = timeSpace();
			} else {
				wavesurfer.pause();
				actualTime = timeSpace();
			}
		});

		var timeSpace = function() {
			setInterval(function(){ 
				this.time = parseInt(wavesurfer.getCurrentTime());
				$('#time').text(displayTime(this.time));			
			}, 1000);
			return this.time;
		};

		wavesurfer.load('../source/audio/test.ogg');
	}
	

	function displayTime(time) {
		var importedTime = time;
		var seconds = 0;
		var minutes = 0;
		var timeFormatted = '';

		seconds = importedTime % 60;
		minutes = Math.floor(importedTime / 60);

		if (seconds <= 9) {
			seconds = '0' + seconds;
		}

		if (minutes <= 9) {
			minutes = '0' + minutes;
		}

		timeFormatted = minutes + ':' + seconds;
		return timeFormatted;
	}

})();

// console.timeEnd('label');
// index inital page load: 05/01/2015 = 35.528ms;

}); // END JQUERY

