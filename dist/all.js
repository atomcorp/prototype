/* Main.js */

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
		centerPadding: '15%',
		slidesToShow: 1,
		dots: false, 
		// todo: easing
		prevArrow: '<div class="previous-slide slide-arrow"><div class="icon-container"><div class="icon"><img src="/source/img/carousel-arrow.svg" class="responsive-image"></div></div></div>',
		nextArrow: '<div class="slide-arrow next-slide"><div class="icon-container"><div class="icon"><img src="/source/img/carousel-arrow.svg" class="responsive-image flip"></div></div></div>',
		responsive: [
			{	
				breakpoint: 993,
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
	// You needs this as beforeChange doesn't fire until after the users finger leaves the screen
	// and looks bad
	$('.image-slide').on('mousedown touchstart', function(event) {
		$('.slick-list').addClass('high-z-index');
	});
}

// Front Page
//
if ($('.standard__carousel').length > 0) {
	$('.standard__carousel').slick({
		prevArrow: '',
		nextArrow: '',
		dots: true,
		draggable: false,
		responsive: [
			{	
				breakpoint: 993,
				settings: {
					draggable: true,
					dots: true,
					arrows: false
				}
			}
		]

	});


}

if ($('.instagram__carousel').length > 0) {
	$('.instagram__carousel').slick({
		slidesToShow: 5,
		prevArrow:'<div class="previous-slide slide-arrow"><div class="icon-container"><div class="icon"><img src="/source/img/arrow.svg" class="responsive-image"></div></div></div>',
		nextArrow:'<div class="slide-arrow next-slide"><div class="icon-container"><div class="icon"><img src="/source/img/arrow.svg" class="responsive-image flip"></div></div></div>'
	});
}

(function showHideCategory() {
	var $products = $('.category__group__content');
	var $showButtons = $('.category__show-products');
	var $hideButtons = $('.category__hide-products');
	$products.addClass('hidden-xs');
	$showButtons.on('click', function(event) {
		event.preventDefault();
		$(this).next().removeClass('hidden-xs').next().removeClass('disappear');
		$(this).addClass('disappear');
	});

	$hideButtons.on('click', function(event) {
		event.preventDefault();
		$(this).prev().addClass('hidden-xs').prev().removeClass('disappear');
		$(this).addClass('disappear');
	});

})();

(function filterLounge() {
	// todo: remove whengoing to full site
	// can't actually use this in full thing
	var articles = $('.lounge__article');
	$('.lounge__filter__item').on('click', function(event) {
		event.preventDefault();
		var $this = $(this);
		var selected = $this.attr('lounge-filter');
		$.each(articles, function(index, val) {
			var $this = $(this);
			var comparisonVal = $this.children('.hide').attr('lounge-filter');
			c('sel:' + selected + ', com:' + comparisonVal);
			if (selected === comparisonVal) {
				$this.addClass('show-inline-block').appendTo($('.hide-overflow').eq(0));
				$this.removeClass('hide');
			} else {
				$this.addClass('hide');
				$this.removeClass('show-inline-block');
			}
		});
	});
	$('.lounge__clear').on('click', function(event) {
		event.preventDefault();
		$.each(articles, function(index, val) {
			var $this = $(this);
			$this.addClass('show-inline-block');
		});
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

// Most of this can be deleted except the .slick('reinit') function
// which may or may no help 
(function() {
	$('.friends__feature').hide();
	$('.friends__profile').on('click', function(event) {
		event.preventDefault();
		$('.friends__feature').slideDown(800, function() {
			$('.carousel').slick('reinit');
		});
		var height = $('.hero').height();
		$('html, body').animate({
		    scrollTop: height - 70
		}, 1000);
	});
	$('.friends__close .btn').on('click', function(event) {
		event.preventDefault();
		$('.friends__feature').slideUp(800);
	});
})();

// console.timeEnd('label');
// index inital page load: 05/01/2015 = 35.528ms;

}); // END JQUERY


/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.5.9
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"undefined"!=typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){"use strict";var b=window.Slick||{};b=function(){function c(c,d){var f,e=this;e.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:a(c),appendDots:a(c),arrows:!0,asNavFor:null,prevArrow:'<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',nextArrow:'<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(a,b){return'<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">'+(b+1)+"</button>"},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!1,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},e.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},a.extend(e,e.initials),e.activeBreakpoint=null,e.animType=null,e.animProp=null,e.breakpoints=[],e.breakpointSettings=[],e.cssTransitions=!1,e.hidden="hidden",e.paused=!1,e.positionProp=null,e.respondTo=null,e.rowCount=1,e.shouldClick=!0,e.$slider=a(c),e.$slidesCache=null,e.transformType=null,e.transitionType=null,e.visibilityChange="visibilitychange",e.windowWidth=0,e.windowTimer=null,f=a(c).data("slick")||{},e.options=a.extend({},e.defaults,f,d),e.currentSlide=e.options.initialSlide,e.originalSettings=e.options,"undefined"!=typeof document.mozHidden?(e.hidden="mozHidden",e.visibilityChange="mozvisibilitychange"):"undefined"!=typeof document.webkitHidden&&(e.hidden="webkitHidden",e.visibilityChange="webkitvisibilitychange"),e.autoPlay=a.proxy(e.autoPlay,e),e.autoPlayClear=a.proxy(e.autoPlayClear,e),e.changeSlide=a.proxy(e.changeSlide,e),e.clickHandler=a.proxy(e.clickHandler,e),e.selectHandler=a.proxy(e.selectHandler,e),e.setPosition=a.proxy(e.setPosition,e),e.swipeHandler=a.proxy(e.swipeHandler,e),e.dragHandler=a.proxy(e.dragHandler,e),e.keyHandler=a.proxy(e.keyHandler,e),e.autoPlayIterator=a.proxy(e.autoPlayIterator,e),e.instanceUid=b++,e.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,e.registerBreakpoints(),e.init(!0),e.checkResponsive(!0)}var b=0;return c}(),b.prototype.addSlide=b.prototype.slickAdd=function(b,c,d){var e=this;if("boolean"==typeof c)d=c,c=null;else if(0>c||c>=e.slideCount)return!1;e.unload(),"number"==typeof c?0===c&&0===e.$slides.length?a(b).appendTo(e.$slideTrack):d?a(b).insertBefore(e.$slides.eq(c)):a(b).insertAfter(e.$slides.eq(c)):d===!0?a(b).prependTo(e.$slideTrack):a(b).appendTo(e.$slideTrack),e.$slides=e.$slideTrack.children(this.options.slide),e.$slideTrack.children(this.options.slide).detach(),e.$slideTrack.append(e.$slides),e.$slides.each(function(b,c){a(c).attr("data-slick-index",b)}),e.$slidesCache=e.$slides,e.reinit()},b.prototype.animateHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.animate({height:b},a.options.speed)}},b.prototype.animateSlide=function(b,c){var d={},e=this;e.animateHeight(),e.options.rtl===!0&&e.options.vertical===!1&&(b=-b),e.transformsEnabled===!1?e.options.vertical===!1?e.$slideTrack.animate({left:b},e.options.speed,e.options.easing,c):e.$slideTrack.animate({top:b},e.options.speed,e.options.easing,c):e.cssTransitions===!1?(e.options.rtl===!0&&(e.currentLeft=-e.currentLeft),a({animStart:e.currentLeft}).animate({animStart:b},{duration:e.options.speed,easing:e.options.easing,step:function(a){a=Math.ceil(a),e.options.vertical===!1?(d[e.animType]="translate("+a+"px, 0px)",e.$slideTrack.css(d)):(d[e.animType]="translate(0px,"+a+"px)",e.$slideTrack.css(d))},complete:function(){c&&c.call()}})):(e.applyTransition(),b=Math.ceil(b),e.options.vertical===!1?d[e.animType]="translate3d("+b+"px, 0px, 0px)":d[e.animType]="translate3d(0px,"+b+"px, 0px)",e.$slideTrack.css(d),c&&setTimeout(function(){e.disableTransition(),c.call()},e.options.speed))},b.prototype.asNavFor=function(b){var c=this,d=c.options.asNavFor;d&&null!==d&&(d=a(d).not(c.$slider)),null!==d&&"object"==typeof d&&d.each(function(){var c=a(this).slick("getSlick");c.unslicked||c.slideHandler(b,!0)})},b.prototype.applyTransition=function(a){var b=this,c={};b.options.fade===!1?c[b.transitionType]=b.transformType+" "+b.options.speed+"ms "+b.options.cssEase:c[b.transitionType]="opacity "+b.options.speed+"ms "+b.options.cssEase,b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.autoPlay=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer),a.slideCount>a.options.slidesToShow&&a.paused!==!0&&(a.autoPlayTimer=setInterval(a.autoPlayIterator,a.options.autoplaySpeed))},b.prototype.autoPlayClear=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer)},b.prototype.autoPlayIterator=function(){var a=this;a.options.infinite===!1?1===a.direction?(a.currentSlide+1===a.slideCount-1&&(a.direction=0),a.slideHandler(a.currentSlide+a.options.slidesToScroll)):(a.currentSlide-1===0&&(a.direction=1),a.slideHandler(a.currentSlide-a.options.slidesToScroll)):a.slideHandler(a.currentSlide+a.options.slidesToScroll)},b.prototype.buildArrows=function(){var b=this;b.options.arrows===!0&&(b.$prevArrow=a(b.options.prevArrow).addClass("slick-arrow"),b.$nextArrow=a(b.options.nextArrow).addClass("slick-arrow"),b.slideCount>b.options.slidesToShow?(b.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.prependTo(b.options.appendArrows),b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.appendTo(b.options.appendArrows),b.options.infinite!==!0&&b.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):b.$prevArrow.add(b.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},b.prototype.buildDots=function(){var c,d,b=this;if(b.options.dots===!0&&b.slideCount>b.options.slidesToShow){for(d='<ul class="'+b.options.dotsClass+'">',c=0;c<=b.getDotCount();c+=1)d+="<li>"+b.options.customPaging.call(this,b,c)+"</li>";d+="</ul>",b.$dots=a(d).appendTo(b.options.appendDots),b.$dots.find("li").first().addClass("slick-active").attr("aria-hidden","false")}},b.prototype.buildOut=function(){var b=this;b.$slides=b.$slider.children(b.options.slide+":not(.slick-cloned)").addClass("slick-slide"),b.slideCount=b.$slides.length,b.$slides.each(function(b,c){a(c).attr("data-slick-index",b).data("originalStyling",a(c).attr("style")||"")}),b.$slider.addClass("slick-slider"),b.$slideTrack=0===b.slideCount?a('<div class="slick-track"/>').appendTo(b.$slider):b.$slides.wrapAll('<div class="slick-track"/>').parent(),b.$list=b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(),b.$slideTrack.css("opacity",0),(b.options.centerMode===!0||b.options.swipeToSlide===!0)&&(b.options.slidesToScroll=1),a("img[data-lazy]",b.$slider).not("[src]").addClass("slick-loading"),b.setupInfinite(),b.buildArrows(),b.buildDots(),b.updateDots(),b.setSlideClasses("number"==typeof b.currentSlide?b.currentSlide:0),b.options.draggable===!0&&b.$list.addClass("draggable")},b.prototype.buildRows=function(){var b,c,d,e,f,g,h,a=this;if(e=document.createDocumentFragment(),g=a.$slider.children(),a.options.rows>1){for(h=a.options.slidesPerRow*a.options.rows,f=Math.ceil(g.length/h),b=0;f>b;b++){var i=document.createElement("div");for(c=0;c<a.options.rows;c++){var j=document.createElement("div");for(d=0;d<a.options.slidesPerRow;d++){var k=b*h+(c*a.options.slidesPerRow+d);g.get(k)&&j.appendChild(g.get(k))}i.appendChild(j)}e.appendChild(i)}a.$slider.html(e),a.$slider.children().children().children().css({width:100/a.options.slidesPerRow+"%",display:"inline-block"})}},b.prototype.checkResponsive=function(b,c){var e,f,g,d=this,h=!1,i=d.$slider.width(),j=window.innerWidth||a(window).width();if("window"===d.respondTo?g=j:"slider"===d.respondTo?g=i:"min"===d.respondTo&&(g=Math.min(j,i)),d.options.responsive&&d.options.responsive.length&&null!==d.options.responsive){f=null;for(e in d.breakpoints)d.breakpoints.hasOwnProperty(e)&&(d.originalSettings.mobileFirst===!1?g<d.breakpoints[e]&&(f=d.breakpoints[e]):g>d.breakpoints[e]&&(f=d.breakpoints[e]));null!==f?null!==d.activeBreakpoint?(f!==d.activeBreakpoint||c)&&(d.activeBreakpoint=f,"unslick"===d.breakpointSettings[f]?d.unslick(f):(d.options=a.extend({},d.originalSettings,d.breakpointSettings[f]),b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b)),h=f):(d.activeBreakpoint=f,"unslick"===d.breakpointSettings[f]?d.unslick(f):(d.options=a.extend({},d.originalSettings,d.breakpointSettings[f]),b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b)),h=f):null!==d.activeBreakpoint&&(d.activeBreakpoint=null,d.options=d.originalSettings,b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b),h=f),b||h===!1||d.$slider.trigger("breakpoint",[d,h])}},b.prototype.changeSlide=function(b,c){var f,g,h,d=this,e=a(b.target);switch(e.is("a")&&b.preventDefault(),e.is("li")||(e=e.closest("li")),h=d.slideCount%d.options.slidesToScroll!==0,f=h?0:(d.slideCount-d.currentSlide)%d.options.slidesToScroll,b.data.message){case"previous":g=0===f?d.options.slidesToScroll:d.options.slidesToShow-f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide-g,!1,c);break;case"next":g=0===f?d.options.slidesToScroll:f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide+g,!1,c);break;case"index":var i=0===b.data.index?0:b.data.index||e.index()*d.options.slidesToScroll;d.slideHandler(d.checkNavigable(i),!1,c),e.children().trigger("focus");break;default:return}},b.prototype.checkNavigable=function(a){var c,d,b=this;if(c=b.getNavigableIndexes(),d=0,a>c[c.length-1])a=c[c.length-1];else for(var e in c){if(a<c[e]){a=d;break}d=c[e]}return a},b.prototype.cleanUpEvents=function(){var b=this;b.options.dots&&null!==b.$dots&&(a("li",b.$dots).off("click.slick",b.changeSlide),b.options.pauseOnDotsHover===!0&&b.options.autoplay===!0&&a("li",b.$dots).off("mouseenter.slick",a.proxy(b.setPaused,b,!0)).off("mouseleave.slick",a.proxy(b.setPaused,b,!1))),b.options.arrows===!0&&b.slideCount>b.options.slidesToShow&&(b.$prevArrow&&b.$prevArrow.off("click.slick",b.changeSlide),b.$nextArrow&&b.$nextArrow.off("click.slick",b.changeSlide)),b.$list.off("touchstart.slick mousedown.slick",b.swipeHandler),b.$list.off("touchmove.slick mousemove.slick",b.swipeHandler),b.$list.off("touchend.slick mouseup.slick",b.swipeHandler),b.$list.off("touchcancel.slick mouseleave.slick",b.swipeHandler),b.$list.off("click.slick",b.clickHandler),a(document).off(b.visibilityChange,b.visibility),b.$list.off("mouseenter.slick",a.proxy(b.setPaused,b,!0)),b.$list.off("mouseleave.slick",a.proxy(b.setPaused,b,!1)),b.options.accessibility===!0&&b.$list.off("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().off("click.slick",b.selectHandler),a(window).off("orientationchange.slick.slick-"+b.instanceUid,b.orientationChange),a(window).off("resize.slick.slick-"+b.instanceUid,b.resize),a("[draggable!=true]",b.$slideTrack).off("dragstart",b.preventDefault),a(window).off("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).off("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.cleanUpRows=function(){var b,a=this;a.options.rows>1&&(b=a.$slides.children().children(),b.removeAttr("style"),a.$slider.html(b))},b.prototype.clickHandler=function(a){var b=this;b.shouldClick===!1&&(a.stopImmediatePropagation(),a.stopPropagation(),a.preventDefault())},b.prototype.destroy=function(b){var c=this;c.autoPlayClear(),c.touchObject={},c.cleanUpEvents(),a(".slick-cloned",c.$slider).detach(),c.$dots&&c.$dots.remove(),c.$prevArrow&&c.$prevArrow.length&&(c.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.prevArrow)&&c.$prevArrow.remove()),c.$nextArrow&&c.$nextArrow.length&&(c.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.nextArrow)&&c.$nextArrow.remove()),c.$slides&&(c.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){a(this).attr("style",a(this).data("originalStyling"))}),c.$slideTrack.children(this.options.slide).detach(),c.$slideTrack.detach(),c.$list.detach(),c.$slider.append(c.$slides)),c.cleanUpRows(),c.$slider.removeClass("slick-slider"),c.$slider.removeClass("slick-initialized"),c.unslicked=!0,b||c.$slider.trigger("destroy",[c])},b.prototype.disableTransition=function(a){var b=this,c={};c[b.transitionType]="",b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.fadeSlide=function(a,b){var c=this;c.cssTransitions===!1?(c.$slides.eq(a).css({zIndex:c.options.zIndex}),c.$slides.eq(a).animate({opacity:1},c.options.speed,c.options.easing,b)):(c.applyTransition(a),c.$slides.eq(a).css({opacity:1,zIndex:c.options.zIndex}),b&&setTimeout(function(){c.disableTransition(a),b.call()},c.options.speed))},b.prototype.fadeSlideOut=function(a){var b=this;b.cssTransitions===!1?b.$slides.eq(a).animate({opacity:0,zIndex:b.options.zIndex-2},b.options.speed,b.options.easing):(b.applyTransition(a),b.$slides.eq(a).css({opacity:0,zIndex:b.options.zIndex-2}))},b.prototype.filterSlides=b.prototype.slickFilter=function(a){var b=this;null!==a&&(b.$slidesCache=b.$slides,b.unload(),b.$slideTrack.children(this.options.slide).detach(),b.$slidesCache.filter(a).appendTo(b.$slideTrack),b.reinit())},b.prototype.getCurrent=b.prototype.slickCurrentSlide=function(){var a=this;return a.currentSlide},b.prototype.getDotCount=function(){var a=this,b=0,c=0,d=0;if(a.options.infinite===!0)for(;b<a.slideCount;)++d,b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;else if(a.options.centerMode===!0)d=a.slideCount;else for(;b<a.slideCount;)++d,b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;return d-1},b.prototype.getLeft=function(a){var c,d,f,b=this,e=0;return b.slideOffset=0,d=b.$slides.first().outerHeight(!0),b.options.infinite===!0?(b.slideCount>b.options.slidesToShow&&(b.slideOffset=b.slideWidth*b.options.slidesToShow*-1,e=d*b.options.slidesToShow*-1),b.slideCount%b.options.slidesToScroll!==0&&a+b.options.slidesToScroll>b.slideCount&&b.slideCount>b.options.slidesToShow&&(a>b.slideCount?(b.slideOffset=(b.options.slidesToShow-(a-b.slideCount))*b.slideWidth*-1,e=(b.options.slidesToShow-(a-b.slideCount))*d*-1):(b.slideOffset=b.slideCount%b.options.slidesToScroll*b.slideWidth*-1,e=b.slideCount%b.options.slidesToScroll*d*-1))):a+b.options.slidesToShow>b.slideCount&&(b.slideOffset=(a+b.options.slidesToShow-b.slideCount)*b.slideWidth,e=(a+b.options.slidesToShow-b.slideCount)*d),b.slideCount<=b.options.slidesToShow&&(b.slideOffset=0,e=0),b.options.centerMode===!0&&b.options.infinite===!0?b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)-b.slideWidth:b.options.centerMode===!0&&(b.slideOffset=0,b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)),c=b.options.vertical===!1?a*b.slideWidth*-1+b.slideOffset:a*d*-1+e,b.options.variableWidth===!0&&(f=b.slideCount<=b.options.slidesToShow||b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow),c=b.options.rtl===!0?f[0]?-1*(b.$slideTrack.width()-f[0].offsetLeft-f.width()):0:f[0]?-1*f[0].offsetLeft:0,b.options.centerMode===!0&&(f=b.slideCount<=b.options.slidesToShow||b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow+1),c=b.options.rtl===!0?f[0]?-1*(b.$slideTrack.width()-f[0].offsetLeft-f.width()):0:f[0]?-1*f[0].offsetLeft:0,c+=(b.$list.width()-f.outerWidth())/2)),c},b.prototype.getOption=b.prototype.slickGetOption=function(a){var b=this;return b.options[a]},b.prototype.getNavigableIndexes=function(){var e,a=this,b=0,c=0,d=[];for(a.options.infinite===!1?e=a.slideCount:(b=-1*a.options.slidesToScroll,c=-1*a.options.slidesToScroll,e=2*a.slideCount);e>b;)d.push(b),b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;return d},b.prototype.getSlick=function(){return this},b.prototype.getSlideCount=function(){var c,d,e,b=this;return e=b.options.centerMode===!0?b.slideWidth*Math.floor(b.options.slidesToShow/2):0,b.options.swipeToSlide===!0?(b.$slideTrack.find(".slick-slide").each(function(c,f){return f.offsetLeft-e+a(f).outerWidth()/2>-1*b.swipeLeft?(d=f,!1):void 0}),c=Math.abs(a(d).attr("data-slick-index")-b.currentSlide)||1):b.options.slidesToScroll},b.prototype.goTo=b.prototype.slickGoTo=function(a,b){var c=this;c.changeSlide({data:{message:"index",index:parseInt(a)}},b)},b.prototype.init=function(b){var c=this;a(c.$slider).hasClass("slick-initialized")||(a(c.$slider).addClass("slick-initialized"),c.buildRows(),c.buildOut(),c.setProps(),c.startLoad(),c.loadSlider(),c.initializeEvents(),c.updateArrows(),c.updateDots()),b&&c.$slider.trigger("init",[c]),c.options.accessibility===!0&&c.initADA()},b.prototype.initArrowEvents=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.on("click.slick",{message:"previous"},a.changeSlide),a.$nextArrow.on("click.slick",{message:"next"},a.changeSlide))},b.prototype.initDotEvents=function(){var b=this;b.options.dots===!0&&b.slideCount>b.options.slidesToShow&&a("li",b.$dots).on("click.slick",{message:"index"},b.changeSlide),b.options.dots===!0&&b.options.pauseOnDotsHover===!0&&b.options.autoplay===!0&&a("li",b.$dots).on("mouseenter.slick",a.proxy(b.setPaused,b,!0)).on("mouseleave.slick",a.proxy(b.setPaused,b,!1))},b.prototype.initializeEvents=function(){var b=this;b.initArrowEvents(),b.initDotEvents(),b.$list.on("touchstart.slick mousedown.slick",{action:"start"},b.swipeHandler),b.$list.on("touchmove.slick mousemove.slick",{action:"move"},b.swipeHandler),b.$list.on("touchend.slick mouseup.slick",{action:"end"},b.swipeHandler),b.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},b.swipeHandler),b.$list.on("click.slick",b.clickHandler),a(document).on(b.visibilityChange,a.proxy(b.visibility,b)),b.$list.on("mouseenter.slick",a.proxy(b.setPaused,b,!0)),b.$list.on("mouseleave.slick",a.proxy(b.setPaused,b,!1)),b.options.accessibility===!0&&b.$list.on("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),a(window).on("orientationchange.slick.slick-"+b.instanceUid,a.proxy(b.orientationChange,b)),a(window).on("resize.slick.slick-"+b.instanceUid,a.proxy(b.resize,b)),a("[draggable!=true]",b.$slideTrack).on("dragstart",b.preventDefault),a(window).on("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).on("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.initUI=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.show(),a.$nextArrow.show()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.show(),a.options.autoplay===!0&&a.autoPlay()},b.prototype.keyHandler=function(a){var b=this;a.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===a.keyCode&&b.options.accessibility===!0?b.changeSlide({data:{message:"previous"}}):39===a.keyCode&&b.options.accessibility===!0&&b.changeSlide({data:{message:"next"}}))},b.prototype.lazyLoad=function(){function g(b){a("img[data-lazy]",b).each(function(){var b=a(this),c=a(this).attr("data-lazy"),d=document.createElement("img");d.onload=function(){b.animate({opacity:0},100,function(){b.attr("src",c).animate({opacity:1},200,function(){b.removeAttr("data-lazy").removeClass("slick-loading")})})},d.src=c})}var c,d,e,f,b=this;b.options.centerMode===!0?b.options.infinite===!0?(e=b.currentSlide+(b.options.slidesToShow/2+1),f=e+b.options.slidesToShow+2):(e=Math.max(0,b.currentSlide-(b.options.slidesToShow/2+1)),f=2+(b.options.slidesToShow/2+1)+b.currentSlide):(e=b.options.infinite?b.options.slidesToShow+b.currentSlide:b.currentSlide,f=e+b.options.slidesToShow,b.options.fade===!0&&(e>0&&e--,f<=b.slideCount&&f++)),c=b.$slider.find(".slick-slide").slice(e,f),g(c),b.slideCount<=b.options.slidesToShow?(d=b.$slider.find(".slick-slide"),g(d)):b.currentSlide>=b.slideCount-b.options.slidesToShow?(d=b.$slider.find(".slick-cloned").slice(0,b.options.slidesToShow),g(d)):0===b.currentSlide&&(d=b.$slider.find(".slick-cloned").slice(-1*b.options.slidesToShow),g(d))},b.prototype.loadSlider=function(){var a=this;a.setPosition(),a.$slideTrack.css({opacity:1}),a.$slider.removeClass("slick-loading"),a.initUI(),"progressive"===a.options.lazyLoad&&a.progressiveLazyLoad()},b.prototype.next=b.prototype.slickNext=function(){var a=this;a.changeSlide({data:{message:"next"}})},b.prototype.orientationChange=function(){var a=this;a.checkResponsive(),a.setPosition()},b.prototype.pause=b.prototype.slickPause=function(){var a=this;a.autoPlayClear(),a.paused=!0},b.prototype.play=b.prototype.slickPlay=function(){var a=this;a.paused=!1,a.autoPlay()},b.prototype.postSlide=function(a){var b=this;b.$slider.trigger("afterChange",[b,a]),b.animating=!1,b.setPosition(),b.swipeLeft=null,b.options.autoplay===!0&&b.paused===!1&&b.autoPlay(),b.options.accessibility===!0&&b.initADA()},b.prototype.prev=b.prototype.slickPrev=function(){var a=this;a.changeSlide({data:{message:"previous"}})},b.prototype.preventDefault=function(a){a.preventDefault()},b.prototype.progressiveLazyLoad=function(){var c,d,b=this;c=a("img[data-lazy]",b.$slider).length,c>0&&(d=a("img[data-lazy]",b.$slider).first(),d.attr("src",null),d.attr("src",d.attr("data-lazy")).removeClass("slick-loading").load(function(){d.removeAttr("data-lazy"),b.progressiveLazyLoad(),b.options.adaptiveHeight===!0&&b.setPosition()}).error(function(){d.removeAttr("data-lazy"),b.progressiveLazyLoad()}))},b.prototype.refresh=function(b){var d,e,c=this;e=c.slideCount-c.options.slidesToShow,c.options.infinite||(c.slideCount<=c.options.slidesToShow?c.currentSlide=0:c.currentSlide>e&&(c.currentSlide=e)),d=c.currentSlide,c.destroy(!0),a.extend(c,c.initials,{currentSlide:d}),c.init(),b||c.changeSlide({data:{message:"index",index:d}},!1)},b.prototype.registerBreakpoints=function(){var c,d,e,b=this,f=b.options.responsive||null;if("array"===a.type(f)&&f.length){b.respondTo=b.options.respondTo||"window";for(c in f)if(e=b.breakpoints.length-1,d=f[c].breakpoint,f.hasOwnProperty(c)){for(;e>=0;)b.breakpoints[e]&&b.breakpoints[e]===d&&b.breakpoints.splice(e,1),e--;b.breakpoints.push(d),b.breakpointSettings[d]=f[c].settings}b.breakpoints.sort(function(a,c){return b.options.mobileFirst?a-c:c-a})}},b.prototype.reinit=function(){var b=this;b.$slides=b.$slideTrack.children(b.options.slide).addClass("slick-slide"),b.slideCount=b.$slides.length,b.currentSlide>=b.slideCount&&0!==b.currentSlide&&(b.currentSlide=b.currentSlide-b.options.slidesToScroll),b.slideCount<=b.options.slidesToShow&&(b.currentSlide=0),b.registerBreakpoints(),b.setProps(),b.setupInfinite(),b.buildArrows(),b.updateArrows(),b.initArrowEvents(),b.buildDots(),b.updateDots(),b.initDotEvents(),b.checkResponsive(!1,!0),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),b.setSlideClasses(0),b.setPosition(),b.$slider.trigger("reInit",[b]),b.options.autoplay===!0&&b.focusHandler()},b.prototype.resize=function(){var b=this;a(window).width()!==b.windowWidth&&(clearTimeout(b.windowDelay),b.windowDelay=window.setTimeout(function(){b.windowWidth=a(window).width(),b.checkResponsive(),b.unslicked||b.setPosition()},50))},b.prototype.removeSlide=b.prototype.slickRemove=function(a,b,c){var d=this;return"boolean"==typeof a?(b=a,a=b===!0?0:d.slideCount-1):a=b===!0?--a:a,d.slideCount<1||0>a||a>d.slideCount-1?!1:(d.unload(),c===!0?d.$slideTrack.children().remove():d.$slideTrack.children(this.options.slide).eq(a).remove(),d.$slides=d.$slideTrack.children(this.options.slide),d.$slideTrack.children(this.options.slide).detach(),d.$slideTrack.append(d.$slides),d.$slidesCache=d.$slides,void d.reinit())},b.prototype.setCSS=function(a){var d,e,b=this,c={};b.options.rtl===!0&&(a=-a),d="left"==b.positionProp?Math.ceil(a)+"px":"0px",e="top"==b.positionProp?Math.ceil(a)+"px":"0px",c[b.positionProp]=a,b.transformsEnabled===!1?b.$slideTrack.css(c):(c={},b.cssTransitions===!1?(c[b.animType]="translate("+d+", "+e+")",b.$slideTrack.css(c)):(c[b.animType]="translate3d("+d+", "+e+", 0px)",b.$slideTrack.css(c)))},b.prototype.setDimensions=function(){var a=this;a.options.vertical===!1?a.options.centerMode===!0&&a.$list.css({padding:"0px "+a.options.centerPadding}):(a.$list.height(a.$slides.first().outerHeight(!0)*a.options.slidesToShow),a.options.centerMode===!0&&a.$list.css({padding:a.options.centerPadding+" 0px"})),a.listWidth=a.$list.width(),a.listHeight=a.$list.height(),a.options.vertical===!1&&a.options.variableWidth===!1?(a.slideWidth=Math.ceil(a.listWidth/a.options.slidesToShow),a.$slideTrack.width(Math.ceil(a.slideWidth*a.$slideTrack.children(".slick-slide").length))):a.options.variableWidth===!0?a.$slideTrack.width(5e3*a.slideCount):(a.slideWidth=Math.ceil(a.listWidth),a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0)*a.$slideTrack.children(".slick-slide").length)));var b=a.$slides.first().outerWidth(!0)-a.$slides.first().width();a.options.variableWidth===!1&&a.$slideTrack.children(".slick-slide").width(a.slideWidth-b)},b.prototype.setFade=function(){var c,b=this;b.$slides.each(function(d,e){c=b.slideWidth*d*-1,b.options.rtl===!0?a(e).css({position:"relative",right:c,top:0,zIndex:b.options.zIndex-2,opacity:0}):a(e).css({position:"relative",left:c,top:0,zIndex:b.options.zIndex-2,opacity:0})}),b.$slides.eq(b.currentSlide).css({zIndex:b.options.zIndex-1,opacity:1})},b.prototype.setHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.css("height",b)}},b.prototype.setOption=b.prototype.slickSetOption=function(b,c,d){var f,g,e=this;if("responsive"===b&&"array"===a.type(c))for(g in c)if("array"!==a.type(e.options.responsive))e.options.responsive=[c[g]];else{for(f=e.options.responsive.length-1;f>=0;)e.options.responsive[f].breakpoint===c[g].breakpoint&&e.options.responsive.splice(f,1),f--;e.options.responsive.push(c[g])}else e.options[b]=c;d===!0&&(e.unload(),e.reinit())},b.prototype.setPosition=function(){var a=this;a.setDimensions(),a.setHeight(),a.options.fade===!1?a.setCSS(a.getLeft(a.currentSlide)):a.setFade(),a.$slider.trigger("setPosition",[a])},b.prototype.setProps=function(){var a=this,b=document.body.style;a.positionProp=a.options.vertical===!0?"top":"left","top"===a.positionProp?a.$slider.addClass("slick-vertical"):a.$slider.removeClass("slick-vertical"),(void 0!==b.WebkitTransition||void 0!==b.MozTransition||void 0!==b.msTransition)&&a.options.useCSS===!0&&(a.cssTransitions=!0),a.options.fade&&("number"==typeof a.options.zIndex?a.options.zIndex<3&&(a.options.zIndex=3):a.options.zIndex=a.defaults.zIndex),void 0!==b.OTransform&&(a.animType="OTransform",a.transformType="-o-transform",a.transitionType="OTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.MozTransform&&(a.animType="MozTransform",a.transformType="-moz-transform",a.transitionType="MozTransition",void 0===b.perspectiveProperty&&void 0===b.MozPerspective&&(a.animType=!1)),void 0!==b.webkitTransform&&(a.animType="webkitTransform",a.transformType="-webkit-transform",a.transitionType="webkitTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.msTransform&&(a.animType="msTransform",a.transformType="-ms-transform",a.transitionType="msTransition",void 0===b.msTransform&&(a.animType=!1)),void 0!==b.transform&&a.animType!==!1&&(a.animType="transform",a.transformType="transform",a.transitionType="transition"),a.transformsEnabled=a.options.useTransform&&null!==a.animType&&a.animType!==!1},b.prototype.setSlideClasses=function(a){var c,d,e,f,b=this;d=b.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),b.$slides.eq(a).addClass("slick-current"),b.options.centerMode===!0?(c=Math.floor(b.options.slidesToShow/2),b.options.infinite===!0&&(a>=c&&a<=b.slideCount-1-c?b.$slides.slice(a-c,a+c+1).addClass("slick-active").attr("aria-hidden","false"):(e=b.options.slidesToShow+a,d.slice(e-c+1,e+c+2).addClass("slick-active").attr("aria-hidden","false")),0===a?d.eq(d.length-1-b.options.slidesToShow).addClass("slick-center"):a===b.slideCount-1&&d.eq(b.options.slidesToShow).addClass("slick-center")),b.$slides.eq(a).addClass("slick-center")):a>=0&&a<=b.slideCount-b.options.slidesToShow?b.$slides.slice(a,a+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):d.length<=b.options.slidesToShow?d.addClass("slick-active").attr("aria-hidden","false"):(f=b.slideCount%b.options.slidesToShow,e=b.options.infinite===!0?b.options.slidesToShow+a:a,b.options.slidesToShow==b.options.slidesToScroll&&b.slideCount-a<b.options.slidesToShow?d.slice(e-(b.options.slidesToShow-f),e+f).addClass("slick-active").attr("aria-hidden","false"):d.slice(e,e+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")),"ondemand"===b.options.lazyLoad&&b.lazyLoad()},b.prototype.setupInfinite=function(){var c,d,e,b=this;if(b.options.fade===!0&&(b.options.centerMode=!1),b.options.infinite===!0&&b.options.fade===!1&&(d=null,b.slideCount>b.options.slidesToShow)){for(e=b.options.centerMode===!0?b.options.slidesToShow+1:b.options.slidesToShow,c=b.slideCount;c>b.slideCount-e;c-=1)d=c-1,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d-b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");for(c=0;e>c;c+=1)d=c,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d+b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");b.$slideTrack.find(".slick-cloned").find("[id]").each(function(){a(this).attr("id","")})}},b.prototype.setPaused=function(a){var b=this;b.options.autoplay===!0&&b.options.pauseOnHover===!0&&(b.paused=a,a?b.autoPlayClear():b.autoPlay())},b.prototype.selectHandler=function(b){var c=this,d=a(b.target).is(".slick-slide")?a(b.target):a(b.target).parents(".slick-slide"),e=parseInt(d.attr("data-slick-index"));return e||(e=0),c.slideCount<=c.options.slidesToShow?(c.setSlideClasses(e),void c.asNavFor(e)):void c.slideHandler(e)},b.prototype.slideHandler=function(a,b,c){var d,e,f,g,h=null,i=this;return b=b||!1,i.animating===!0&&i.options.waitForAnimate===!0||i.options.fade===!0&&i.currentSlide===a||i.slideCount<=i.options.slidesToShow?void 0:(b===!1&&i.asNavFor(a),d=a,h=i.getLeft(d),g=i.getLeft(i.currentSlide),i.currentLeft=null===i.swipeLeft?g:i.swipeLeft,i.options.infinite===!1&&i.options.centerMode===!1&&(0>a||a>i.getDotCount()*i.options.slidesToScroll)?void(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d);
}):i.postSlide(d))):i.options.infinite===!1&&i.options.centerMode===!0&&(0>a||a>i.slideCount-i.options.slidesToScroll)?void(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d)}):i.postSlide(d))):(i.options.autoplay===!0&&clearInterval(i.autoPlayTimer),e=0>d?i.slideCount%i.options.slidesToScroll!==0?i.slideCount-i.slideCount%i.options.slidesToScroll:i.slideCount+d:d>=i.slideCount?i.slideCount%i.options.slidesToScroll!==0?0:d-i.slideCount:d,i.animating=!0,i.$slider.trigger("beforeChange",[i,i.currentSlide,e]),f=i.currentSlide,i.currentSlide=e,i.setSlideClasses(i.currentSlide),i.updateDots(),i.updateArrows(),i.options.fade===!0?(c!==!0?(i.fadeSlideOut(f),i.fadeSlide(e,function(){i.postSlide(e)})):i.postSlide(e),void i.animateHeight()):void(c!==!0?i.animateSlide(h,function(){i.postSlide(e)}):i.postSlide(e))))},b.prototype.startLoad=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.hide(),a.$nextArrow.hide()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.hide(),a.$slider.addClass("slick-loading")},b.prototype.swipeDirection=function(){var a,b,c,d,e=this;return a=e.touchObject.startX-e.touchObject.curX,b=e.touchObject.startY-e.touchObject.curY,c=Math.atan2(b,a),d=Math.round(180*c/Math.PI),0>d&&(d=360-Math.abs(d)),45>=d&&d>=0?e.options.rtl===!1?"left":"right":360>=d&&d>=315?e.options.rtl===!1?"left":"right":d>=135&&225>=d?e.options.rtl===!1?"right":"left":e.options.verticalSwiping===!0?d>=35&&135>=d?"left":"right":"vertical"},b.prototype.swipeEnd=function(a){var c,b=this;if(b.dragging=!1,b.shouldClick=b.touchObject.swipeLength>10?!1:!0,void 0===b.touchObject.curX)return!1;if(b.touchObject.edgeHit===!0&&b.$slider.trigger("edge",[b,b.swipeDirection()]),b.touchObject.swipeLength>=b.touchObject.minSwipe)switch(b.swipeDirection()){case"left":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide+b.getSlideCount()):b.currentSlide+b.getSlideCount(),b.slideHandler(c),b.currentDirection=0,b.touchObject={},b.$slider.trigger("swipe",[b,"left"]);break;case"right":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide-b.getSlideCount()):b.currentSlide-b.getSlideCount(),b.slideHandler(c),b.currentDirection=1,b.touchObject={},b.$slider.trigger("swipe",[b,"right"])}else b.touchObject.startX!==b.touchObject.curX&&(b.slideHandler(b.currentSlide),b.touchObject={})},b.prototype.swipeHandler=function(a){var b=this;if(!(b.options.swipe===!1||"ontouchend"in document&&b.options.swipe===!1||b.options.draggable===!1&&-1!==a.type.indexOf("mouse")))switch(b.touchObject.fingerCount=a.originalEvent&&void 0!==a.originalEvent.touches?a.originalEvent.touches.length:1,b.touchObject.minSwipe=b.listWidth/b.options.touchThreshold,b.options.verticalSwiping===!0&&(b.touchObject.minSwipe=b.listHeight/b.options.touchThreshold),a.data.action){case"start":b.swipeStart(a);break;case"move":b.swipeMove(a);break;case"end":b.swipeEnd(a)}},b.prototype.swipeMove=function(a){var d,e,f,g,h,b=this;return h=void 0!==a.originalEvent?a.originalEvent.touches:null,!b.dragging||h&&1!==h.length?!1:(d=b.getLeft(b.currentSlide),b.touchObject.curX=void 0!==h?h[0].pageX:a.clientX,b.touchObject.curY=void 0!==h?h[0].pageY:a.clientY,b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curX-b.touchObject.startX,2))),b.options.verticalSwiping===!0&&(b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curY-b.touchObject.startY,2)))),e=b.swipeDirection(),"vertical"!==e?(void 0!==a.originalEvent&&b.touchObject.swipeLength>4&&a.preventDefault(),g=(b.options.rtl===!1?1:-1)*(b.touchObject.curX>b.touchObject.startX?1:-1),b.options.verticalSwiping===!0&&(g=b.touchObject.curY>b.touchObject.startY?1:-1),f=b.touchObject.swipeLength,b.touchObject.edgeHit=!1,b.options.infinite===!1&&(0===b.currentSlide&&"right"===e||b.currentSlide>=b.getDotCount()&&"left"===e)&&(f=b.touchObject.swipeLength*b.options.edgeFriction,b.touchObject.edgeHit=!0),b.options.vertical===!1?b.swipeLeft=d+f*g:b.swipeLeft=d+f*(b.$list.height()/b.listWidth)*g,b.options.verticalSwiping===!0&&(b.swipeLeft=d+f*g),b.options.fade===!0||b.options.touchMove===!1?!1:b.animating===!0?(b.swipeLeft=null,!1):void b.setCSS(b.swipeLeft)):void 0)},b.prototype.swipeStart=function(a){var c,b=this;return 1!==b.touchObject.fingerCount||b.slideCount<=b.options.slidesToShow?(b.touchObject={},!1):(void 0!==a.originalEvent&&void 0!==a.originalEvent.touches&&(c=a.originalEvent.touches[0]),b.touchObject.startX=b.touchObject.curX=void 0!==c?c.pageX:a.clientX,b.touchObject.startY=b.touchObject.curY=void 0!==c?c.pageY:a.clientY,void(b.dragging=!0))},b.prototype.unfilterSlides=b.prototype.slickUnfilter=function(){var a=this;null!==a.$slidesCache&&(a.unload(),a.$slideTrack.children(this.options.slide).detach(),a.$slidesCache.appendTo(a.$slideTrack),a.reinit())},b.prototype.unload=function(){var b=this;a(".slick-cloned",b.$slider).remove(),b.$dots&&b.$dots.remove(),b.$prevArrow&&b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.remove(),b.$nextArrow&&b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.remove(),b.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},b.prototype.unslick=function(a){var b=this;b.$slider.trigger("unslick",[b,a]),b.destroy()},b.prototype.updateArrows=function(){var b,a=this;b=Math.floor(a.options.slidesToShow/2),a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&!a.options.infinite&&(a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===a.currentSlide?(a.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-a.options.slidesToShow&&a.options.centerMode===!1?(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-1&&a.options.centerMode===!0&&(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},b.prototype.updateDots=function(){var a=this;null!==a.$dots&&(a.$dots.find("li").removeClass("slick-active").attr("aria-hidden","true"),a.$dots.find("li").eq(Math.floor(a.currentSlide/a.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden","false"))},b.prototype.visibility=function(){var a=this;document[a.hidden]?(a.paused=!0,a.autoPlayClear()):a.options.autoplay===!0&&(a.paused=!1,a.autoPlay())},b.prototype.initADA=function(){var b=this;b.$slides.add(b.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),b.$slideTrack.attr("role","listbox"),b.$slides.not(b.$slideTrack.find(".slick-cloned")).each(function(c){a(this).attr({role:"option","aria-describedby":"slick-slide"+b.instanceUid+c})}),null!==b.$dots&&b.$dots.attr("role","tablist").find("li").each(function(c){a(this).attr({role:"presentation","aria-selected":"false","aria-controls":"navigation"+b.instanceUid+c,id:"slick-slide"+b.instanceUid+c})}).first().attr("aria-selected","true").end().find("button").attr("role","button").end().closest("div").attr("role","toolbar"),b.activateADA()},b.prototype.activateADA=function(){var a=this;a.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},b.prototype.focusHandler=function(){var b=this;b.$slider.on("focus.slick blur.slick","*",function(c){c.stopImmediatePropagation();var d=a(this);setTimeout(function(){b.isPlay&&(d.is(":focus")?(b.autoPlayClear(),b.paused=!0):(b.paused=!1,b.autoPlay()))},0)})},a.fn.slick=function(){var f,g,a=this,c=arguments[0],d=Array.prototype.slice.call(arguments,1),e=a.length;for(f=0;e>f;f++)if("object"==typeof c||"undefined"==typeof c?a[f].slick=new b(a[f],c):g=a[f].slick[c].apply(a[f].slick,d),"undefined"!=typeof g)return g;return a}});
function ssc_init() {
    if (!document.body) return;
    var e = document.body;
    var t = document.documentElement;
    var n = window.innerHeight;
    var r = e.scrollHeight;

    ssc_root = document.compatMode.indexOf("CSS") >= 0 ? t : e;
    ssc_activeElement = e;
    ssc_initdone = true;

    if (top != self)
        ssc_frame = true;

    else if (r > n && (e.offsetHeight <= n || t.offsetHeight <= n)) {
        ssc_root.style.height = "auto";
        if (ssc_root.offsetHeight <= n) {
            var i = document.createElement("div");
            i.style.clear = "both";
            e.appendChild(i)
        }
    }

    if (!ssc_fixedback) {
        e.style.backgroundAttachment = "scroll";
        t.style.backgroundAttachment = "scroll"
    }

    if (ssc_keyboardsupport)
        ssc_addEvent("keydown", ssc_keydown);
}

function ssc_scrollArray(e, t, n, r) {
    r || (r = 1e3);
    ssc_directionCheck(t, n);
    ssc_que.push({
        x: t,
        y: n,
        lastX: t < 0 ? .99 : -.99,
        lastY: n < 0 ? .99 : -.99,
        start: +(new Date)
    });

    if (ssc_pending)
        return;

    var i = function () {
        var s = +(new Date);
        var o = 0;
        var u = 0;
        for (var a = 0; a < ssc_que.length; a++) {
            var f = ssc_que[a];
            var l = s - f.start;
            var c = l >= ssc_animtime;
            var h = c ? 1 : l / ssc_animtime;
            if (ssc_pulseAlgorithm) {
                h = ssc_pulse(h)
            }
            var p = f.x * h - f.lastX >> 0;
            var d = f.y * h - f.lastY >> 0;
            o += p;
            u += d;
            f.lastX += p;
            f.lastY += d;
            if (c) {
                ssc_que.splice(a, 1);
                a--
            }
        }
        if (t) {
            var v = e.scrollLeft;
            e.scrollLeft += o;
            if (o && e.scrollLeft === v) {
                t = 0
            }
        }
        if (n) {
            var m = e.scrollTop;
            e.scrollTop += u;
            if (u && e.scrollTop === m) {
                n = 0
            }
        }
        if (!t && !n)
            ssc_que = [];

        if (ssc_que.length)
            setTimeout(i, r / ssc_framerate + 1);
        else
            ssc_pending = false;
    };
    setTimeout(i, 0);
    ssc_pending = true
}

function ssc_wheel(e) {
    if (!ssc_initdone) {
        ssc_init()
    }
    var t = e.target;
    var n = ssc_overflowingAncestor(t);
    if (!n || e.defaultPrevented || ssc_isNodeName(ssc_activeElement, "embed") || ssc_isNodeName(t, "embed") && /\.pdf/i.test(t.src)) {
        return true
    }
    var r = e.wheelDeltaX || 0;
    var i = e.wheelDeltaY || 0;
    if (!r && !i)
        i = e.wheelDelta || 0;

    if (Math.abs(r) > 1.2)
        r *= ssc_stepsize / 120;

    if (Math.abs(i) > 1.2)
        i *= ssc_stepsize / 120;

    ssc_scrollArray(n, -r, -i);
    e.preventDefault()
}

function ssc_keydown(e) {
    var t = e.target;
    var n = e.ctrlKey || e.altKey || e.metaKey;

    if (/input|textarea|embed/i.test(t.nodeName) || t.isContentEditable || e.defaultPrevented || n)
        return true;

    if (ssc_isNodeName(t, "button") && e.keyCode === ssc_key.spacebar)
        return true;

    var r, i = 0,
        s = 0;
    var o = ssc_overflowingAncestor(ssc_activeElement);
    var u = o.clientHeight;

    if (o == document.body)
        u = window.innerHeight;

    switch (e.keyCode) {
        case ssc_key.up:
            s = -ssc_arrowscroll;
            break;
        case ssc_key.down:
            s = ssc_arrowscroll;
            break;
        case ssc_key.spacebar:
            r = e.shiftKey ? 1 : -1;
            s = -r * u * .9;
            break;
        case ssc_key.pageup:
            s = -u * .9;
            break;
        case ssc_key.pagedown:
            s = u * .9;
            break;
        case ssc_key.home:
            s = -o.scrollTop;
            break;
        case ssc_key.end:
            var a = o.scrollHeight - o.scrollTop - u;
            s = a > 0 ? a + 10 : 0;
            break;
        case ssc_key.left:
            i = -ssc_arrowscroll;
            break;
        case ssc_key.right:
            i = ssc_arrowscroll;
            break;
        default:
            return true
    }
    ssc_scrollArray(o, i, s);
    e.preventDefault()
}

function ssc_mousedown(e) {
    ssc_activeElement = e.target
}

function ssc_setCache(e, t) {
    for (var n = e.length; n--;) ssc_cache[ssc_uniqueID(e[n])] = t;
    return t
}

function ssc_overflowingAncestor(e) {
    var t = [];
    var n = ssc_root.scrollHeight;
    do {
        var r = ssc_cache[ssc_uniqueID(e)];
        if (r) {
            return ssc_setCache(t, r)
        }
        t.push(e);
        if (n === e.scrollHeight) {
            if (!ssc_frame || ssc_root.clientHeight + 10 < n) {
                return ssc_setCache(t, document.body)
            }
        } else if (e.clientHeight + 10 < e.scrollHeight) {
            overflow = getComputedStyle(e, "").getPropertyValue("overflow");
            if (overflow === "scroll" || overflow === "auto") {
                return ssc_setCache(t, e)
            }
        }
    }
    while (e = e.parentNode)
}

function ssc_addEvent(e, t, n) {
    window.addEventListener(e, t, n || false)
}

function ssc_removeEvent(e, t, n) {
    window.removeEventListener(e, t, n || false)
}

function ssc_isNodeName(e, t) {
    return e.nodeName.toLowerCase() === t.toLowerCase()
}

function ssc_directionCheck(e, t) {
    e = e > 0 ? 1 : -1;
    t = t > 0 ? 1 : -1;
    if (ssc_direction.x !== e || ssc_direction.y !== t) {
        ssc_direction.x = e;
        ssc_direction.y = t;
        ssc_que = []
    }
}

function ssc_pulse_(e) {
    var t, n, r;
    e = e * ssc_pulseScale;
    if (e < 1) {
        t = e - (1 - Math.exp(-e))
    } else {
        n = Math.exp(-1);
        e -= 1;
        r = 1 - Math.exp(-e);
        t = n + r * (1 - n)
    }
    return t * ssc_pulseNormalize
}

function ssc_pulse(e) {
    if (e >= 1) return 1;
    if (e <= 0) return 0;
    if (ssc_pulseNormalize == 1) {
        ssc_pulseNormalize /= ssc_pulse_(1)
    }
    return ssc_pulse_(e)
}

var ssc_framerate = 150;
var ssc_animtime = 500;
var ssc_stepsize = 150;
var ssc_pulseAlgorithm = true;
var ssc_pulseScale = 6;
var ssc_pulseNormalize = 1;
var ssc_keyboardsupport = true;
var ssc_arrowscroll = 50;
var ssc_frame = false;
var ssc_direction = {
    x: 0,
    y: 0
};
var ssc_initdone = false;
var ssc_fixedback = true;
var ssc_root = document.documentElement;
var ssc_activeElement;
var ssc_key = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    spacebar: 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36
};
var ssc_que = [];
var ssc_pending = false;
var ssc_cache = {};

setInterval(function () {
    ssc_cache = {}
}, 10 * 1e3);

var ssc_uniqueID = function () {
    var e = 0;
    return function (t) {
        return t.ssc_uniqueID || (t.ssc_uniqueID = e++)
    }
}();

var ischrome = /chrome/.test(navigator.userAgent.toLowerCase());
if (ischrome) {
    ssc_addEvent("mousedown", ssc_mousedown);
    ssc_addEvent("mousewheel", ssc_wheel);
    ssc_addEvent("load", ssc_init)
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJqcXVlcnkuZWFzaW5nLjEuMy5qcyIsInNsaWNrLm1pbi5qcyIsInNtb290aHNjcm9sbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3bEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBNYWluLmpzICovXHJcblxyXG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCQpIHtcclxuXHJcbi8vIGNvbnNvbGUudGltZSgnbGFiZWwnKTtcclxuXHJcbnZhciBib290c3RyYXBXaWR0aCA9IDc2ODsgLy8gV2hlbiB3aWR0aCB0dXJucyBmcm9tIGZsdWlkIHRvIGZpeGVkXHJcblxyXG4vLyBlYXN5IGNvbnNvbGUgbG9nXHJcbmZ1bmN0aW9uIGMoc3RyaW5nKSB7XHJcblx0dmFyIHggPSBjb25zb2xlLmxvZyhzdHJpbmcpO1xyXG5cdHJldHVybiB4O1xyXG59XHJcblxyXG4vLyBHbG9iYWwgY2hlY2sgV0lEVEggISEhISEhISEhISEhISEhISEhISEhISEhIE5vdCBIZWlnaHRcclxuZnVuY3Rpb24gY2hlY2tIZWlnaHQod2luZG93V2lkdGgpIHsgLy8gdGhpcyBzaG91bGQgYmUgV2lkdGggbm90IGhlaWdodCA6L1xyXG5cdGlmICh3aW5kb3dXaWR0aCA+PSBib290c3RyYXBXaWR0aCkge1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fSBlbHNlIGlmICh3aW5kb3dXaWR0aCA8IGJvb3RzdHJhcFdpZHRoKSB7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG59XHJcblxyXG4vLyBWaWV3IE1lbnUgb24gTW9iaWxlIERldmljZXMgXHJcbihmdW5jdGlvbiBzaG93TW9iaWxlTWVudSgpIHtcclxuXHR2YXIgY292ZXIgPSAkKCc8ZGl2IGNsYXNzPVwiY292ZXJcIj48L2Rpdj4nKTtcclxuXHR2YXIgJGhlYWRlciA9ICQoJy5oZWFkZXInKTtcclxuXHQkKCcuaGFtYnVyZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHQvLyB0aGlzIGlzIGJlY2F1c2UgJ2Rpc3BsYXk6IGJsb2NrJyBtZXNzZXMgdXAgbGFyZ2Ugc2NyZWVuIG1vZGVcclxuXHRcdCQoJy5oZWFkZXJfX21vYmlsZS1jb2xsYXBzZScpLnRvZ2dsZUNsYXNzKCdzaG93LWlubGluZS1ibG9jaycpO1xyXG5cdFx0Ly8gdGhpcyBhZGRzIG92ZXJmbG93IGZvciBzY3JvbGxpbmdcclxuXHRcdCRoZWFkZXIudG9nZ2xlQ2xhc3MoJ21vYmlsZS1zY3JvbGwnKTtcclxuXHRcdC8vIGFkZHMgYmFja2dyb3VuZCB0aGF0IGNhbiBiZSBwcmVzc2VkIHRvIGNsb3NlIG1lbnVcclxuXHRcdGNvdmVyLmFwcGVuZFRvKCcuaGVhZGVyJyk7XHJcblx0XHRpZiAoJGhlYWRlci5oYXNDbGFzcygnbW9iaWxlLXNjcm9sbCcpKSB7XHJcblx0XHRcdC8vIGFkZCBldmVudCBsaXN0ZW5lclxyXG5cdFx0XHQkaGVhZGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR2YXIgY291bnQgPSAkKCcuaGVhZGVyLWJhY2tncm91bmQnKS5vdXRlckhlaWdodCgpICsgJCgnLmhlYWRlcl9fbW9iaWxlLWNvbGxhcHNlJykub3V0ZXJIZWlnaHQoKSArICQoJy5tb3JlLWxpbmtzJykub3V0ZXJIZWlnaHQoKTtcclxuXHRcdFx0XHQkKCdib2R5JykuY3NzKHtcclxuXHRcdFx0XHRcdCdvdmVyZmxvdyc6ICdoaWRkZW4nLFxyXG5cdFx0XHRcdFx0J21heC1oZWlnaHQnOiBjb3VudFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0JCgnLmNvdmVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdCQoJy5oYW1idXJnZXInKS50cmlnZ2VyKCdjbGljaycpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIHJlbW92ZXMgZXZlbnQgbGlzdGVuZXJcclxuXHRcdFx0JGhlYWRlci5vZmYoKTtcclxuXHRcdFx0JCgnLmNvdmVyJykucmVtb3ZlKCk7XHJcblx0XHRcdCQoJ2JvZHknKS5hdHRyKCdzdHlsZScsICcnKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblxyXG59KSgpO1xyXG5cclxuLy8gTmF2aWdhdGlvbiBNZW51IEZ1bmN0aW9uYWxpdHlcclxuKGZ1bmN0aW9uIGRyb3BEb3duTWVudSgpIHsgLy8gTmV3XHJcblx0dmFyICRtZW51ID0gJCgnLm5hdmlnYXRpb25fX2l0ZW0tLXBhcmVudCcpOyAvLyB0aGlzIGdldHMgY2xpY2tzXHJcblx0dmFyICRkcm9wZG93biA9ICQoJy5kcm9wZG93bi1tZW51X19oaWRkZW4nKTsgLy8gdGhpcyBnZXRzIHBpY2tlZFxyXG5cclxuXHR2YXIgZHJvcGRvd25DbGFzcyA9ICduYXZpZ2F0aW9uX19wcm9kdWN0LWNhdGVnb3JpZXMnO1xyXG5cdFxyXG5cclxuXHQvLyBNYWluIExvZ2ljIHdoZW4gdXNlciBjbGlja3MgYSBsaW5rXHJcblx0JG1lbnUub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cdFx0dmFyIHRhcmdldCA9ICR0aGlzLmF0dHIoXCJidXR0b25cIik7XHJcblx0XHR2YXIgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHRcdGlmIChjaGVja0hlaWdodCh3aW5kb3dXaWR0aCkpIHtcclxuXHRcdFx0cmVtb3ZlTW9yZUxpbmtzKHRydWUpO1xyXG5cdFx0fVxyXG5cdFx0Ly8gY2hlY2sgY2xpY2tlZCBzdGF0dXMgb2YgaXRlbVxyXG5cdFx0aWYgKCR0aGlzLmhhc0NsYXNzKCdzZWxlY3RlZCcpKSB7IFxyXG5cdFx0XHQvLyBoaWRlIHRoaXMgc3VibWVudVxyXG5cdFx0XHRoaWRlRHJvcGRvd24oY2hlY2tIZWlnaHQod2luZG93V2lkdGgpLCB0cnVlKTtcclxuXHRcdH0gZWxzZSBpZiAoJHRoaXMuc2libGluZ3MoKS5oYXNDbGFzcygnc2VsZWN0ZWQnKSkge1xyXG5cdFx0XHQvLyBoaWRlIG90aGVyIGRyb3Bkb3duIChub3QgYnkgc2xpZGVVcClcclxuXHRcdFx0aGlkZURyb3Bkb3duKGNoZWNrSGVpZ2h0KHdpbmRvd1dpZHRoKSwgZmFsc2UpO1xyXG5cdFx0XHQvLyBhZGQgc2VsZWN0ZWQgIHRvIHRoaXNcclxuXHRcdFx0JHRoaXMuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblx0XHRcdC8vIHNob3cgdGhpcyBkcm9wZG93blxyXG5cdFx0XHQvLyB2YXIgZHJvcGRvd24gPSBnZXREcm9wZG93bih0YXJnZXQpO1xyXG5cdFx0XHRkaXNwbGF5RHJvcGRvd24oJHRoaXMsIGdldERyb3Bkb3duKHRhcmdldCksIGNoZWNrSGVpZ2h0KHdpbmRvd1dpZHRoKSwgZmFsc2UpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gYWRkIHNlbGVjdGVkIHRvIHRoaXNcclxuXHRcdFx0JHRoaXMuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblx0XHRcdC8vIGZpbmQgcmVsYXRlZCBkcm9wZG93biBcclxuXHRcdFx0Ly8gdmFyIGRyb3Bkb3duID0gZ2V0RHJvcGRvd24odGFyZ2V0KTtcclxuXHRcdFx0Ly8gZGlzcGxheSBkcm9wZG93blxyXG5cdFx0XHRkaXNwbGF5RHJvcGRvd24oJHRoaXMsIGdldERyb3Bkb3duKHRhcmdldCksIGNoZWNrSGVpZ2h0KHdpbmRvd1dpZHRoKSwgdHJ1ZSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdC8vIEhFTFBFUiBGVU5DVElPTlNcclxuXHRmdW5jdGlvbiBnZXREcm9wZG93bih0YXJnZXQpIHtcclxuXHRcdHZhciBkcm9wZG93biA9ICRkcm9wZG93bi5maW5kKCQoJ1tkcm9wZG93bj1cIicgKyB0YXJnZXQgKyAnXCJdJykpO1xyXG5cdFx0cmV0dXJuIGRyb3Bkb3duO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBkaXNwbGF5RHJvcGRvd24obWVudSwgZHJvcGRvd24sIGxhcmdlU2NyZWVuLCBkb0FuaW1hdGUpIHtcclxuXHRcdGlmIChsYXJnZVNjcmVlbikge1xyXG5cdFx0XHRpZiAoZG9BbmltYXRlKSB7XHJcblx0XHRcdFx0YW5pbWF0ZURyb3Bkb3duKGRyb3Bkb3duLCBsYXJnZVNjcmVlbiwgJ3VwJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIGRyb3Bkb3duSGVpZ2h0ID0gXCItXCIrZHJvcGRvd24uaGVpZ2h0KCkrXCJweFwiO1xyXG5cdFx0XHRcdGRyb3Bkb3duLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0XHRcdFx0JGRyb3Bkb3duLmNzcygnYm90dG9tJywgZHJvcGRvd25IZWlnaHQpXHJcblx0XHRcdFx0XHQuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHRcdGhlaWdodDogZHJvcGRvd24uaGVpZ2h0KClcclxuXHRcdFx0XHRcdH0sIDIwMCwgJ2Vhc2VPdXRTaW5lJyk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQoJy5uYXZpZ2F0aW9uLS1wYXJlbnQgLm5hdmlnYXRpb25fX3Byb2R1Y3QtY2F0ZWdvcmllcycpLnJlbW92ZSgpO1xyXG5cdFx0XHRkcm9wZG93bi5jbG9uZSgpLmluc2VydEFmdGVyKG1lbnUpLnNob3coKTtcclxuXHRcdFx0Ly8gdG9kbzogYWRkIGFuaW1hdGlvbiBmb3Igc3VibWVudXMgdG8gYXBwZWFyL2Rpc2FwcGVhclxyXG5cdFx0XHQvLyB2YXIgcmVwbGFjZWREcm9wZG93biA9IGRyb3Bkb3duLmNsb25lKCkuaW5zZXJ0QWZ0ZXIobWVudSkuc2xpZGVEb3duKHtcclxuXHRcdFx0Ly8gXHRkdXJhdGlvbjogNzAwLFxyXG5cdFx0XHQvLyBcdG1ldGhvZDogJ2Vhc2VJbk91dEN1YmljJ1xyXG5cdFx0XHQvLyB9KTtcclxuXHRcdFx0Ly8gYW5pbWF0ZURyb3Bkb3duKHJlcGxhY2VkRHJvcGRvd24sIGxhcmdlU2NyZWVuKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIEhpZGUgdGhlIHN1Yi1tZW51XHJcblx0ZnVuY3Rpb24gaGlkZURyb3Bkb3duKGxhcmdlU2NyZWVuLCBkb0FuaW1hdGUpIHtcclxuXHRcdC8vIGlmIGxhcmdlIHNjcmVlbiAtIGhpZGUgYWxsIGRpdnMgaW4gLmRyb3Bkb3duLW1lbnVfX2hpZGRlblxyXG5cdFx0aWYgKGRvQW5pbWF0ZSkge1xyXG5cdFx0XHRpZiAobGFyZ2VTY3JlZW4pIHtcclxuXHRcdFx0XHRhbmltYXRlRHJvcGRvd24oJGRyb3Bkb3duLmZpbmQoJy5uYXZpZ2F0aW9uX19wcm9kdWN0LWNhdGVnb3JpZXMnKSwgbGFyZ2VTY3JlZW4sICdkb3duJyk7XHJcblx0XHRcdFx0Ly8gXHJcblx0XHRcdH0gZWxzZSBpZiAoIWxhcmdlU2NyZWVuKSB7XHJcblx0XHRcdFx0Ly8gaWYgc21hbGwgcmVtb3ZlIGRyb3Bkb3duIHVuZGVyIC5zZWxlY3RlZFxyXG5cdFx0XHRcdCRtZW51LnNpYmxpbmdzKCcubmF2aWdhdGlvbl9fcHJvZHVjdC1jYXRlZ29yaWVzJykucmVtb3ZlKCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmIChsYXJnZVNjcmVlbikge1xyXG5cdFx0XHRcdCRkcm9wZG93bi5maW5kKCcubmF2aWdhdGlvbl9fcHJvZHVjdC1jYXRlZ29yaWVzJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKS5hdHRyKCdzdHlsZScsJycpO1xyXG5cdFx0XHRcdC8vIFxyXG5cdFx0XHR9IGVsc2UgaWYgKCFsYXJnZVNjcmVlbikge1xyXG5cdFx0XHRcdC8vIGlmIHNtYWxsIHJlbW92ZSBkcm9wZG93biB1bmRlciAuc2VsZWN0ZWRcclxuXHRcdFx0XHQkbWVudS5zaWJsaW5ncygnLm5hdmlnYXRpb25fX3Byb2R1Y3QtY2F0ZWdvcmllcycpLnJlbW92ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkbWVudS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFuaW1hdGVEcm9wZG93bihkcm9wZG93biwgbGFyZ2VTY3JlZW4sIGRpcmVjdGlvbikge1xyXG5cdFx0Ly8gc2VlIGh0dHA6Ly9lYXNpbmdzLm5ldC8gZm9yIGVhc2luZyBleGFtcGxlc1xyXG5cdFx0Ly8gdmFyIGRyb3Bkb3duSGVpZ2h0ID0gJyc7XHJcblx0XHRpZiAobGFyZ2VTY3JlZW4pIHtcclxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xyXG5cdFx0XHRcdGRyb3Bkb3duLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0XHRcdFx0JGRyb3Bkb3duXHJcblx0XHRcdFx0XHQuY3NzKCdoZWlnaHQnLCBkcm9wZG93bi5oZWlnaHQoKSlcclxuXHRcdFx0XHRcdC5jc3MoJ3RvcCcsICctJytkcm9wZG93bi5oZWlnaHQoKSsncHgnKVxyXG5cdFx0XHRcdFx0LmFuaW1hdGUoe1xyXG5cdFx0XHRcdFx0XHR0b3A6IDBcclxuXHRcdFx0XHRcdH0sIDQwMCwgJ2Vhc2VPdXRTaW5lJyk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuXHRcdFx0XHQkZHJvcGRvd24uYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHR0b3A6ICctJytkcm9wZG93bi5oZWlnaHQoKSsncHgnXHJcblx0XHRcdFx0fSwgNDAwLCAnZWFzZU91dFNpbmUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdCRkcm9wZG93bi5jc3MoJ2hlaWdodCcsIDApO1xyXG5cdFx0XHRcdFx0ZHJvcGRvd24ucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblxyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRkcm9wZG93bi5hZGRDbGFzcygnc2hvdycpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gTGlua3MgZm9yIGNoYW5naW5nIGxhbmd1YWdlLCBzZWFyY2ggZXRjXHJcblx0KGZ1bmN0aW9uIG1vcmVMaW5rcygpIHtcclxuXHRcdHZhciAkbWVudSA9ICQoJy5pY29uLWxpbmtzJyk7XHJcblx0XHR2YXIgJG1lbnVMaW5rID0gJG1lbnUuY2hpbGRyZW4oJ2xpJyk7XHJcblx0XHR2YXIgJGRyb3Bkb3duID0gJCgnLm1vcmUtbGlua3NfX2Ryb3Bkb3ducycpO1xyXG5cdFx0JG1lbnVMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblx0XHRcdHZhciB0YXJnZXQgPSAkdGhpcy5hdHRyKFwiYnV0dG9uXCIpO1xyXG5cdFx0XHR2YXIgJGNob3NlbiA9ICRkcm9wZG93bi5maW5kKCQoJ1tkcm9wZG93bj1cIicgKyB0YXJnZXQgKyAnXCJdJykpOyAvLyBnZXQgcmlnaHQgZHJvcGRvd24gaXRlbVxyXG5cdFx0XHR2YXIgbWVudUhlaWdodCA9ICRtZW51LmhlaWdodCgpO1xyXG5cdFx0XHR2YXIgZHJvcGRvd25IZWlnaHQgPSAkY2hvc2VuLmhlaWdodCgpO1xyXG5cdFx0XHR2YXIgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHRcdFx0aWYgIChjaGVja0hlaWdodCh3aW5kb3dXaWR0aCkpIHtcclxuXHRcdFx0XHRoaWRlRHJvcGRvd24odHJ1ZSwgdHJ1ZSk7XHJcblx0XHRcdFx0aWYgKCR0aGlzLmhhc0NsYXNzKCdzZWxlY3RlZCcpKSB7IFxyXG5cdFx0XHRcdFx0Ly8gaGlkZSBkcm9wZG93blxyXG5cdFx0XHRcdFx0JHRoaXMucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblx0XHRcdFx0XHQkY3VycmVudFNlbGVjdGlvbi5hbmltYXRlKHsndG9wJzogJy0nICsgJGN1cnJlbnRTZWxlY3Rpb24uaGVpZ2h0KCkgKyAncHgnfSwgNDAwLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHQkY3VycmVudFNlbGVjdGlvbiA9ICcnO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoJHRoaXMuc2libGluZ3MoKS5oYXNDbGFzcygnc2VsZWN0ZWQnKSkge1xyXG5cdFx0XHRcdFx0Ly8gc3dhcCBvcGVuIGRyb3Bkb3duIGZvciBuZXcgKGRvbid0IGFuaW1hdGUpXHJcblx0XHRcdFx0XHQkdGhpcy5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG5cdFx0XHRcdFx0JHRoaXMuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblx0XHRcdFx0XHQkY3VycmVudFNlbGVjdGlvbi5yZW1vdmVDbGFzcygnc2hvdycpLmNzcygnICcpO1xyXG5cdFx0XHRcdFx0JGNob3Nlbi5jc3Moe3RvcDogbWVudUhlaWdodH0pLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0XHRcdFx0XHQkY3VycmVudFNlbGVjdGlvbiA9ICRjaG9zZW47XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIGFkZCBzZWxlY3RlZCB0byB0aGlzXHJcblx0XHRcdFx0XHQkdGhpcy5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHRcdFx0XHRcdCRjaG9zZW4uY3NzKCd0b3AnLCAnLScgKyBkcm9wZG93bkhlaWdodCArICdweCcpLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0XHRcdFx0XHQkY2hvc2VuLmFuaW1hdGUoe3RvcDogbWVudUhlaWdodH0sIDUwMCwgJ2Vhc2VPdXRTaW5lJyk7XHJcblx0XHRcdFx0XHQkY3VycmVudFNlbGVjdGlvbiA9ICRjaG9zZW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKCEkdGhpcy5oYXNDbGFzcygnc2VsZWN0ZWQnKSkge1xyXG5cdFx0XHRcdCRtZW51TGluay5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHRcdFx0XHQkdGhpcy5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHRcdFx0XHQkKCcubW9yZS1saW5rc19fZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0XHRcdCRjaG9zZW4uYWRkQ2xhc3MoJ3Nob3cnKTtcdFxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCR0aGlzLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG5cdFx0XHRcdCRjaG9zZW4ucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdFx0XHQkY3VycmVudFNlbGVjdGlvbiA9ICcnO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KSgpO1xyXG5cclxuXHRmdW5jdGlvbiByZW1vdmVNb3JlTGlua3MoYW5pbWF0ZSkge1xyXG5cdFx0aWYgKCQoJy5pY29uLWxpbmsnKS5oYXNDbGFzcygnc2VsZWN0ZWQnKSkge1xyXG5cdFx0XHQkKCcuaWNvbi1saW5rJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblx0XHRcdHZhciBkcm9wZG93biA9ICQoJy5tb3JlLWxpbmtzX19kcm9wZG93bnMgLnNob3cnKTtcclxuXHRcdFx0aWYgKGFuaW1hdGUpIHtcclxuXHRcdFx0XHRkcm9wZG93bi5hbmltYXRlKHsndG9wJzogJy0nICsgZHJvcGRvd24uaGVpZ2h0KCkgKyAncHgnfSwgNDAwLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoJ3Nob3cnKS5jc3MoJyAnKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRkcm9wZG93bi5jc3Moeyd0b3AnOjB9KS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBUaGlzIGNoZWNrcyB3aGV0aGVyIHRoZSB1c2VyIGhhcyByZXNpemVkIHRoZSB3aW5kb3dcclxuXHQvLyBJZiBtb3ZlZCBmcm9tIG1vYmlsZSB0byBkZXNrdG9wICgmIHZpY2UtdmVyc2EpXHJcblx0Ly8gcmVzZXRzIG1lbnVzIHRvIHByb3ZlbnQgd2VpcmRuZXNzXHJcblx0dmFyIHJlc2l6ZVRpbWVyO1xyXG5cdHZhciBvcmlnaW5hbFdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcblx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbihlKSB7XHJcblx0ICBcdGNsZWFyVGltZW91dChyZXNpemVUaW1lcik7XHJcblx0ICBcdHJlc2l6ZVRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHQgIFx0XHR2YXIgbmV3V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuXHQgIFx0XHR2YXIgbWlub3JSZXNpemUgPSB0cnVlOyAvLyByZXNpemUgXHJcblx0ICBcdFx0JGRyb3Bkb3duLmFuaW1hdGUoe1xyXG5cdCAgXHRcdFx0XHRoZWlnaHQ6ICQoJy5uYXZpZ2F0aW9uX19wcm9kdWN0LWNhdGVnb3JpZXMuc2hvdycpLmhlaWdodCgpXHJcblx0ICBcdFx0XHR9LCAyMDAsICdlYXNlT3V0U2luZScpO1xyXG5cdFx0XHRpZiAob3JpZ2luYWxXaWR0aCA+PSA3NjggJiYgbmV3V2lkdGggPD0gNzY3ICkgeyAvLyB3YXMgYmlnLCBub3cgc21hbGwgXHJcblx0XHRcdFx0aGlkZURyb3Bkb3duKGNoZWNrSGVpZ2h0KG9yaWdpbmFsV2lkdGgpLCBmYWxzZSk7XHJcblx0XHRcdFx0JGRyb3Bkb3duLmNzcygnaGVpZ2h0JywwKTtcclxuXHRcdFx0XHRtaW5vclJlc2l6ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdHJlbW92ZU1vcmVMaW5rcyhmYWxzZSk7XHJcblx0XHRcdH0gZWxzZSBpZiAob3JpZ2luYWxXaWR0aCA8PSA3NjcgJiYgbmV3V2lkdGggPj0gNzY4ICkgeyAvLyB3YXMgc21hbGwsIG5vdyBiaWdcclxuXHRcdFx0XHQkKCcuaGVhZGVyX19tb2JpbGUtY29sbGFwc2UnKS5yZW1vdmVDbGFzcygnc2hvdy1pbmxpbmUtYmxvY2snKTtcclxuXHRcdFx0XHRyZW1vdmVNb3JlTGlua3MoZmFsc2UpO1xyXG5cdFx0XHRcdGhpZGVEcm9wZG93bihjaGVja0hlaWdodChvcmlnaW5hbFdpZHRoKSwgZmFsc2UpO1xyXG5cdFx0XHRcdG1pbm9yUmVzaXplID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gYWZ0ZXIgYnVzaW5lc3MgbWFrZSBuZXcgd2lkdGggb3JpZ2luYWxcclxuXHRcdFx0b3JpZ2luYWxXaWR0aCA9IG5ld1dpZHRoO1xyXG5cdCAgfSwgMTAwKTtcclxuXHR9KTtcclxufSkoKTtcclxuXHJcbi8vIFBhcmFsbGF4XHJcblxyXG4oZnVuY3Rpb24gcGFyYWxsYXhGdW5jdGlvbiAoKSB7XHJcblxyXG5cdCQod2luZG93KS5iaW5kKCdzY3JvbGwnLGZ1bmN0aW9uKGUpe1xyXG5cdFx0dmFyIHNjcm9sbGVkWSA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHRcdHBhcmFsbGF4U2Nyb2xsKHNjcm9sbGVkWSk7XHJcblx0fSk7XHJcblxyXG5cdGZ1bmN0aW9uIHBhcmFsbGF4U2Nyb2xsIChzY3JvbGxlZFkpIHsgXHJcblx0XHRpZiAoc2Nyb2xsZWRZIDwgJCgnLmhlcm8taW1hZ2UnKS5oZWlnaHQoKSAmJiAkKHdpbmRvdykud2lkdGgoKSkge1xyXG5cdFx0XHQkKCcuaGVyby1pbWFnZScpLmNzcygndG9wJywoKHNjcm9sbGVkWSoxKSkrJ3B4Jyk7XHJcblx0XHRcdCQoJy5jYXRlZ29yeV9fcGFnZS1oZWFkaW5nJykuY3NzKCd0b3AnLChzY3JvbGxlZFkqMC4zKSsncHgnKTtcclxuXHRcdFx0JCgnLmJyaXQtbG9nbycpLmNzcygndG9wJywnLScrKChzY3JvbGxlZFkqMC42KSkrJ3B4Jyk7XHJcblx0XHRcdCQoJy5nZXQtY2xvc2VyJykuY3NzKCd0b3AnLCgoc2Nyb2xsZWRZKjAuMikpKydweCcpO1xyXG5cdFx0XHQvLyB0b2RvOiBtYXliZSBhbmltYXRlIHRoZSBkaWFnb25hbCBsaW5lXHJcblxyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn0pKCk7XHJcblxyXG5cclxuLy8gd2hlbiBuYXYgYmFyIGdvZXMgcGFzdCAoZWcpIDYwMHB4IHNsaWRlcyB1cFxyXG4vLyBpZmYgc2Nyb2xsIGhlaWdodCBpcyBsZXNzIHRoYW4gcHJldmlvdXMgc2Nyb2xsIGl0IGRvd25cclxuXHJcbi8qIENyZWRpdCBNZWRpdW06IGh0dHBzOi8vbWVkaXVtLmNvbS9AbWFyaXVzYzIzL2hpZGUtaGVhZGVyLW9uLXNjcm9sbC1kb3duLXNob3ctb24tc2Nyb2xsLXVwLTY3YmJhYWU5YTc4YyMuZTkzcnAxODUxICovXHJcblxyXG4vLyBIaWRlIEhlYWRlciBvbiBvbiBzY3JvbGwgZG93blxyXG4oZnVuY3Rpb24gY2hlY2tVc2Vyc1Njcm9sbCgpIHsgXHJcblx0dmFyIGRpZFNjcm9sbDtcclxuXHR2YXIgbGFzdFNjcm9sbFRvcCA9IDA7XHJcblx0dmFyIGRlbHRhID0gNTtcclxuXHR2YXIgJGhlYWRlciA9ICQoJy5oZWFkZXInKTtcclxuXHR2YXIgbmF2YmFySGVpZ2h0ID0gJGhlYWRlci5vdXRlckhlaWdodCgpO1xyXG5cdFxyXG5cclxuXHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKGV2ZW50KXtcclxuXHQgICAgZGlkU2Nyb2xsID0gdHJ1ZTtcclxuXHR9KTtcclxuXHJcblx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHQgICAgaWYgKGRpZFNjcm9sbCAmJiBjaGVja0hlaWdodCh3aW5kb3dXaWR0aCkpIHtcclxuXHQgICAgICAgIGhhc1Njcm9sbGVkKCk7XHJcblx0ICAgICAgICBkaWRTY3JvbGwgPSBmYWxzZTtcclxuXHQgICAgfVxyXG5cdH0sIDI1MCk7XHJcblxyXG5cdGZ1bmN0aW9uIGhhc1Njcm9sbGVkKCkge1xyXG5cdCAgICB2YXIgc3QgPSAkKHRoaXMpLnNjcm9sbFRvcCgpO1xyXG5cdCAgICBcclxuXHQgICAgLy8gTWFrZSBzdXJlIHRoZXkgc2Nyb2xsIG1vcmUgdGhhbiBkZWx0YVxyXG5cdCAgICBpZiAoTWF0aC5hYnMobGFzdFNjcm9sbFRvcCAtIHN0KSA8PSBkZWx0YSlcclxuXHQgICAgICAgIHJldHVybjtcclxuXHQgICAgXHJcblx0ICAgIC8vIElmIHRoZXkgc2Nyb2xsZWQgZG93biBhbmQgYXJlIHBhc3QgdGhlIG5hdmJhciwgYWRkIGNsYXNzIC5uYXYtdXAuXHJcblx0ICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHNvIHlvdSBuZXZlciBzZWUgd2hhdCBpcyBcImJlaGluZFwiIHRoZSBuYXZiYXIuXHJcblx0ICAgIGlmIChzdCA+IGxhc3RTY3JvbGxUb3AgJiYgc3QgPiBuYXZiYXJIZWlnaHQpe1xyXG5cdCAgICAgICAgLy8gU2Nyb2xsIERvd25cclxuXHQgICAgICAgICRoZWFkZXIucmVtb3ZlQ2xhc3MoJ25hdi1kb3duJykuYWRkQ2xhc3MoJ25hdi11cCcpO1xyXG5cdCAgICAgICAgJCgnLmhlYWRlcl9fbW9iaWxlLWNvbGxhcHNlJykuYWRkQ2xhc3MoJ21vYmlsZS1tZW51Jyk7XHJcblx0ICAgICAgICBpZiAoJCgnLnNlbGVjdGVkJykubGVuZ3RoID4gMCkge1xyXG5cdCAgICAgICAgXHQkKCcuc2VsZWN0ZWQnKS50cmlnZ2VyKCdjbGljaycpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgJCgnLmhlYWRlcl9fbW9iaWxlLWNvbGxhcHNlJykucmVtb3ZlQ2xhc3MoJ3Nob3ctaW5saW5lLWJsb2NrJyk7XHJcblx0ICAgIH0gZWxzZSB7XHJcblx0ICAgICAgICAvLyBTY3JvbGwgVXBcclxuXHQgICAgICAgIGlmKHN0ICsgJCh3aW5kb3cpLmhlaWdodCgpIDwgJChkb2N1bWVudCkuaGVpZ2h0KCkpIHtcclxuXHQgICAgICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCduYXYtdXAnKS5hZGRDbGFzcygnbmF2LWRvd24nKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgfVxyXG5cdCAgICBsYXN0U2Nyb2xsVG9wID0gc3Q7XHJcblx0fVxyXG59KSgpO1xyXG5cclxuLy8gSW1hZ2UgcHJvY2Vzc2luZ1xyXG4vLyBTd2FwIDFrYiBibHVycnkgaW1hZ2VzIGZvciBuaWNlIG9uZXMgb24gcGFnZSBsb2FkXHJcblxyXG4vLyBmaW5kIGVhY2ggaW1hZ2Ugd2hpY2ggcHJlLWxvYWRlZCBjbGFzc1xyXG4vLyByZW1vdmUgY2xhc3MgYW5kIGFkZCBuZXcgcG9zdC1sb2FkZWQgY2xhc3NcclxuLy8gYW1lbmQgdXJsIHRvIHJlZGlyZWN0IHRvIGJpZyBpbWFnZVxyXG4vKiBJbnNwaXJlZCBieSBodHRwczovL2Nzcy10cmlja3MuY29tL3RoZS1ibHVyLXVwLXRlY2huaXF1ZS1mb3ItbG9hZGluZy1iYWNrZ3JvdW5kLWltYWdlcy8gKi9cclxuXHJcbihmdW5jdGlvbiBzd2FwSW1hZ2VRdWFsaXR5KCkge1xyXG5cdHZhciBwcmVMb2FkZWRJbWFnZSA9ICQoJy5wcmUtbG9hZGVkJyk7XHJcblx0dmFyIHBvc3RMb2FkZWRDbGFzcyA9ICdwb3N0LWxvYWRlZCc7XHJcblx0dmFyIGxhcmdlRGlyZWN0b3J5ID0gJy9sYXJnZS8nO1xyXG5cdCQuZWFjaChwcmVMb2FkZWRJbWFnZSwgZnVuY3Rpb24oaW5kZXgsIHZhbCkge1xyXG5cdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHRcdHZhciB1cmwgPSAkdGhpcy5hdHRyKCdzcmMnKTsgLy8gZWcgL3NvdXJjZS9pbWcvc21hbGwvbGFyZ2UtLWhlcm8tZ2lybC5qcGdcclxuXHRcdHZhciBjaGFuZ2VGb2xkZXIgPSB1cmwucmVwbGFjZSgnL3NtYWxsLycsIGxhcmdlRGlyZWN0b3J5KTtcclxuXHRcdHZhciBjaGFuZ2VGaWxlVHlwZSA9IGNoYW5nZUZvbGRlci5yZXBsYWNlKCcucG5nJywgJy5qcGcnKTtcclxuXHRcdCR0aGlzLmF0dHIoJ3NyYycsIGNoYW5nZUZpbGVUeXBlKTtcclxuXHRcdCR0aGlzLnJlbW92ZUNsYXNzKCdwcmUtbG9hZGVkJykuYWRkQ2xhc3MocG9zdExvYWRlZENsYXNzKTtcclxuXHJcblx0fSk7XHJcbn0pKCk7XHJcblxyXG5cclxuLy8gU3dhcCBTVkcgaW1hZ2UgdGFncyBvZiBpbmxpbmUgU1ZHUyBzbyB5b3UgY2FuIG1hbmlwdWxhdGUgY29sb3VyIHdpdGggY3NzLCBlbW92ZXMgc3R5bGUgaGVhZFxyXG4vKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzExOTc4OTk1L2hvdy10by1jaGFuZ2UtY29sb3Itb2Ytc3ZnLWltYWdlLXVzaW5nLWNzcy1qcXVlcnktc3ZnLWltYWdlLXJlcGxhY2VtZW50ICovXHJcbiQoJ2ltZy5zdmcnKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgJGltZyA9ICQodGhpcyk7XHJcbiAgICB2YXIgaW1nSUQgPSAkaW1nLmF0dHIoJ2lkJyk7XHJcbiAgICB2YXIgaW1nQ2xhc3MgPSAkaW1nLmF0dHIoJ2NsYXNzJyk7XHJcbiAgICB2YXIgaW1nVVJMID0gJGltZy5hdHRyKCdzcmMnKTtcclxuICAgICQuZ2V0KGltZ1VSTCwgZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIC8vIEdldCB0aGUgU1ZHIHRhZywgaWdub3JlIHRoZSByZXN0XHJcbiAgICAgICAgdmFyICRzdmcgPSAkKGRhdGEpLmZpbmQoJ3N2ZycpO1xyXG4gICAgICAgIC8vIEFkZCByZXBsYWNlZCBpbWFnZSdzIElEIHRvIHRoZSBuZXcgU1ZHXHJcbiAgICAgICAgaWYodHlwZW9mIGltZ0lEICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAkc3ZnID0gJHN2Zy5hdHRyKCdpZCcsIGltZ0lEKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQWRkIHJlcGxhY2VkIGltYWdlJ3MgY2xhc3NlcyB0byB0aGUgbmV3IFNWR1xyXG4gICAgICAgIGlmKHR5cGVvZiBpbWdDbGFzcyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgJHN2ZyA9ICRzdmcuYXR0cignY2xhc3MnLCBpbWdDbGFzcysnIHJlcGxhY2VkLXN2ZycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBSZW1vdmUgYW55IGludmFsaWQgWE1MIHRhZ3MgYXMgcGVyIGh0dHA6Ly92YWxpZGF0b3IudzMub3JnXHJcbiAgICAgICAgJHN2ZyA9ICRzdmcucmVtb3ZlQXR0cigneG1sbnM6YSAnKTtcclxuICAgICAgICAkc3ZnLmZpbmQoJ3N0eWxlJykucmVtb3ZlKCk7XHJcbiAgICAgICAgLy8gUmVwbGFjZSBpbWFnZSB3aXRoIG5ldyBTVkdcclxuICAgICAgICAkaW1nLnJlcGxhY2VXaXRoKCRzdmcpO1xyXG4gICAgfSwgJ3htbCcpO1xyXG59KTtcclxuXHJcbi8vIFNsaWRlc2hvdyAvIENhcm91c2VsIChzbGljay5qcylcclxuXHJcbi8vIHRoZXJlIGlzIGEgcmVzcG9uc2l2ZSBvcHRpb24gdGhpbmd5XHJcblxyXG5pZiAoJCgnLmNhcm91c2VsJykubGVuZ3RoID4gMCkge1xyXG5cdCQoJy5jYXJvdXNlbCcpLnNsaWNrKHtcclxuXHRcdGNlbnRlck1vZGU6IHRydWUsXHJcblx0XHRjZW50ZXJQYWRkaW5nOiAnMTUlJyxcclxuXHRcdHNsaWRlc1RvU2hvdzogMSxcclxuXHRcdGRvdHM6IGZhbHNlLCBcclxuXHRcdC8vIHRvZG86IGVhc2luZ1xyXG5cdFx0cHJldkFycm93OiAnPGRpdiBjbGFzcz1cInByZXZpb3VzLXNsaWRlIHNsaWRlLWFycm93XCI+PGRpdiBjbGFzcz1cImljb24tY29udGFpbmVyXCI+PGRpdiBjbGFzcz1cImljb25cIj48aW1nIHNyYz1cIi9zb3VyY2UvaW1nL2Nhcm91c2VsLWFycm93LnN2Z1wiIGNsYXNzPVwicmVzcG9uc2l2ZS1pbWFnZVwiPjwvZGl2PjwvZGl2PjwvZGl2PicsXHJcblx0XHRuZXh0QXJyb3c6ICc8ZGl2IGNsYXNzPVwic2xpZGUtYXJyb3cgbmV4dC1zbGlkZVwiPjxkaXYgY2xhc3M9XCJpY29uLWNvbnRhaW5lclwiPjxkaXYgY2xhc3M9XCJpY29uXCI+PGltZyBzcmM9XCIvc291cmNlL2ltZy9jYXJvdXNlbC1hcnJvdy5zdmdcIiBjbGFzcz1cInJlc3BvbnNpdmUtaW1hZ2UgZmxpcFwiPjwvZGl2PjwvZGl2PjwvZGl2PicsXHJcblx0XHRyZXNwb25zaXZlOiBbXHJcblx0XHRcdHtcdFxyXG5cdFx0XHRcdGJyZWFrcG9pbnQ6IDk5MyxcclxuXHRcdFx0XHRzZXR0aW5nczoge1xyXG5cdFx0XHRcdFx0Y2VudGVyTW9kZTogZmFsc2UsXHJcblx0XHRcdFx0XHRkb3RzOiB0cnVlLFxyXG5cdFx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcclxuXHRcdFx0XHRcdGluZmluaXRlOiBmYWxzZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdH0pO1xyXG5cdC8vIHdpdGhvdXQgdGhlc2UgYmVmb3JlL2FmdGVycyB0aGUgYXJyb3dzIHdpbGwgXHJcblx0Ly8gZmxvYXQgYWJvdmUgdGhlIGltYWdlcyB3aGVuIHRoZSBjYXJvdXNlbCBpcyBzbGlkaW5nXHJcblx0JCgnLmNhcm91c2VsJykub24oJ2JlZm9yZUNoYW5nZScsIGZ1bmN0aW9uIChldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKSB7XHJcblx0XHQkKCcuc2xpY2stbGlzdCcpLmFkZENsYXNzKCdoaWdoLXotaW5kZXgnKTtcclxuXHR9KTtcclxuXHQkKCcuY2Fyb3VzZWwnKS5vbignYWZ0ZXJDaGFuZ2UnLCBmdW5jdGlvbiAoZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUsIG5leHRTbGlkZSkge1xyXG5cdFx0JCgnLnNsaWNrLWxpc3QnKS5yZW1vdmVDbGFzcygnaGlnaC16LWluZGV4Jyk7XHJcblx0fSk7XHJcblx0Ly8gWW91IG5lZWRzIHRoaXMgYXMgYmVmb3JlQ2hhbmdlIGRvZXNuJ3QgZmlyZSB1bnRpbCBhZnRlciB0aGUgdXNlcnMgZmluZ2VyIGxlYXZlcyB0aGUgc2NyZWVuXHJcblx0Ly8gYW5kIGxvb2tzIGJhZFxyXG5cdCQoJy5pbWFnZS1zbGlkZScpLm9uKCdtb3VzZWRvd24gdG91Y2hzdGFydCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHQkKCcuc2xpY2stbGlzdCcpLmFkZENsYXNzKCdoaWdoLXotaW5kZXgnKTtcclxuXHR9KTtcclxufVxyXG5cclxuLy8gRnJvbnQgUGFnZVxyXG4vL1xyXG5pZiAoJCgnLnN0YW5kYXJkX19jYXJvdXNlbCcpLmxlbmd0aCA+IDApIHtcclxuXHQkKCcuc3RhbmRhcmRfX2Nhcm91c2VsJykuc2xpY2soe1xyXG5cdFx0cHJldkFycm93OiAnJyxcclxuXHRcdG5leHRBcnJvdzogJycsXHJcblx0XHRkb3RzOiB0cnVlLFxyXG5cdFx0ZHJhZ2dhYmxlOiBmYWxzZSxcclxuXHRcdHJlc3BvbnNpdmU6IFtcclxuXHRcdFx0e1x0XHJcblx0XHRcdFx0YnJlYWtwb2ludDogOTkzLFxyXG5cdFx0XHRcdHNldHRpbmdzOiB7XHJcblx0XHRcdFx0XHRkcmFnZ2FibGU6IHRydWUsXHJcblx0XHRcdFx0XHRkb3RzOiB0cnVlLFxyXG5cdFx0XHRcdFx0YXJyb3dzOiBmYWxzZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cclxuXHR9KTtcclxuXHJcblxyXG59XHJcblxyXG5pZiAoJCgnLmluc3RhZ3JhbV9fY2Fyb3VzZWwnKS5sZW5ndGggPiAwKSB7XHJcblx0JCgnLmluc3RhZ3JhbV9fY2Fyb3VzZWwnKS5zbGljayh7XHJcblx0XHRzbGlkZXNUb1Nob3c6IDUsXHJcblx0XHRwcmV2QXJyb3c6JzxkaXYgY2xhc3M9XCJwcmV2aW91cy1zbGlkZSBzbGlkZS1hcnJvd1wiPjxkaXYgY2xhc3M9XCJpY29uLWNvbnRhaW5lclwiPjxkaXYgY2xhc3M9XCJpY29uXCI+PGltZyBzcmM9XCIvc291cmNlL2ltZy9hcnJvdy5zdmdcIiBjbGFzcz1cInJlc3BvbnNpdmUtaW1hZ2VcIj48L2Rpdj48L2Rpdj48L2Rpdj4nLFxyXG5cdFx0bmV4dEFycm93Oic8ZGl2IGNsYXNzPVwic2xpZGUtYXJyb3cgbmV4dC1zbGlkZVwiPjxkaXYgY2xhc3M9XCJpY29uLWNvbnRhaW5lclwiPjxkaXYgY2xhc3M9XCJpY29uXCI+PGltZyBzcmM9XCIvc291cmNlL2ltZy9hcnJvdy5zdmdcIiBjbGFzcz1cInJlc3BvbnNpdmUtaW1hZ2UgZmxpcFwiPjwvZGl2PjwvZGl2PjwvZGl2PidcclxuXHR9KTtcclxufVxyXG5cclxuKGZ1bmN0aW9uIHNob3dIaWRlQ2F0ZWdvcnkoKSB7XHJcblx0dmFyICRwcm9kdWN0cyA9ICQoJy5jYXRlZ29yeV9fZ3JvdXBfX2NvbnRlbnQnKTtcclxuXHR2YXIgJHNob3dCdXR0b25zID0gJCgnLmNhdGVnb3J5X19zaG93LXByb2R1Y3RzJyk7XHJcblx0dmFyICRoaWRlQnV0dG9ucyA9ICQoJy5jYXRlZ29yeV9faGlkZS1wcm9kdWN0cycpO1xyXG5cdCRwcm9kdWN0cy5hZGRDbGFzcygnaGlkZGVuLXhzJyk7XHJcblx0JHNob3dCdXR0b25zLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0JCh0aGlzKS5uZXh0KCkucmVtb3ZlQ2xhc3MoJ2hpZGRlbi14cycpLm5leHQoKS5yZW1vdmVDbGFzcygnZGlzYXBwZWFyJyk7XHJcblx0XHQkKHRoaXMpLmFkZENsYXNzKCdkaXNhcHBlYXInKTtcclxuXHR9KTtcclxuXHJcblx0JGhpZGVCdXR0b25zLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0JCh0aGlzKS5wcmV2KCkuYWRkQ2xhc3MoJ2hpZGRlbi14cycpLnByZXYoKS5yZW1vdmVDbGFzcygnZGlzYXBwZWFyJyk7XHJcblx0XHQkKHRoaXMpLmFkZENsYXNzKCdkaXNhcHBlYXInKTtcclxuXHR9KTtcclxuXHJcbn0pKCk7XHJcblxyXG4oZnVuY3Rpb24gZmlsdGVyTG91bmdlKCkge1xyXG5cdC8vIHRvZG86IHJlbW92ZSB3aGVuZ29pbmcgdG8gZnVsbCBzaXRlXHJcblx0Ly8gY2FuJ3QgYWN0dWFsbHkgdXNlIHRoaXMgaW4gZnVsbCB0aGluZ1xyXG5cdHZhciBhcnRpY2xlcyA9ICQoJy5sb3VuZ2VfX2FydGljbGUnKTtcclxuXHQkKCcubG91bmdlX19maWx0ZXJfX2l0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblx0XHR2YXIgc2VsZWN0ZWQgPSAkdGhpcy5hdHRyKCdsb3VuZ2UtZmlsdGVyJyk7XHJcblx0XHQkLmVhY2goYXJ0aWNsZXMsIGZ1bmN0aW9uKGluZGV4LCB2YWwpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHRcdFx0dmFyIGNvbXBhcmlzb25WYWwgPSAkdGhpcy5jaGlsZHJlbignLmhpZGUnKS5hdHRyKCdsb3VuZ2UtZmlsdGVyJyk7XHJcblx0XHRcdGMoJ3NlbDonICsgc2VsZWN0ZWQgKyAnLCBjb206JyArIGNvbXBhcmlzb25WYWwpO1xyXG5cdFx0XHRpZiAoc2VsZWN0ZWQgPT09IGNvbXBhcmlzb25WYWwpIHtcclxuXHRcdFx0XHQkdGhpcy5hZGRDbGFzcygnc2hvdy1pbmxpbmUtYmxvY2snKS5hcHBlbmRUbygkKCcuaGlkZS1vdmVyZmxvdycpLmVxKDApKTtcclxuXHRcdFx0XHQkdGhpcy5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCR0aGlzLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdFx0JHRoaXMucmVtb3ZlQ2xhc3MoJ3Nob3ctaW5saW5lLWJsb2NrJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdCQoJy5sb3VuZ2VfX2NsZWFyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHQkLmVhY2goYXJ0aWNsZXMsIGZ1bmN0aW9uKGluZGV4LCB2YWwpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHRcdFx0JHRoaXMuYWRkQ2xhc3MoJ3Nob3ctaW5saW5lLWJsb2NrJyk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxufSkoKTtcclxuXHJcbi8vIHRoaXMgaXNuJ3QgdmVyeSBuZWNlc3NhcnlcclxuXHJcbihmdW5jdGlvbiBtYWtlV2F2ZXN1cmZlcigpIHtcclxuXHRpZiAoJCgnI3dhdmVmb3JtJykubGVuZ3RoID4gMCkge1xyXG5cdFx0dmFyIHdhdmVzdXJmZXIgPSBPYmplY3QuY3JlYXRlKFdhdmVTdXJmZXIpO1xyXG5cclxuXHRcdHdhdmVzdXJmZXIuaW5pdCh7XHJcblx0XHRcdGNvbnRhaW5lcjogJyN3YXZlZm9ybScsXHJcblx0XHRcdHdhdmVDb2xvcjogJ3Zpb2xldCcsXHJcblx0XHRcdHByb2dyZXNzQ29sb3I6ICdwdXJwbGUnLFxyXG5cdFx0XHRiYXJXaWR0aDogMyxcclxuXHRcdFx0aGlkZVNjcm9sbGJhcjogdHJ1ZVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmFyIGFjdHVhbFRpbWUgPSAwO1xyXG5cclxuXHRcdCQoJy5wbGF5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoIXdhdmVzdXJmZXIuaXNQbGF5aW5nKCkpIHtcclxuXHRcdFx0XHR3YXZlc3VyZmVyLnBsYXkoKTtcclxuXHRcdFx0XHRhY3R1YWxUaW1lID0gdGltZVNwYWNlKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0d2F2ZXN1cmZlci5wYXVzZSgpO1xyXG5cdFx0XHRcdGFjdHVhbFRpbWUgPSB0aW1lU3BhY2UoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmFyIHRpbWVTcGFjZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbigpeyBcclxuXHRcdFx0XHR0aGlzLnRpbWUgPSBwYXJzZUludCh3YXZlc3VyZmVyLmdldEN1cnJlbnRUaW1lKCkpO1xyXG5cdFx0XHRcdCQoJyN0aW1lJykudGV4dChkaXNwbGF5VGltZSh0aGlzLnRpbWUpKTtcdFx0XHRcclxuXHRcdFx0fSwgMTAwMCk7XHJcblx0XHRcdHJldHVybiB0aGlzLnRpbWU7XHJcblx0XHR9O1xyXG5cclxuXHRcdHdhdmVzdXJmZXIubG9hZCgnLi4vc291cmNlL2F1ZGlvL3Rlc3Qub2dnJyk7XHJcblx0fVxyXG5cdFxyXG5cclxuXHRmdW5jdGlvbiBkaXNwbGF5VGltZSh0aW1lKSB7XHJcblx0XHR2YXIgaW1wb3J0ZWRUaW1lID0gdGltZTtcclxuXHRcdHZhciBzZWNvbmRzID0gMDtcclxuXHRcdHZhciBtaW51dGVzID0gMDtcclxuXHRcdHZhciB0aW1lRm9ybWF0dGVkID0gJyc7XHJcblxyXG5cdFx0c2Vjb25kcyA9IGltcG9ydGVkVGltZSAlIDYwO1xyXG5cdFx0bWludXRlcyA9IE1hdGguZmxvb3IoaW1wb3J0ZWRUaW1lIC8gNjApO1xyXG5cclxuXHRcdGlmIChzZWNvbmRzIDw9IDkpIHtcclxuXHRcdFx0c2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG1pbnV0ZXMgPD0gOSkge1xyXG5cdFx0XHRtaW51dGVzID0gJzAnICsgbWludXRlcztcclxuXHRcdH1cclxuXHJcblx0XHR0aW1lRm9ybWF0dGVkID0gbWludXRlcyArICc6JyArIHNlY29uZHM7XHJcblx0XHRyZXR1cm4gdGltZUZvcm1hdHRlZDtcclxuXHR9XHJcblxyXG59KSgpO1xyXG5cclxuLy8gTW9zdCBvZiB0aGlzIGNhbiBiZSBkZWxldGVkIGV4Y2VwdCB0aGUgLnNsaWNrKCdyZWluaXQnKSBmdW5jdGlvblxyXG4vLyB3aGljaCBtYXkgb3IgbWF5IG5vIGhlbHAgXHJcbihmdW5jdGlvbigpIHtcclxuXHQkKCcuZnJpZW5kc19fZmVhdHVyZScpLmhpZGUoKTtcclxuXHQkKCcuZnJpZW5kc19fcHJvZmlsZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0JCgnLmZyaWVuZHNfX2ZlYXR1cmUnKS5zbGlkZURvd24oODAwLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCgnLmNhcm91c2VsJykuc2xpY2soJ3JlaW5pdCcpO1xyXG5cdFx0fSk7XHJcblx0XHR2YXIgaGVpZ2h0ID0gJCgnLmhlcm8nKS5oZWlnaHQoKTtcclxuXHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuXHRcdCAgICBzY3JvbGxUb3A6IGhlaWdodCAtIDcwXHJcblx0XHR9LCAxMDAwKTtcclxuXHR9KTtcclxuXHQkKCcuZnJpZW5kc19fY2xvc2UgLmJ0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0JCgnLmZyaWVuZHNfX2ZlYXR1cmUnKS5zbGlkZVVwKDgwMCk7XHJcblx0fSk7XHJcbn0pKCk7XHJcblxyXG4vLyBjb25zb2xlLnRpbWVFbmQoJ2xhYmVsJyk7XHJcbi8vIGluZGV4IGluaXRhbCBwYWdlIGxvYWQ6IDA1LzAxLzIwMTUgPSAzNS41MjhtcztcclxuXHJcbn0pOyAvLyBFTkQgSlFVRVJZXHJcblxyXG4iLCIvKlxuICogalF1ZXJ5IEVhc2luZyB2MS4zIC0gaHR0cDovL2dzZ2QuY28udWsvc2FuZGJveC9qcXVlcnkvZWFzaW5nL1xuICpcbiAqIFVzZXMgdGhlIGJ1aWx0IGluIGVhc2luZyBjYXBhYmlsaXRpZXMgYWRkZWQgSW4galF1ZXJ5IDEuMVxuICogdG8gb2ZmZXIgbXVsdGlwbGUgZWFzaW5nIG9wdGlvbnNcbiAqXG4gKiBURVJNUyBPRiBVU0UgLSBqUXVlcnkgRWFzaW5nXG4gKiBcbiAqIE9wZW4gc291cmNlIHVuZGVyIHRoZSBCU0QgTGljZW5zZS4gXG4gKiBcbiAqIENvcHlyaWdodCDCqSAyMDA4IEdlb3JnZSBNY0dpbmxleSBTbWl0aFxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbiwgXG4gKiBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gKiBcbiAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIFxuICogY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3QgXG4gKiBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBcbiAqIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbiAqIFxuICogTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgYXV0aG9yIG5vciB0aGUgbmFtZXMgb2YgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2UgXG4gKiBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuICogXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkQgQU5ZIFxuICogRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GXG4gKiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqICBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsXG4gKiAgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFXG4gKiAgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIFxuICogQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcbiAqICBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBcbiAqIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS4gXG4gKlxuKi9cblxuLy8gdDogY3VycmVudCB0aW1lLCBiOiBiZWdJbm5JbmcgdmFsdWUsIGM6IGNoYW5nZSBJbiB2YWx1ZSwgZDogZHVyYXRpb25cbmpRdWVyeS5lYXNpbmdbJ2pzd2luZyddID0galF1ZXJ5LmVhc2luZ1snc3dpbmcnXTtcblxualF1ZXJ5LmV4dGVuZCggalF1ZXJ5LmVhc2luZyxcbntcblx0ZGVmOiAnZWFzZU91dFF1YWQnLFxuXHRzd2luZzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHQvL2FsZXJ0KGpRdWVyeS5lYXNpbmcuZGVmYXVsdCk7XG5cdFx0cmV0dXJuIGpRdWVyeS5lYXNpbmdbalF1ZXJ5LmVhc2luZy5kZWZdKHgsIHQsIGIsIGMsIGQpO1xuXHR9LFxuXHRlYXNlSW5RdWFkOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xuXHRcdHJldHVybiBjKih0Lz1kKSp0ICsgYjtcblx0fSxcblx0ZWFzZU91dFF1YWQ6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuIC1jICoodC89ZCkqKHQtMikgKyBiO1xuXHR9LFxuXHRlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xuXHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0ICsgYjtcblx0XHRyZXR1cm4gLWMvMiAqICgoLS10KSoodC0yKSAtIDEpICsgYjtcblx0fSxcblx0ZWFzZUluQ3ViaWM6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuIGMqKHQvPWQpKnQqdCArIGI7XG5cdH0sXG5cdGVhc2VPdXRDdWJpYzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gYyooKHQ9dC9kLTEpKnQqdCArIDEpICsgYjtcblx0fSxcblx0ZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0aWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMip0KnQqdCArIGI7XG5cdFx0cmV0dXJuIGMvMiooKHQtPTIpKnQqdCArIDIpICsgYjtcblx0fSxcblx0ZWFzZUluUXVhcnQ6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuIGMqKHQvPWQpKnQqdCp0ICsgYjtcblx0fSxcblx0ZWFzZU91dFF1YXJ0OiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xuXHRcdHJldHVybiAtYyAqICgodD10L2QtMSkqdCp0KnQgLSAxKSArIGI7XG5cdH0sXG5cdGVhc2VJbk91dFF1YXJ0OiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xuXHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQqdCArIGI7XG5cdFx0cmV0dXJuIC1jLzIgKiAoKHQtPTIpKnQqdCp0IC0gMikgKyBiO1xuXHR9LFxuXHRlYXNlSW5RdWludDogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gYyoodC89ZCkqdCp0KnQqdCArIGI7XG5cdH0sXG5cdGVhc2VPdXRRdWludDogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gYyooKHQ9dC9kLTEpKnQqdCp0KnQgKyAxKSArIGI7XG5cdH0sXG5cdGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xuXHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQqdCp0ICsgYjtcblx0XHRyZXR1cm4gYy8yKigodC09MikqdCp0KnQqdCArIDIpICsgYjtcblx0fSxcblx0ZWFzZUluU2luZTogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gLWMgKiBNYXRoLmNvcyh0L2QgKiAoTWF0aC5QSS8yKSkgKyBjICsgYjtcblx0fSxcblx0ZWFzZU91dFNpbmU6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuIGMgKiBNYXRoLnNpbih0L2QgKiAoTWF0aC5QSS8yKSkgKyBiO1xuXHR9LFxuXHRlYXNlSW5PdXRTaW5lOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xuXHRcdHJldHVybiAtYy8yICogKE1hdGguY29zKE1hdGguUEkqdC9kKSAtIDEpICsgYjtcblx0fSxcblx0ZWFzZUluRXhwbzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gKHQ9PTApID8gYiA6IGMgKiBNYXRoLnBvdygyLCAxMCAqICh0L2QgLSAxKSkgKyBiO1xuXHR9LFxuXHRlYXNlT3V0RXhwbzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gKHQ9PWQpID8gYitjIDogYyAqICgtTWF0aC5wb3coMiwgLTEwICogdC9kKSArIDEpICsgYjtcblx0fSxcblx0ZWFzZUluT3V0RXhwbzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRpZiAodD09MCkgcmV0dXJuIGI7XG5cdFx0aWYgKHQ9PWQpIHJldHVybiBiK2M7XG5cdFx0aWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMiAqIE1hdGgucG93KDIsIDEwICogKHQgLSAxKSkgKyBiO1xuXHRcdHJldHVybiBjLzIgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tdCkgKyAyKSArIGI7XG5cdH0sXG5cdGVhc2VJbkNpcmM6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuIC1jICogKE1hdGguc3FydCgxIC0gKHQvPWQpKnQpIC0gMSkgKyBiO1xuXHR9LFxuXHRlYXNlT3V0Q2lyYzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gYyAqIE1hdGguc3FydCgxIC0gKHQ9dC9kLTEpKnQpICsgYjtcblx0fSxcblx0ZWFzZUluT3V0Q2lyYzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRpZiAoKHQvPWQvMikgPCAxKSByZXR1cm4gLWMvMiAqIChNYXRoLnNxcnQoMSAtIHQqdCkgLSAxKSArIGI7XG5cdFx0cmV0dXJuIGMvMiAqIChNYXRoLnNxcnQoMSAtICh0LT0yKSp0KSArIDEpICsgYjtcblx0fSxcblx0ZWFzZUluRWxhc3RpYzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHR2YXIgcz0xLjcwMTU4O3ZhciBwPTA7dmFyIGE9Yztcblx0XHRpZiAodD09MCkgcmV0dXJuIGI7ICBpZiAoKHQvPWQpPT0xKSByZXR1cm4gYitjOyAgaWYgKCFwKSBwPWQqLjM7XG5cdFx0aWYgKGEgPCBNYXRoLmFicyhjKSkgeyBhPWM7IHZhciBzPXAvNDsgfVxuXHRcdGVsc2UgdmFyIHMgPSBwLygyKk1hdGguUEkpICogTWF0aC5hc2luIChjL2EpO1xuXHRcdHJldHVybiAtKGEqTWF0aC5wb3coMiwxMCoodC09MSkpICogTWF0aC5zaW4oICh0KmQtcykqKDIqTWF0aC5QSSkvcCApKSArIGI7XG5cdH0sXG5cdGVhc2VPdXRFbGFzdGljOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xuXHRcdHZhciBzPTEuNzAxNTg7dmFyIHA9MDt2YXIgYT1jO1xuXHRcdGlmICh0PT0wKSByZXR1cm4gYjsgIGlmICgodC89ZCk9PTEpIHJldHVybiBiK2M7ICBpZiAoIXApIHA9ZCouMztcblx0XHRpZiAoYSA8IE1hdGguYWJzKGMpKSB7IGE9YzsgdmFyIHM9cC80OyB9XG5cdFx0ZWxzZSB2YXIgcyA9IHAvKDIqTWF0aC5QSSkgKiBNYXRoLmFzaW4gKGMvYSk7XG5cdFx0cmV0dXJuIGEqTWF0aC5wb3coMiwtMTAqdCkgKiBNYXRoLnNpbiggKHQqZC1zKSooMipNYXRoLlBJKS9wICkgKyBjICsgYjtcblx0fSxcblx0ZWFzZUluT3V0RWxhc3RpYzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHR2YXIgcz0xLjcwMTU4O3ZhciBwPTA7dmFyIGE9Yztcblx0XHRpZiAodD09MCkgcmV0dXJuIGI7ICBpZiAoKHQvPWQvMik9PTIpIHJldHVybiBiK2M7ICBpZiAoIXApIHA9ZCooLjMqMS41KTtcblx0XHRpZiAoYSA8IE1hdGguYWJzKGMpKSB7IGE9YzsgdmFyIHM9cC80OyB9XG5cdFx0ZWxzZSB2YXIgcyA9IHAvKDIqTWF0aC5QSSkgKiBNYXRoLmFzaW4gKGMvYSk7XG5cdFx0aWYgKHQgPCAxKSByZXR1cm4gLS41KihhKk1hdGgucG93KDIsMTAqKHQtPTEpKSAqIE1hdGguc2luKCAodCpkLXMpKigyKk1hdGguUEkpL3AgKSkgKyBiO1xuXHRcdHJldHVybiBhKk1hdGgucG93KDIsLTEwKih0LT0xKSkgKiBNYXRoLnNpbiggKHQqZC1zKSooMipNYXRoLlBJKS9wICkqLjUgKyBjICsgYjtcblx0fSxcblx0ZWFzZUluQmFjazogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQsIHMpIHtcblx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xuXHRcdHJldHVybiBjKih0Lz1kKSp0KigocysxKSp0IC0gcykgKyBiO1xuXHR9LFxuXHRlYXNlT3V0QmFjazogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQsIHMpIHtcblx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xuXHRcdHJldHVybiBjKigodD10L2QtMSkqdCooKHMrMSkqdCArIHMpICsgMSkgKyBiO1xuXHR9LFxuXHRlYXNlSW5PdXRCYWNrOiBmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCwgcykge1xuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7IFxuXHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqKHQqdCooKChzKj0oMS41MjUpKSsxKSp0IC0gcykpICsgYjtcblx0XHRyZXR1cm4gYy8yKigodC09MikqdCooKChzKj0oMS41MjUpKSsxKSp0ICsgcykgKyAyKSArIGI7XG5cdH0sXG5cdGVhc2VJbkJvdW5jZTogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gYyAtIGpRdWVyeS5lYXNpbmcuZWFzZU91dEJvdW5jZSAoeCwgZC10LCAwLCBjLCBkKSArIGI7XG5cdH0sXG5cdGVhc2VPdXRCb3VuY2U6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0aWYgKCh0Lz1kKSA8ICgxLzIuNzUpKSB7XG5cdFx0XHRyZXR1cm4gYyooNy41NjI1KnQqdCkgKyBiO1xuXHRcdH0gZWxzZSBpZiAodCA8ICgyLzIuNzUpKSB7XG5cdFx0XHRyZXR1cm4gYyooNy41NjI1Kih0LT0oMS41LzIuNzUpKSp0ICsgLjc1KSArIGI7XG5cdFx0fSBlbHNlIGlmICh0IDwgKDIuNS8yLjc1KSkge1xuXHRcdFx0cmV0dXJuIGMqKDcuNTYyNSoodC09KDIuMjUvMi43NSkpKnQgKyAuOTM3NSkgKyBiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gYyooNy41NjI1Kih0LT0oMi42MjUvMi43NSkpKnQgKyAuOTg0Mzc1KSArIGI7XG5cdFx0fVxuXHR9LFxuXHRlYXNlSW5PdXRCb3VuY2U6IGZ1bmN0aW9uICh4LCB0LCBiLCBjLCBkKSB7XG5cdFx0aWYgKHQgPCBkLzIpIHJldHVybiBqUXVlcnkuZWFzaW5nLmVhc2VJbkJvdW5jZSAoeCwgdCoyLCAwLCBjLCBkKSAqIC41ICsgYjtcblx0XHRyZXR1cm4galF1ZXJ5LmVhc2luZy5lYXNlT3V0Qm91bmNlICh4LCB0KjItZCwgMCwgYywgZCkgKiAuNSArIGMqLjUgKyBiO1xuXHR9XG59KTtcblxuLypcbiAqXG4gKiBURVJNUyBPRiBVU0UgLSBFQVNJTkcgRVFVQVRJT05TXG4gKiBcbiAqIE9wZW4gc291cmNlIHVuZGVyIHRoZSBCU0QgTGljZW5zZS4gXG4gKiBcbiAqIENvcHlyaWdodCDCqSAyMDAxIFJvYmVydCBQZW5uZXJcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sIFxuICogYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuICogXG4gKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBcbiAqIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IFxuICogb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgXG4gKiBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKiBcbiAqIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGF1dGhvciBub3IgdGhlIG5hbWVzIG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIFxuICogb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbiAqIFxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EIEFOWSBcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRlxuICogTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiAgQ09QWVJJR0hUIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLFxuICogIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURVxuICogIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBcbiAqIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXG4gKiAgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgXG4gKiBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuIFxuICpcbiAqLyIsIi8qXG4gICAgIF8gXyAgICAgIF8gICAgICAgX1xuIF9fX3wgKF8pIF9fX3wgfCBfXyAgKF8pX19fXG4vIF9ffCB8IHwvIF9ffCB8LyAvICB8IC8gX198XG5cXF9fIFxcIHwgfCAoX198ICAgPCBfIHwgXFxfXyBcXFxufF9fXy9ffF98XFxfX198X3xcXF8oXykvIHxfX18vXG4gICAgICAgICAgICAgICAgICAgfF9fL1xuXG4gVmVyc2lvbjogMS41LjlcbiAgQXV0aG9yOiBLZW4gV2hlZWxlclxuIFdlYnNpdGU6IGh0dHA6Ly9rZW53aGVlbGVyLmdpdGh1Yi5pb1xuICAgIERvY3M6IGh0dHA6Ly9rZW53aGVlbGVyLmdpdGh1Yi5pby9zbGlja1xuICAgIFJlcG86IGh0dHA6Ly9naXRodWIuY29tL2tlbndoZWVsZXIvc2xpY2tcbiAgSXNzdWVzOiBodHRwOi8vZ2l0aHViLmNvbS9rZW53aGVlbGVyL3NsaWNrL2lzc3Vlc1xuXG4gKi9cbiFmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImpxdWVyeVwiXSxhKTpcInVuZGVmaW5lZFwiIT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1hKHJlcXVpcmUoXCJqcXVlcnlcIikpOmEoalF1ZXJ5KX0oZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGI9d2luZG93LlNsaWNrfHx7fTtiPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYyhjLGQpe3ZhciBmLGU9dGhpcztlLmRlZmF1bHRzPXthY2Nlc3NpYmlsaXR5OiEwLGFkYXB0aXZlSGVpZ2h0OiExLGFwcGVuZEFycm93czphKGMpLGFwcGVuZERvdHM6YShjKSxhcnJvd3M6ITAsYXNOYXZGb3I6bnVsbCxwcmV2QXJyb3c6JzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtcm9sZT1cIm5vbmVcIiBjbGFzcz1cInNsaWNrLXByZXZcIiBhcmlhLWxhYmVsPVwiUHJldmlvdXNcIiB0YWJpbmRleD1cIjBcIiByb2xlPVwiYnV0dG9uXCI+UHJldmlvdXM8L2J1dHRvbj4nLG5leHRBcnJvdzonPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1yb2xlPVwibm9uZVwiIGNsYXNzPVwic2xpY2stbmV4dFwiIGFyaWEtbGFiZWw9XCJOZXh0XCIgdGFiaW5kZXg9XCIwXCIgcm9sZT1cImJ1dHRvblwiPk5leHQ8L2J1dHRvbj4nLGF1dG9wbGF5OiExLGF1dG9wbGF5U3BlZWQ6M2UzLGNlbnRlck1vZGU6ITEsY2VudGVyUGFkZGluZzpcIjUwcHhcIixjc3NFYXNlOlwiZWFzZVwiLGN1c3RvbVBhZ2luZzpmdW5jdGlvbihhLGIpe3JldHVybic8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXJvbGU9XCJub25lXCIgcm9sZT1cImJ1dHRvblwiIGFyaWEtcmVxdWlyZWQ9XCJmYWxzZVwiIHRhYmluZGV4PVwiMFwiPicrKGIrMSkrXCI8L2J1dHRvbj5cIn0sZG90czohMSxkb3RzQ2xhc3M6XCJzbGljay1kb3RzXCIsZHJhZ2dhYmxlOiEwLGVhc2luZzpcImxpbmVhclwiLGVkZ2VGcmljdGlvbjouMzUsZmFkZTohMSxmb2N1c09uU2VsZWN0OiExLGluZmluaXRlOiEwLGluaXRpYWxTbGlkZTowLGxhenlMb2FkOlwib25kZW1hbmRcIixtb2JpbGVGaXJzdDohMSxwYXVzZU9uSG92ZXI6ITAscGF1c2VPbkRvdHNIb3ZlcjohMSxyZXNwb25kVG86XCJ3aW5kb3dcIixyZXNwb25zaXZlOm51bGwscm93czoxLHJ0bDohMSxzbGlkZTpcIlwiLHNsaWRlc1BlclJvdzoxLHNsaWRlc1RvU2hvdzoxLHNsaWRlc1RvU2Nyb2xsOjEsc3BlZWQ6NTAwLHN3aXBlOiEwLHN3aXBlVG9TbGlkZTohMSx0b3VjaE1vdmU6ITAsdG91Y2hUaHJlc2hvbGQ6NSx1c2VDU1M6ITAsdXNlVHJhbnNmb3JtOiExLHZhcmlhYmxlV2lkdGg6ITEsdmVydGljYWw6ITEsdmVydGljYWxTd2lwaW5nOiExLHdhaXRGb3JBbmltYXRlOiEwLHpJbmRleDoxZTN9LGUuaW5pdGlhbHM9e2FuaW1hdGluZzohMSxkcmFnZ2luZzohMSxhdXRvUGxheVRpbWVyOm51bGwsY3VycmVudERpcmVjdGlvbjowLGN1cnJlbnRMZWZ0Om51bGwsY3VycmVudFNsaWRlOjAsZGlyZWN0aW9uOjEsJGRvdHM6bnVsbCxsaXN0V2lkdGg6bnVsbCxsaXN0SGVpZ2h0Om51bGwsbG9hZEluZGV4OjAsJG5leHRBcnJvdzpudWxsLCRwcmV2QXJyb3c6bnVsbCxzbGlkZUNvdW50Om51bGwsc2xpZGVXaWR0aDpudWxsLCRzbGlkZVRyYWNrOm51bGwsJHNsaWRlczpudWxsLHNsaWRpbmc6ITEsc2xpZGVPZmZzZXQ6MCxzd2lwZUxlZnQ6bnVsbCwkbGlzdDpudWxsLHRvdWNoT2JqZWN0Ont9LHRyYW5zZm9ybXNFbmFibGVkOiExLHVuc2xpY2tlZDohMX0sYS5leHRlbmQoZSxlLmluaXRpYWxzKSxlLmFjdGl2ZUJyZWFrcG9pbnQ9bnVsbCxlLmFuaW1UeXBlPW51bGwsZS5hbmltUHJvcD1udWxsLGUuYnJlYWtwb2ludHM9W10sZS5icmVha3BvaW50U2V0dGluZ3M9W10sZS5jc3NUcmFuc2l0aW9ucz0hMSxlLmhpZGRlbj1cImhpZGRlblwiLGUucGF1c2VkPSExLGUucG9zaXRpb25Qcm9wPW51bGwsZS5yZXNwb25kVG89bnVsbCxlLnJvd0NvdW50PTEsZS5zaG91bGRDbGljaz0hMCxlLiRzbGlkZXI9YShjKSxlLiRzbGlkZXNDYWNoZT1udWxsLGUudHJhbnNmb3JtVHlwZT1udWxsLGUudHJhbnNpdGlvblR5cGU9bnVsbCxlLnZpc2liaWxpdHlDaGFuZ2U9XCJ2aXNpYmlsaXR5Y2hhbmdlXCIsZS53aW5kb3dXaWR0aD0wLGUud2luZG93VGltZXI9bnVsbCxmPWEoYykuZGF0YShcInNsaWNrXCIpfHx7fSxlLm9wdGlvbnM9YS5leHRlbmQoe30sZS5kZWZhdWx0cyxmLGQpLGUuY3VycmVudFNsaWRlPWUub3B0aW9ucy5pbml0aWFsU2xpZGUsZS5vcmlnaW5hbFNldHRpbmdzPWUub3B0aW9ucyxcInVuZGVmaW5lZFwiIT10eXBlb2YgZG9jdW1lbnQubW96SGlkZGVuPyhlLmhpZGRlbj1cIm1vekhpZGRlblwiLGUudmlzaWJpbGl0eUNoYW5nZT1cIm1venZpc2liaWxpdHljaGFuZ2VcIik6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiYmKGUuaGlkZGVuPVwid2Via2l0SGlkZGVuXCIsZS52aXNpYmlsaXR5Q2hhbmdlPVwid2Via2l0dmlzaWJpbGl0eWNoYW5nZVwiKSxlLmF1dG9QbGF5PWEucHJveHkoZS5hdXRvUGxheSxlKSxlLmF1dG9QbGF5Q2xlYXI9YS5wcm94eShlLmF1dG9QbGF5Q2xlYXIsZSksZS5jaGFuZ2VTbGlkZT1hLnByb3h5KGUuY2hhbmdlU2xpZGUsZSksZS5jbGlja0hhbmRsZXI9YS5wcm94eShlLmNsaWNrSGFuZGxlcixlKSxlLnNlbGVjdEhhbmRsZXI9YS5wcm94eShlLnNlbGVjdEhhbmRsZXIsZSksZS5zZXRQb3NpdGlvbj1hLnByb3h5KGUuc2V0UG9zaXRpb24sZSksZS5zd2lwZUhhbmRsZXI9YS5wcm94eShlLnN3aXBlSGFuZGxlcixlKSxlLmRyYWdIYW5kbGVyPWEucHJveHkoZS5kcmFnSGFuZGxlcixlKSxlLmtleUhhbmRsZXI9YS5wcm94eShlLmtleUhhbmRsZXIsZSksZS5hdXRvUGxheUl0ZXJhdG9yPWEucHJveHkoZS5hdXRvUGxheUl0ZXJhdG9yLGUpLGUuaW5zdGFuY2VVaWQ9YisrLGUuaHRtbEV4cHI9L14oPzpcXHMqKDxbXFx3XFxXXSs+KVtePl0qKSQvLGUucmVnaXN0ZXJCcmVha3BvaW50cygpLGUuaW5pdCghMCksZS5jaGVja1Jlc3BvbnNpdmUoITApfXZhciBiPTA7cmV0dXJuIGN9KCksYi5wcm90b3R5cGUuYWRkU2xpZGU9Yi5wcm90b3R5cGUuc2xpY2tBZGQ9ZnVuY3Rpb24oYixjLGQpe3ZhciBlPXRoaXM7aWYoXCJib29sZWFuXCI9PXR5cGVvZiBjKWQ9YyxjPW51bGw7ZWxzZSBpZigwPmN8fGM+PWUuc2xpZGVDb3VudClyZXR1cm4hMTtlLnVubG9hZCgpLFwibnVtYmVyXCI9PXR5cGVvZiBjPzA9PT1jJiYwPT09ZS4kc2xpZGVzLmxlbmd0aD9hKGIpLmFwcGVuZFRvKGUuJHNsaWRlVHJhY2spOmQ/YShiKS5pbnNlcnRCZWZvcmUoZS4kc2xpZGVzLmVxKGMpKTphKGIpLmluc2VydEFmdGVyKGUuJHNsaWRlcy5lcShjKSk6ZD09PSEwP2EoYikucHJlcGVuZFRvKGUuJHNsaWRlVHJhY2spOmEoYikuYXBwZW5kVG8oZS4kc2xpZGVUcmFjayksZS4kc2xpZGVzPWUuJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKSxlLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCksZS4kc2xpZGVUcmFjay5hcHBlbmQoZS4kc2xpZGVzKSxlLiRzbGlkZXMuZWFjaChmdW5jdGlvbihiLGMpe2EoYykuYXR0cihcImRhdGEtc2xpY2staW5kZXhcIixiKX0pLGUuJHNsaWRlc0NhY2hlPWUuJHNsaWRlcyxlLnJlaW5pdCgpfSxiLnByb3RvdHlwZS5hbmltYXRlSGVpZ2h0PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcztpZigxPT09YS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmYS5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0PT09ITAmJmEub3B0aW9ucy52ZXJ0aWNhbD09PSExKXt2YXIgYj1hLiRzbGlkZXMuZXEoYS5jdXJyZW50U2xpZGUpLm91dGVySGVpZ2h0KCEwKTthLiRsaXN0LmFuaW1hdGUoe2hlaWdodDpifSxhLm9wdGlvbnMuc3BlZWQpfX0sYi5wcm90b3R5cGUuYW5pbWF0ZVNsaWRlPWZ1bmN0aW9uKGIsYyl7dmFyIGQ9e30sZT10aGlzO2UuYW5pbWF0ZUhlaWdodCgpLGUub3B0aW9ucy5ydGw9PT0hMCYmZS5vcHRpb25zLnZlcnRpY2FsPT09ITEmJihiPS1iKSxlLnRyYW5zZm9ybXNFbmFibGVkPT09ITE/ZS5vcHRpb25zLnZlcnRpY2FsPT09ITE/ZS4kc2xpZGVUcmFjay5hbmltYXRlKHtsZWZ0OmJ9LGUub3B0aW9ucy5zcGVlZCxlLm9wdGlvbnMuZWFzaW5nLGMpOmUuJHNsaWRlVHJhY2suYW5pbWF0ZSh7dG9wOmJ9LGUub3B0aW9ucy5zcGVlZCxlLm9wdGlvbnMuZWFzaW5nLGMpOmUuY3NzVHJhbnNpdGlvbnM9PT0hMT8oZS5vcHRpb25zLnJ0bD09PSEwJiYoZS5jdXJyZW50TGVmdD0tZS5jdXJyZW50TGVmdCksYSh7YW5pbVN0YXJ0OmUuY3VycmVudExlZnR9KS5hbmltYXRlKHthbmltU3RhcnQ6Yn0se2R1cmF0aW9uOmUub3B0aW9ucy5zcGVlZCxlYXNpbmc6ZS5vcHRpb25zLmVhc2luZyxzdGVwOmZ1bmN0aW9uKGEpe2E9TWF0aC5jZWlsKGEpLGUub3B0aW9ucy52ZXJ0aWNhbD09PSExPyhkW2UuYW5pbVR5cGVdPVwidHJhbnNsYXRlKFwiK2ErXCJweCwgMHB4KVwiLGUuJHNsaWRlVHJhY2suY3NzKGQpKTooZFtlLmFuaW1UeXBlXT1cInRyYW5zbGF0ZSgwcHgsXCIrYStcInB4KVwiLGUuJHNsaWRlVHJhY2suY3NzKGQpKX0sY29tcGxldGU6ZnVuY3Rpb24oKXtjJiZjLmNhbGwoKX19KSk6KGUuYXBwbHlUcmFuc2l0aW9uKCksYj1NYXRoLmNlaWwoYiksZS5vcHRpb25zLnZlcnRpY2FsPT09ITE/ZFtlLmFuaW1UeXBlXT1cInRyYW5zbGF0ZTNkKFwiK2IrXCJweCwgMHB4LCAwcHgpXCI6ZFtlLmFuaW1UeXBlXT1cInRyYW5zbGF0ZTNkKDBweCxcIitiK1wicHgsIDBweClcIixlLiRzbGlkZVRyYWNrLmNzcyhkKSxjJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZS5kaXNhYmxlVHJhbnNpdGlvbigpLGMuY2FsbCgpfSxlLm9wdGlvbnMuc3BlZWQpKX0sYi5wcm90b3R5cGUuYXNOYXZGb3I9ZnVuY3Rpb24oYil7dmFyIGM9dGhpcyxkPWMub3B0aW9ucy5hc05hdkZvcjtkJiZudWxsIT09ZCYmKGQ9YShkKS5ub3QoYy4kc2xpZGVyKSksbnVsbCE9PWQmJlwib2JqZWN0XCI9PXR5cGVvZiBkJiZkLmVhY2goZnVuY3Rpb24oKXt2YXIgYz1hKHRoaXMpLnNsaWNrKFwiZ2V0U2xpY2tcIik7Yy51bnNsaWNrZWR8fGMuc2xpZGVIYW5kbGVyKGIsITApfSl9LGIucHJvdG90eXBlLmFwcGx5VHJhbnNpdGlvbj1mdW5jdGlvbihhKXt2YXIgYj10aGlzLGM9e307Yi5vcHRpb25zLmZhZGU9PT0hMT9jW2IudHJhbnNpdGlvblR5cGVdPWIudHJhbnNmb3JtVHlwZStcIiBcIitiLm9wdGlvbnMuc3BlZWQrXCJtcyBcIitiLm9wdGlvbnMuY3NzRWFzZTpjW2IudHJhbnNpdGlvblR5cGVdPVwib3BhY2l0eSBcIitiLm9wdGlvbnMuc3BlZWQrXCJtcyBcIitiLm9wdGlvbnMuY3NzRWFzZSxiLm9wdGlvbnMuZmFkZT09PSExP2IuJHNsaWRlVHJhY2suY3NzKGMpOmIuJHNsaWRlcy5lcShhKS5jc3MoYyl9LGIucHJvdG90eXBlLmF1dG9QbGF5PWZ1bmN0aW9uKCl7dmFyIGE9dGhpczthLmF1dG9QbGF5VGltZXImJmNsZWFySW50ZXJ2YWwoYS5hdXRvUGxheVRpbWVyKSxhLnNsaWRlQ291bnQ+YS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmYS5wYXVzZWQhPT0hMCYmKGEuYXV0b1BsYXlUaW1lcj1zZXRJbnRlcnZhbChhLmF1dG9QbGF5SXRlcmF0b3IsYS5vcHRpb25zLmF1dG9wbGF5U3BlZWQpKX0sYi5wcm90b3R5cGUuYXV0b1BsYXlDbGVhcj1mdW5jdGlvbigpe3ZhciBhPXRoaXM7YS5hdXRvUGxheVRpbWVyJiZjbGVhckludGVydmFsKGEuYXV0b1BsYXlUaW1lcil9LGIucHJvdG90eXBlLmF1dG9QbGF5SXRlcmF0b3I9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2Eub3B0aW9ucy5pbmZpbml0ZT09PSExPzE9PT1hLmRpcmVjdGlvbj8oYS5jdXJyZW50U2xpZGUrMT09PWEuc2xpZGVDb3VudC0xJiYoYS5kaXJlY3Rpb249MCksYS5zbGlkZUhhbmRsZXIoYS5jdXJyZW50U2xpZGUrYS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSk6KGEuY3VycmVudFNsaWRlLTE9PT0wJiYoYS5kaXJlY3Rpb249MSksYS5zbGlkZUhhbmRsZXIoYS5jdXJyZW50U2xpZGUtYS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSk6YS5zbGlkZUhhbmRsZXIoYS5jdXJyZW50U2xpZGUrYS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKX0sYi5wcm90b3R5cGUuYnVpbGRBcnJvd3M9ZnVuY3Rpb24oKXt2YXIgYj10aGlzO2Iub3B0aW9ucy5hcnJvd3M9PT0hMCYmKGIuJHByZXZBcnJvdz1hKGIub3B0aW9ucy5wcmV2QXJyb3cpLmFkZENsYXNzKFwic2xpY2stYXJyb3dcIiksYi4kbmV4dEFycm93PWEoYi5vcHRpb25zLm5leHRBcnJvdykuYWRkQ2xhc3MoXCJzbGljay1hcnJvd1wiKSxiLnNsaWRlQ291bnQ+Yi5vcHRpb25zLnNsaWRlc1RvU2hvdz8oYi4kcHJldkFycm93LnJlbW92ZUNsYXNzKFwic2xpY2staGlkZGVuXCIpLnJlbW92ZUF0dHIoXCJhcmlhLWhpZGRlbiB0YWJpbmRleFwiKSxiLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1oaWRkZW5cIikucmVtb3ZlQXR0cihcImFyaWEtaGlkZGVuIHRhYmluZGV4XCIpLGIuaHRtbEV4cHIudGVzdChiLm9wdGlvbnMucHJldkFycm93KSYmYi4kcHJldkFycm93LnByZXBlbmRUbyhiLm9wdGlvbnMuYXBwZW5kQXJyb3dzKSxiLmh0bWxFeHByLnRlc3QoYi5vcHRpb25zLm5leHRBcnJvdykmJmIuJG5leHRBcnJvdy5hcHBlbmRUbyhiLm9wdGlvbnMuYXBwZW5kQXJyb3dzKSxiLm9wdGlvbnMuaW5maW5pdGUhPT0hMCYmYi4kcHJldkFycm93LmFkZENsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcInRydWVcIikpOmIuJHByZXZBcnJvdy5hZGQoYi4kbmV4dEFycm93KS5hZGRDbGFzcyhcInNsaWNrLWhpZGRlblwiKS5hdHRyKHtcImFyaWEtZGlzYWJsZWRcIjpcInRydWVcIix0YWJpbmRleDpcIi0xXCJ9KSl9LGIucHJvdG90eXBlLmJ1aWxkRG90cz1mdW5jdGlvbigpe3ZhciBjLGQsYj10aGlzO2lmKGIub3B0aW9ucy5kb3RzPT09ITAmJmIuc2xpZGVDb3VudD5iLm9wdGlvbnMuc2xpZGVzVG9TaG93KXtmb3IoZD0nPHVsIGNsYXNzPVwiJytiLm9wdGlvbnMuZG90c0NsYXNzKydcIj4nLGM9MDtjPD1iLmdldERvdENvdW50KCk7Yys9MSlkKz1cIjxsaT5cIitiLm9wdGlvbnMuY3VzdG9tUGFnaW5nLmNhbGwodGhpcyxiLGMpK1wiPC9saT5cIjtkKz1cIjwvdWw+XCIsYi4kZG90cz1hKGQpLmFwcGVuZFRvKGIub3B0aW9ucy5hcHBlbmREb3RzKSxiLiRkb3RzLmZpbmQoXCJsaVwiKS5maXJzdCgpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIil9fSxiLnByb3RvdHlwZS5idWlsZE91dD1mdW5jdGlvbigpe3ZhciBiPXRoaXM7Yi4kc2xpZGVzPWIuJHNsaWRlci5jaGlsZHJlbihiLm9wdGlvbnMuc2xpZGUrXCI6bm90KC5zbGljay1jbG9uZWQpXCIpLmFkZENsYXNzKFwic2xpY2stc2xpZGVcIiksYi5zbGlkZUNvdW50PWIuJHNsaWRlcy5sZW5ndGgsYi4kc2xpZGVzLmVhY2goZnVuY3Rpb24oYixjKXthKGMpLmF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIsYikuZGF0YShcIm9yaWdpbmFsU3R5bGluZ1wiLGEoYykuYXR0cihcInN0eWxlXCIpfHxcIlwiKX0pLGIuJHNsaWRlci5hZGRDbGFzcyhcInNsaWNrLXNsaWRlclwiKSxiLiRzbGlkZVRyYWNrPTA9PT1iLnNsaWRlQ291bnQ/YSgnPGRpdiBjbGFzcz1cInNsaWNrLXRyYWNrXCIvPicpLmFwcGVuZFRvKGIuJHNsaWRlcik6Yi4kc2xpZGVzLndyYXBBbGwoJzxkaXYgY2xhc3M9XCJzbGljay10cmFja1wiLz4nKS5wYXJlbnQoKSxiLiRsaXN0PWIuJHNsaWRlVHJhY2sud3JhcCgnPGRpdiBhcmlhLWxpdmU9XCJwb2xpdGVcIiBjbGFzcz1cInNsaWNrLWxpc3RcIi8+JykucGFyZW50KCksYi4kc2xpZGVUcmFjay5jc3MoXCJvcGFjaXR5XCIsMCksKGIub3B0aW9ucy5jZW50ZXJNb2RlPT09ITB8fGIub3B0aW9ucy5zd2lwZVRvU2xpZGU9PT0hMCkmJihiLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw9MSksYShcImltZ1tkYXRhLWxhenldXCIsYi4kc2xpZGVyKS5ub3QoXCJbc3JjXVwiKS5hZGRDbGFzcyhcInNsaWNrLWxvYWRpbmdcIiksYi5zZXR1cEluZmluaXRlKCksYi5idWlsZEFycm93cygpLGIuYnVpbGREb3RzKCksYi51cGRhdGVEb3RzKCksYi5zZXRTbGlkZUNsYXNzZXMoXCJudW1iZXJcIj09dHlwZW9mIGIuY3VycmVudFNsaWRlP2IuY3VycmVudFNsaWRlOjApLGIub3B0aW9ucy5kcmFnZ2FibGU9PT0hMCYmYi4kbGlzdC5hZGRDbGFzcyhcImRyYWdnYWJsZVwiKX0sYi5wcm90b3R5cGUuYnVpbGRSb3dzPWZ1bmN0aW9uKCl7dmFyIGIsYyxkLGUsZixnLGgsYT10aGlzO2lmKGU9ZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLGc9YS4kc2xpZGVyLmNoaWxkcmVuKCksYS5vcHRpb25zLnJvd3M+MSl7Zm9yKGg9YS5vcHRpb25zLnNsaWRlc1BlclJvdyphLm9wdGlvbnMucm93cyxmPU1hdGguY2VpbChnLmxlbmd0aC9oKSxiPTA7Zj5iO2IrKyl7dmFyIGk9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtmb3IoYz0wO2M8YS5vcHRpb25zLnJvd3M7YysrKXt2YXIgaj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2ZvcihkPTA7ZDxhLm9wdGlvbnMuc2xpZGVzUGVyUm93O2QrKyl7dmFyIGs9YipoKyhjKmEub3B0aW9ucy5zbGlkZXNQZXJSb3crZCk7Zy5nZXQoaykmJmouYXBwZW5kQ2hpbGQoZy5nZXQoaykpfWkuYXBwZW5kQ2hpbGQoail9ZS5hcHBlbmRDaGlsZChpKX1hLiRzbGlkZXIuaHRtbChlKSxhLiRzbGlkZXIuY2hpbGRyZW4oKS5jaGlsZHJlbigpLmNoaWxkcmVuKCkuY3NzKHt3aWR0aDoxMDAvYS5vcHRpb25zLnNsaWRlc1BlclJvdytcIiVcIixkaXNwbGF5OlwiaW5saW5lLWJsb2NrXCJ9KX19LGIucHJvdG90eXBlLmNoZWNrUmVzcG9uc2l2ZT1mdW5jdGlvbihiLGMpe3ZhciBlLGYsZyxkPXRoaXMsaD0hMSxpPWQuJHNsaWRlci53aWR0aCgpLGo9d2luZG93LmlubmVyV2lkdGh8fGEod2luZG93KS53aWR0aCgpO2lmKFwid2luZG93XCI9PT1kLnJlc3BvbmRUbz9nPWo6XCJzbGlkZXJcIj09PWQucmVzcG9uZFRvP2c9aTpcIm1pblwiPT09ZC5yZXNwb25kVG8mJihnPU1hdGgubWluKGosaSkpLGQub3B0aW9ucy5yZXNwb25zaXZlJiZkLm9wdGlvbnMucmVzcG9uc2l2ZS5sZW5ndGgmJm51bGwhPT1kLm9wdGlvbnMucmVzcG9uc2l2ZSl7Zj1udWxsO2ZvcihlIGluIGQuYnJlYWtwb2ludHMpZC5icmVha3BvaW50cy5oYXNPd25Qcm9wZXJ0eShlKSYmKGQub3JpZ2luYWxTZXR0aW5ncy5tb2JpbGVGaXJzdD09PSExP2c8ZC5icmVha3BvaW50c1tlXSYmKGY9ZC5icmVha3BvaW50c1tlXSk6Zz5kLmJyZWFrcG9pbnRzW2VdJiYoZj1kLmJyZWFrcG9pbnRzW2VdKSk7bnVsbCE9PWY/bnVsbCE9PWQuYWN0aXZlQnJlYWtwb2ludD8oZiE9PWQuYWN0aXZlQnJlYWtwb2ludHx8YykmJihkLmFjdGl2ZUJyZWFrcG9pbnQ9ZixcInVuc2xpY2tcIj09PWQuYnJlYWtwb2ludFNldHRpbmdzW2ZdP2QudW5zbGljayhmKTooZC5vcHRpb25zPWEuZXh0ZW5kKHt9LGQub3JpZ2luYWxTZXR0aW5ncyxkLmJyZWFrcG9pbnRTZXR0aW5nc1tmXSksYj09PSEwJiYoZC5jdXJyZW50U2xpZGU9ZC5vcHRpb25zLmluaXRpYWxTbGlkZSksZC5yZWZyZXNoKGIpKSxoPWYpOihkLmFjdGl2ZUJyZWFrcG9pbnQ9ZixcInVuc2xpY2tcIj09PWQuYnJlYWtwb2ludFNldHRpbmdzW2ZdP2QudW5zbGljayhmKTooZC5vcHRpb25zPWEuZXh0ZW5kKHt9LGQub3JpZ2luYWxTZXR0aW5ncyxkLmJyZWFrcG9pbnRTZXR0aW5nc1tmXSksYj09PSEwJiYoZC5jdXJyZW50U2xpZGU9ZC5vcHRpb25zLmluaXRpYWxTbGlkZSksZC5yZWZyZXNoKGIpKSxoPWYpOm51bGwhPT1kLmFjdGl2ZUJyZWFrcG9pbnQmJihkLmFjdGl2ZUJyZWFrcG9pbnQ9bnVsbCxkLm9wdGlvbnM9ZC5vcmlnaW5hbFNldHRpbmdzLGI9PT0hMCYmKGQuY3VycmVudFNsaWRlPWQub3B0aW9ucy5pbml0aWFsU2xpZGUpLGQucmVmcmVzaChiKSxoPWYpLGJ8fGg9PT0hMXx8ZC4kc2xpZGVyLnRyaWdnZXIoXCJicmVha3BvaW50XCIsW2QsaF0pfX0sYi5wcm90b3R5cGUuY2hhbmdlU2xpZGU9ZnVuY3Rpb24oYixjKXt2YXIgZixnLGgsZD10aGlzLGU9YShiLnRhcmdldCk7c3dpdGNoKGUuaXMoXCJhXCIpJiZiLnByZXZlbnREZWZhdWx0KCksZS5pcyhcImxpXCIpfHwoZT1lLmNsb3Nlc3QoXCJsaVwiKSksaD1kLnNsaWRlQ291bnQlZC5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIT09MCxmPWg/MDooZC5zbGlkZUNvdW50LWQuY3VycmVudFNsaWRlKSVkLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwsYi5kYXRhLm1lc3NhZ2Upe2Nhc2VcInByZXZpb3VzXCI6Zz0wPT09Zj9kLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw6ZC5vcHRpb25zLnNsaWRlc1RvU2hvdy1mLGQuc2xpZGVDb3VudD5kLm9wdGlvbnMuc2xpZGVzVG9TaG93JiZkLnNsaWRlSGFuZGxlcihkLmN1cnJlbnRTbGlkZS1nLCExLGMpO2JyZWFrO2Nhc2VcIm5leHRcIjpnPTA9PT1mP2Qub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDpmLGQuc2xpZGVDb3VudD5kLm9wdGlvbnMuc2xpZGVzVG9TaG93JiZkLnNsaWRlSGFuZGxlcihkLmN1cnJlbnRTbGlkZStnLCExLGMpO2JyZWFrO2Nhc2VcImluZGV4XCI6dmFyIGk9MD09PWIuZGF0YS5pbmRleD8wOmIuZGF0YS5pbmRleHx8ZS5pbmRleCgpKmQub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtkLnNsaWRlSGFuZGxlcihkLmNoZWNrTmF2aWdhYmxlKGkpLCExLGMpLGUuY2hpbGRyZW4oKS50cmlnZ2VyKFwiZm9jdXNcIik7YnJlYWs7ZGVmYXVsdDpyZXR1cm59fSxiLnByb3RvdHlwZS5jaGVja05hdmlnYWJsZT1mdW5jdGlvbihhKXt2YXIgYyxkLGI9dGhpcztpZihjPWIuZ2V0TmF2aWdhYmxlSW5kZXhlcygpLGQ9MCxhPmNbYy5sZW5ndGgtMV0pYT1jW2MubGVuZ3RoLTFdO2Vsc2UgZm9yKHZhciBlIGluIGMpe2lmKGE8Y1tlXSl7YT1kO2JyZWFrfWQ9Y1tlXX1yZXR1cm4gYX0sYi5wcm90b3R5cGUuY2xlYW5VcEV2ZW50cz1mdW5jdGlvbigpe3ZhciBiPXRoaXM7Yi5vcHRpb25zLmRvdHMmJm51bGwhPT1iLiRkb3RzJiYoYShcImxpXCIsYi4kZG90cykub2ZmKFwiY2xpY2suc2xpY2tcIixiLmNoYW5nZVNsaWRlKSxiLm9wdGlvbnMucGF1c2VPbkRvdHNIb3Zlcj09PSEwJiZiLm9wdGlvbnMuYXV0b3BsYXk9PT0hMCYmYShcImxpXCIsYi4kZG90cykub2ZmKFwibW91c2VlbnRlci5zbGlja1wiLGEucHJveHkoYi5zZXRQYXVzZWQsYiwhMCkpLm9mZihcIm1vdXNlbGVhdmUuc2xpY2tcIixhLnByb3h5KGIuc2V0UGF1c2VkLGIsITEpKSksYi5vcHRpb25zLmFycm93cz09PSEwJiZiLnNsaWRlQ291bnQ+Yi5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKGIuJHByZXZBcnJvdyYmYi4kcHJldkFycm93Lm9mZihcImNsaWNrLnNsaWNrXCIsYi5jaGFuZ2VTbGlkZSksYi4kbmV4dEFycm93JiZiLiRuZXh0QXJyb3cub2ZmKFwiY2xpY2suc2xpY2tcIixiLmNoYW5nZVNsaWRlKSksYi4kbGlzdC5vZmYoXCJ0b3VjaHN0YXJ0LnNsaWNrIG1vdXNlZG93bi5zbGlja1wiLGIuc3dpcGVIYW5kbGVyKSxiLiRsaXN0Lm9mZihcInRvdWNobW92ZS5zbGljayBtb3VzZW1vdmUuc2xpY2tcIixiLnN3aXBlSGFuZGxlciksYi4kbGlzdC5vZmYoXCJ0b3VjaGVuZC5zbGljayBtb3VzZXVwLnNsaWNrXCIsYi5zd2lwZUhhbmRsZXIpLGIuJGxpc3Qub2ZmKFwidG91Y2hjYW5jZWwuc2xpY2sgbW91c2VsZWF2ZS5zbGlja1wiLGIuc3dpcGVIYW5kbGVyKSxiLiRsaXN0Lm9mZihcImNsaWNrLnNsaWNrXCIsYi5jbGlja0hhbmRsZXIpLGEoZG9jdW1lbnQpLm9mZihiLnZpc2liaWxpdHlDaGFuZ2UsYi52aXNpYmlsaXR5KSxiLiRsaXN0Lm9mZihcIm1vdXNlZW50ZXIuc2xpY2tcIixhLnByb3h5KGIuc2V0UGF1c2VkLGIsITApKSxiLiRsaXN0Lm9mZihcIm1vdXNlbGVhdmUuc2xpY2tcIixhLnByb3h5KGIuc2V0UGF1c2VkLGIsITEpKSxiLm9wdGlvbnMuYWNjZXNzaWJpbGl0eT09PSEwJiZiLiRsaXN0Lm9mZihcImtleWRvd24uc2xpY2tcIixiLmtleUhhbmRsZXIpLGIub3B0aW9ucy5mb2N1c09uU2VsZWN0PT09ITAmJmEoYi4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vZmYoXCJjbGljay5zbGlja1wiLGIuc2VsZWN0SGFuZGxlciksYSh3aW5kb3cpLm9mZihcIm9yaWVudGF0aW9uY2hhbmdlLnNsaWNrLnNsaWNrLVwiK2IuaW5zdGFuY2VVaWQsYi5vcmllbnRhdGlvbkNoYW5nZSksYSh3aW5kb3cpLm9mZihcInJlc2l6ZS5zbGljay5zbGljay1cIitiLmluc3RhbmNlVWlkLGIucmVzaXplKSxhKFwiW2RyYWdnYWJsZSE9dHJ1ZV1cIixiLiRzbGlkZVRyYWNrKS5vZmYoXCJkcmFnc3RhcnRcIixiLnByZXZlbnREZWZhdWx0KSxhKHdpbmRvdykub2ZmKFwibG9hZC5zbGljay5zbGljay1cIitiLmluc3RhbmNlVWlkLGIuc2V0UG9zaXRpb24pLGEoZG9jdW1lbnQpLm9mZihcInJlYWR5LnNsaWNrLnNsaWNrLVwiK2IuaW5zdGFuY2VVaWQsYi5zZXRQb3NpdGlvbil9LGIucHJvdG90eXBlLmNsZWFuVXBSb3dzPWZ1bmN0aW9uKCl7dmFyIGIsYT10aGlzO2Eub3B0aW9ucy5yb3dzPjEmJihiPWEuJHNsaWRlcy5jaGlsZHJlbigpLmNoaWxkcmVuKCksYi5yZW1vdmVBdHRyKFwic3R5bGVcIiksYS4kc2xpZGVyLmh0bWwoYikpfSxiLnByb3RvdHlwZS5jbGlja0hhbmRsZXI9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztiLnNob3VsZENsaWNrPT09ITEmJihhLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpLGEuc3RvcFByb3BhZ2F0aW9uKCksYS5wcmV2ZW50RGVmYXVsdCgpKX0sYi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbihiKXt2YXIgYz10aGlzO2MuYXV0b1BsYXlDbGVhcigpLGMudG91Y2hPYmplY3Q9e30sYy5jbGVhblVwRXZlbnRzKCksYShcIi5zbGljay1jbG9uZWRcIixjLiRzbGlkZXIpLmRldGFjaCgpLGMuJGRvdHMmJmMuJGRvdHMucmVtb3ZlKCksYy4kcHJldkFycm93JiZjLiRwcmV2QXJyb3cubGVuZ3RoJiYoYy4kcHJldkFycm93LnJlbW92ZUNsYXNzKFwic2xpY2stZGlzYWJsZWQgc2xpY2stYXJyb3cgc2xpY2staGlkZGVuXCIpLnJlbW92ZUF0dHIoXCJhcmlhLWhpZGRlbiBhcmlhLWRpc2FibGVkIHRhYmluZGV4XCIpLmNzcyhcImRpc3BsYXlcIixcIlwiKSxjLmh0bWxFeHByLnRlc3QoYy5vcHRpb25zLnByZXZBcnJvdykmJmMuJHByZXZBcnJvdy5yZW1vdmUoKSksYy4kbmV4dEFycm93JiZjLiRuZXh0QXJyb3cubGVuZ3RoJiYoYy4kbmV4dEFycm93LnJlbW92ZUNsYXNzKFwic2xpY2stZGlzYWJsZWQgc2xpY2stYXJyb3cgc2xpY2staGlkZGVuXCIpLnJlbW92ZUF0dHIoXCJhcmlhLWhpZGRlbiBhcmlhLWRpc2FibGVkIHRhYmluZGV4XCIpLmNzcyhcImRpc3BsYXlcIixcIlwiKSxjLmh0bWxFeHByLnRlc3QoYy5vcHRpb25zLm5leHRBcnJvdykmJmMuJG5leHRBcnJvdy5yZW1vdmUoKSksYy4kc2xpZGVzJiYoYy4kc2xpZGVzLnJlbW92ZUNsYXNzKFwic2xpY2stc2xpZGUgc2xpY2stYWN0aXZlIHNsaWNrLWNlbnRlciBzbGljay12aXNpYmxlIHNsaWNrLWN1cnJlbnRcIikucmVtb3ZlQXR0cihcImFyaWEtaGlkZGVuXCIpLnJlbW92ZUF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIpLmVhY2goZnVuY3Rpb24oKXthKHRoaXMpLmF0dHIoXCJzdHlsZVwiLGEodGhpcykuZGF0YShcIm9yaWdpbmFsU3R5bGluZ1wiKSl9KSxjLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCksYy4kc2xpZGVUcmFjay5kZXRhY2goKSxjLiRsaXN0LmRldGFjaCgpLGMuJHNsaWRlci5hcHBlbmQoYy4kc2xpZGVzKSksYy5jbGVhblVwUm93cygpLGMuJHNsaWRlci5yZW1vdmVDbGFzcyhcInNsaWNrLXNsaWRlclwiKSxjLiRzbGlkZXIucmVtb3ZlQ2xhc3MoXCJzbGljay1pbml0aWFsaXplZFwiKSxjLnVuc2xpY2tlZD0hMCxifHxjLiRzbGlkZXIudHJpZ2dlcihcImRlc3Ryb3lcIixbY10pfSxiLnByb3RvdHlwZS5kaXNhYmxlVHJhbnNpdGlvbj1mdW5jdGlvbihhKXt2YXIgYj10aGlzLGM9e307Y1tiLnRyYW5zaXRpb25UeXBlXT1cIlwiLGIub3B0aW9ucy5mYWRlPT09ITE/Yi4kc2xpZGVUcmFjay5jc3MoYyk6Yi4kc2xpZGVzLmVxKGEpLmNzcyhjKX0sYi5wcm90b3R5cGUuZmFkZVNsaWRlPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcztjLmNzc1RyYW5zaXRpb25zPT09ITE/KGMuJHNsaWRlcy5lcShhKS5jc3Moe3pJbmRleDpjLm9wdGlvbnMuekluZGV4fSksYy4kc2xpZGVzLmVxKGEpLmFuaW1hdGUoe29wYWNpdHk6MX0sYy5vcHRpb25zLnNwZWVkLGMub3B0aW9ucy5lYXNpbmcsYikpOihjLmFwcGx5VHJhbnNpdGlvbihhKSxjLiRzbGlkZXMuZXEoYSkuY3NzKHtvcGFjaXR5OjEsekluZGV4OmMub3B0aW9ucy56SW5kZXh9KSxiJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yy5kaXNhYmxlVHJhbnNpdGlvbihhKSxiLmNhbGwoKX0sYy5vcHRpb25zLnNwZWVkKSl9LGIucHJvdG90eXBlLmZhZGVTbGlkZU91dD1mdW5jdGlvbihhKXt2YXIgYj10aGlzO2IuY3NzVHJhbnNpdGlvbnM9PT0hMT9iLiRzbGlkZXMuZXEoYSkuYW5pbWF0ZSh7b3BhY2l0eTowLHpJbmRleDpiLm9wdGlvbnMuekluZGV4LTJ9LGIub3B0aW9ucy5zcGVlZCxiLm9wdGlvbnMuZWFzaW5nKTooYi5hcHBseVRyYW5zaXRpb24oYSksYi4kc2xpZGVzLmVxKGEpLmNzcyh7b3BhY2l0eTowLHpJbmRleDpiLm9wdGlvbnMuekluZGV4LTJ9KSl9LGIucHJvdG90eXBlLmZpbHRlclNsaWRlcz1iLnByb3RvdHlwZS5zbGlja0ZpbHRlcj1mdW5jdGlvbihhKXt2YXIgYj10aGlzO251bGwhPT1hJiYoYi4kc2xpZGVzQ2FjaGU9Yi4kc2xpZGVzLGIudW5sb2FkKCksYi4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpLGIuJHNsaWRlc0NhY2hlLmZpbHRlcihhKS5hcHBlbmRUbyhiLiRzbGlkZVRyYWNrKSxiLnJlaW5pdCgpKX0sYi5wcm90b3R5cGUuZ2V0Q3VycmVudD1iLnByb3RvdHlwZS5zbGlja0N1cnJlbnRTbGlkZT1mdW5jdGlvbigpe3ZhciBhPXRoaXM7cmV0dXJuIGEuY3VycmVudFNsaWRlfSxiLnByb3RvdHlwZS5nZXREb3RDb3VudD1mdW5jdGlvbigpe3ZhciBhPXRoaXMsYj0wLGM9MCxkPTA7aWYoYS5vcHRpb25zLmluZmluaXRlPT09ITApZm9yKDtiPGEuc2xpZGVDb3VudDspKytkLGI9YythLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwsYys9YS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsPD1hLm9wdGlvbnMuc2xpZGVzVG9TaG93P2Eub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDphLm9wdGlvbnMuc2xpZGVzVG9TaG93O2Vsc2UgaWYoYS5vcHRpb25zLmNlbnRlck1vZGU9PT0hMClkPWEuc2xpZGVDb3VudDtlbHNlIGZvcig7YjxhLnNsaWRlQ291bnQ7KSsrZCxiPWMrYS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLGMrPWEub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDw9YS5vcHRpb25zLnNsaWRlc1RvU2hvdz9hLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw6YS5vcHRpb25zLnNsaWRlc1RvU2hvdztyZXR1cm4gZC0xfSxiLnByb3RvdHlwZS5nZXRMZWZ0PWZ1bmN0aW9uKGEpe3ZhciBjLGQsZixiPXRoaXMsZT0wO3JldHVybiBiLnNsaWRlT2Zmc2V0PTAsZD1iLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCghMCksYi5vcHRpb25zLmluZmluaXRlPT09ITA/KGIuc2xpZGVDb3VudD5iLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoYi5zbGlkZU9mZnNldD1iLnNsaWRlV2lkdGgqYi5vcHRpb25zLnNsaWRlc1RvU2hvdyotMSxlPWQqYi5vcHRpb25zLnNsaWRlc1RvU2hvdyotMSksYi5zbGlkZUNvdW50JWIub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCE9PTAmJmErYi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsPmIuc2xpZGVDb3VudCYmYi5zbGlkZUNvdW50PmIub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihhPmIuc2xpZGVDb3VudD8oYi5zbGlkZU9mZnNldD0oYi5vcHRpb25zLnNsaWRlc1RvU2hvdy0oYS1iLnNsaWRlQ291bnQpKSpiLnNsaWRlV2lkdGgqLTEsZT0oYi5vcHRpb25zLnNsaWRlc1RvU2hvdy0oYS1iLnNsaWRlQ291bnQpKSpkKi0xKTooYi5zbGlkZU9mZnNldD1iLnNsaWRlQ291bnQlYi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKmIuc2xpZGVXaWR0aCotMSxlPWIuc2xpZGVDb3VudCViLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwqZCotMSkpKTphK2Iub3B0aW9ucy5zbGlkZXNUb1Nob3c+Yi5zbGlkZUNvdW50JiYoYi5zbGlkZU9mZnNldD0oYStiLm9wdGlvbnMuc2xpZGVzVG9TaG93LWIuc2xpZGVDb3VudCkqYi5zbGlkZVdpZHRoLGU9KGErYi5vcHRpb25zLnNsaWRlc1RvU2hvdy1iLnNsaWRlQ291bnQpKmQpLGIuc2xpZGVDb3VudDw9Yi5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKGIuc2xpZGVPZmZzZXQ9MCxlPTApLGIub3B0aW9ucy5jZW50ZXJNb2RlPT09ITAmJmIub3B0aW9ucy5pbmZpbml0ZT09PSEwP2Iuc2xpZGVPZmZzZXQrPWIuc2xpZGVXaWR0aCpNYXRoLmZsb29yKGIub3B0aW9ucy5zbGlkZXNUb1Nob3cvMiktYi5zbGlkZVdpZHRoOmIub3B0aW9ucy5jZW50ZXJNb2RlPT09ITAmJihiLnNsaWRlT2Zmc2V0PTAsYi5zbGlkZU9mZnNldCs9Yi5zbGlkZVdpZHRoKk1hdGguZmxvb3IoYi5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKSksYz1iLm9wdGlvbnMudmVydGljYWw9PT0hMT9hKmIuc2xpZGVXaWR0aCotMStiLnNsaWRlT2Zmc2V0OmEqZCotMStlLGIub3B0aW9ucy52YXJpYWJsZVdpZHRoPT09ITAmJihmPWIuc2xpZGVDb3VudDw9Yi5vcHRpb25zLnNsaWRlc1RvU2hvd3x8Yi5vcHRpb25zLmluZmluaXRlPT09ITE/Yi4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS5lcShhKTpiLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLmVxKGErYi5vcHRpb25zLnNsaWRlc1RvU2hvdyksYz1iLm9wdGlvbnMucnRsPT09ITA/ZlswXT8tMSooYi4kc2xpZGVUcmFjay53aWR0aCgpLWZbMF0ub2Zmc2V0TGVmdC1mLndpZHRoKCkpOjA6ZlswXT8tMSpmWzBdLm9mZnNldExlZnQ6MCxiLm9wdGlvbnMuY2VudGVyTW9kZT09PSEwJiYoZj1iLnNsaWRlQ291bnQ8PWIub3B0aW9ucy5zbGlkZXNUb1Nob3d8fGIub3B0aW9ucy5pbmZpbml0ZT09PSExP2IuJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikuZXEoYSk6Yi4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS5lcShhK2Iub3B0aW9ucy5zbGlkZXNUb1Nob3crMSksYz1iLm9wdGlvbnMucnRsPT09ITA/ZlswXT8tMSooYi4kc2xpZGVUcmFjay53aWR0aCgpLWZbMF0ub2Zmc2V0TGVmdC1mLndpZHRoKCkpOjA6ZlswXT8tMSpmWzBdLm9mZnNldExlZnQ6MCxjKz0oYi4kbGlzdC53aWR0aCgpLWYub3V0ZXJXaWR0aCgpKS8yKSksY30sYi5wcm90b3R5cGUuZ2V0T3B0aW9uPWIucHJvdG90eXBlLnNsaWNrR2V0T3B0aW9uPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7cmV0dXJuIGIub3B0aW9uc1thXX0sYi5wcm90b3R5cGUuZ2V0TmF2aWdhYmxlSW5kZXhlcz1mdW5jdGlvbigpe3ZhciBlLGE9dGhpcyxiPTAsYz0wLGQ9W107Zm9yKGEub3B0aW9ucy5pbmZpbml0ZT09PSExP2U9YS5zbGlkZUNvdW50OihiPS0xKmEub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCxjPS0xKmEub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCxlPTIqYS5zbGlkZUNvdW50KTtlPmI7KWQucHVzaChiKSxiPWMrYS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLGMrPWEub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDw9YS5vcHRpb25zLnNsaWRlc1RvU2hvdz9hLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw6YS5vcHRpb25zLnNsaWRlc1RvU2hvdztyZXR1cm4gZH0sYi5wcm90b3R5cGUuZ2V0U2xpY2s9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30sYi5wcm90b3R5cGUuZ2V0U2xpZGVDb3VudD1mdW5jdGlvbigpe3ZhciBjLGQsZSxiPXRoaXM7cmV0dXJuIGU9Yi5vcHRpb25zLmNlbnRlck1vZGU9PT0hMD9iLnNsaWRlV2lkdGgqTWF0aC5mbG9vcihiLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIpOjAsYi5vcHRpb25zLnN3aXBlVG9TbGlkZT09PSEwPyhiLiRzbGlkZVRyYWNrLmZpbmQoXCIuc2xpY2stc2xpZGVcIikuZWFjaChmdW5jdGlvbihjLGYpe3JldHVybiBmLm9mZnNldExlZnQtZSthKGYpLm91dGVyV2lkdGgoKS8yPi0xKmIuc3dpcGVMZWZ0PyhkPWYsITEpOnZvaWQgMH0pLGM9TWF0aC5hYnMoYShkKS5hdHRyKFwiZGF0YS1zbGljay1pbmRleFwiKS1iLmN1cnJlbnRTbGlkZSl8fDEpOmIub3B0aW9ucy5zbGlkZXNUb1Njcm9sbH0sYi5wcm90b3R5cGUuZ29Ubz1iLnByb3RvdHlwZS5zbGlja0dvVG89ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzO2MuY2hhbmdlU2xpZGUoe2RhdGE6e21lc3NhZ2U6XCJpbmRleFwiLGluZGV4OnBhcnNlSW50KGEpfX0sYil9LGIucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oYil7dmFyIGM9dGhpczthKGMuJHNsaWRlcikuaGFzQ2xhc3MoXCJzbGljay1pbml0aWFsaXplZFwiKXx8KGEoYy4kc2xpZGVyKS5hZGRDbGFzcyhcInNsaWNrLWluaXRpYWxpemVkXCIpLGMuYnVpbGRSb3dzKCksYy5idWlsZE91dCgpLGMuc2V0UHJvcHMoKSxjLnN0YXJ0TG9hZCgpLGMubG9hZFNsaWRlcigpLGMuaW5pdGlhbGl6ZUV2ZW50cygpLGMudXBkYXRlQXJyb3dzKCksYy51cGRhdGVEb3RzKCkpLGImJmMuJHNsaWRlci50cmlnZ2VyKFwiaW5pdFwiLFtjXSksYy5vcHRpb25zLmFjY2Vzc2liaWxpdHk9PT0hMCYmYy5pbml0QURBKCl9LGIucHJvdG90eXBlLmluaXRBcnJvd0V2ZW50cz1mdW5jdGlvbigpe3ZhciBhPXRoaXM7YS5vcHRpb25zLmFycm93cz09PSEwJiZhLnNsaWRlQ291bnQ+YS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKGEuJHByZXZBcnJvdy5vbihcImNsaWNrLnNsaWNrXCIse21lc3NhZ2U6XCJwcmV2aW91c1wifSxhLmNoYW5nZVNsaWRlKSxhLiRuZXh0QXJyb3cub24oXCJjbGljay5zbGlja1wiLHttZXNzYWdlOlwibmV4dFwifSxhLmNoYW5nZVNsaWRlKSl9LGIucHJvdG90eXBlLmluaXREb3RFdmVudHM9ZnVuY3Rpb24oKXt2YXIgYj10aGlzO2Iub3B0aW9ucy5kb3RzPT09ITAmJmIuc2xpZGVDb3VudD5iLm9wdGlvbnMuc2xpZGVzVG9TaG93JiZhKFwibGlcIixiLiRkb3RzKS5vbihcImNsaWNrLnNsaWNrXCIse21lc3NhZ2U6XCJpbmRleFwifSxiLmNoYW5nZVNsaWRlKSxiLm9wdGlvbnMuZG90cz09PSEwJiZiLm9wdGlvbnMucGF1c2VPbkRvdHNIb3Zlcj09PSEwJiZiLm9wdGlvbnMuYXV0b3BsYXk9PT0hMCYmYShcImxpXCIsYi4kZG90cykub24oXCJtb3VzZWVudGVyLnNsaWNrXCIsYS5wcm94eShiLnNldFBhdXNlZCxiLCEwKSkub24oXCJtb3VzZWxlYXZlLnNsaWNrXCIsYS5wcm94eShiLnNldFBhdXNlZCxiLCExKSl9LGIucHJvdG90eXBlLmluaXRpYWxpemVFdmVudHM9ZnVuY3Rpb24oKXt2YXIgYj10aGlzO2IuaW5pdEFycm93RXZlbnRzKCksYi5pbml0RG90RXZlbnRzKCksYi4kbGlzdC5vbihcInRvdWNoc3RhcnQuc2xpY2sgbW91c2Vkb3duLnNsaWNrXCIse2FjdGlvbjpcInN0YXJ0XCJ9LGIuc3dpcGVIYW5kbGVyKSxiLiRsaXN0Lm9uKFwidG91Y2htb3ZlLnNsaWNrIG1vdXNlbW92ZS5zbGlja1wiLHthY3Rpb246XCJtb3ZlXCJ9LGIuc3dpcGVIYW5kbGVyKSxiLiRsaXN0Lm9uKFwidG91Y2hlbmQuc2xpY2sgbW91c2V1cC5zbGlja1wiLHthY3Rpb246XCJlbmRcIn0sYi5zd2lwZUhhbmRsZXIpLGIuJGxpc3Qub24oXCJ0b3VjaGNhbmNlbC5zbGljayBtb3VzZWxlYXZlLnNsaWNrXCIse2FjdGlvbjpcImVuZFwifSxiLnN3aXBlSGFuZGxlciksYi4kbGlzdC5vbihcImNsaWNrLnNsaWNrXCIsYi5jbGlja0hhbmRsZXIpLGEoZG9jdW1lbnQpLm9uKGIudmlzaWJpbGl0eUNoYW5nZSxhLnByb3h5KGIudmlzaWJpbGl0eSxiKSksYi4kbGlzdC5vbihcIm1vdXNlZW50ZXIuc2xpY2tcIixhLnByb3h5KGIuc2V0UGF1c2VkLGIsITApKSxiLiRsaXN0Lm9uKFwibW91c2VsZWF2ZS5zbGlja1wiLGEucHJveHkoYi5zZXRQYXVzZWQsYiwhMSkpLGIub3B0aW9ucy5hY2Nlc3NpYmlsaXR5PT09ITAmJmIuJGxpc3Qub24oXCJrZXlkb3duLnNsaWNrXCIsYi5rZXlIYW5kbGVyKSxiLm9wdGlvbnMuZm9jdXNPblNlbGVjdD09PSEwJiZhKGIuJHNsaWRlVHJhY2spLmNoaWxkcmVuKCkub24oXCJjbGljay5zbGlja1wiLGIuc2VsZWN0SGFuZGxlciksYSh3aW5kb3cpLm9uKFwib3JpZW50YXRpb25jaGFuZ2Uuc2xpY2suc2xpY2stXCIrYi5pbnN0YW5jZVVpZCxhLnByb3h5KGIub3JpZW50YXRpb25DaGFuZ2UsYikpLGEod2luZG93KS5vbihcInJlc2l6ZS5zbGljay5zbGljay1cIitiLmluc3RhbmNlVWlkLGEucHJveHkoYi5yZXNpemUsYikpLGEoXCJbZHJhZ2dhYmxlIT10cnVlXVwiLGIuJHNsaWRlVHJhY2spLm9uKFwiZHJhZ3N0YXJ0XCIsYi5wcmV2ZW50RGVmYXVsdCksYSh3aW5kb3cpLm9uKFwibG9hZC5zbGljay5zbGljay1cIitiLmluc3RhbmNlVWlkLGIuc2V0UG9zaXRpb24pLGEoZG9jdW1lbnQpLm9uKFwicmVhZHkuc2xpY2suc2xpY2stXCIrYi5pbnN0YW5jZVVpZCxiLnNldFBvc2l0aW9uKX0sYi5wcm90b3R5cGUuaW5pdFVJPWZ1bmN0aW9uKCl7dmFyIGE9dGhpczthLm9wdGlvbnMuYXJyb3dzPT09ITAmJmEuc2xpZGVDb3VudD5hLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoYS4kcHJldkFycm93LnNob3coKSxhLiRuZXh0QXJyb3cuc2hvdygpKSxhLm9wdGlvbnMuZG90cz09PSEwJiZhLnNsaWRlQ291bnQ+YS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmYS4kZG90cy5zaG93KCksYS5vcHRpb25zLmF1dG9wbGF5PT09ITAmJmEuYXV0b1BsYXkoKX0sYi5wcm90b3R5cGUua2V5SGFuZGxlcj1mdW5jdGlvbihhKXt2YXIgYj10aGlzO2EudGFyZ2V0LnRhZ05hbWUubWF0Y2goXCJURVhUQVJFQXxJTlBVVHxTRUxFQ1RcIil8fCgzNz09PWEua2V5Q29kZSYmYi5vcHRpb25zLmFjY2Vzc2liaWxpdHk9PT0hMD9iLmNoYW5nZVNsaWRlKHtkYXRhOnttZXNzYWdlOlwicHJldmlvdXNcIn19KTozOT09PWEua2V5Q29kZSYmYi5vcHRpb25zLmFjY2Vzc2liaWxpdHk9PT0hMCYmYi5jaGFuZ2VTbGlkZSh7ZGF0YTp7bWVzc2FnZTpcIm5leHRcIn19KSl9LGIucHJvdG90eXBlLmxhenlMb2FkPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZyhiKXthKFwiaW1nW2RhdGEtbGF6eV1cIixiKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIGI9YSh0aGlzKSxjPWEodGhpcykuYXR0cihcImRhdGEtbGF6eVwiKSxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7ZC5vbmxvYWQ9ZnVuY3Rpb24oKXtiLmFuaW1hdGUoe29wYWNpdHk6MH0sMTAwLGZ1bmN0aW9uKCl7Yi5hdHRyKFwic3JjXCIsYykuYW5pbWF0ZSh7b3BhY2l0eToxfSwyMDAsZnVuY3Rpb24oKXtiLnJlbW92ZUF0dHIoXCJkYXRhLWxhenlcIikucmVtb3ZlQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpfSl9KX0sZC5zcmM9Y30pfXZhciBjLGQsZSxmLGI9dGhpcztiLm9wdGlvbnMuY2VudGVyTW9kZT09PSEwP2Iub3B0aW9ucy5pbmZpbml0ZT09PSEwPyhlPWIuY3VycmVudFNsaWRlKyhiLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIrMSksZj1lK2Iub3B0aW9ucy5zbGlkZXNUb1Nob3crMik6KGU9TWF0aC5tYXgoMCxiLmN1cnJlbnRTbGlkZS0oYi5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKzEpKSxmPTIrKGIub3B0aW9ucy5zbGlkZXNUb1Nob3cvMisxKStiLmN1cnJlbnRTbGlkZSk6KGU9Yi5vcHRpb25zLmluZmluaXRlP2Iub3B0aW9ucy5zbGlkZXNUb1Nob3crYi5jdXJyZW50U2xpZGU6Yi5jdXJyZW50U2xpZGUsZj1lK2Iub3B0aW9ucy5zbGlkZXNUb1Nob3csYi5vcHRpb25zLmZhZGU9PT0hMCYmKGU+MCYmZS0tLGY8PWIuc2xpZGVDb3VudCYmZisrKSksYz1iLiRzbGlkZXIuZmluZChcIi5zbGljay1zbGlkZVwiKS5zbGljZShlLGYpLGcoYyksYi5zbGlkZUNvdW50PD1iLm9wdGlvbnMuc2xpZGVzVG9TaG93PyhkPWIuJHNsaWRlci5maW5kKFwiLnNsaWNrLXNsaWRlXCIpLGcoZCkpOmIuY3VycmVudFNsaWRlPj1iLnNsaWRlQ291bnQtYi5vcHRpb25zLnNsaWRlc1RvU2hvdz8oZD1iLiRzbGlkZXIuZmluZChcIi5zbGljay1jbG9uZWRcIikuc2xpY2UoMCxiLm9wdGlvbnMuc2xpZGVzVG9TaG93KSxnKGQpKTowPT09Yi5jdXJyZW50U2xpZGUmJihkPWIuJHNsaWRlci5maW5kKFwiLnNsaWNrLWNsb25lZFwiKS5zbGljZSgtMSpiLm9wdGlvbnMuc2xpZGVzVG9TaG93KSxnKGQpKX0sYi5wcm90b3R5cGUubG9hZFNsaWRlcj1mdW5jdGlvbigpe3ZhciBhPXRoaXM7YS5zZXRQb3NpdGlvbigpLGEuJHNsaWRlVHJhY2suY3NzKHtvcGFjaXR5OjF9KSxhLiRzbGlkZXIucmVtb3ZlQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpLGEuaW5pdFVJKCksXCJwcm9ncmVzc2l2ZVwiPT09YS5vcHRpb25zLmxhenlMb2FkJiZhLnByb2dyZXNzaXZlTGF6eUxvYWQoKX0sYi5wcm90b3R5cGUubmV4dD1iLnByb3RvdHlwZS5zbGlja05leHQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2EuY2hhbmdlU2xpZGUoe2RhdGE6e21lc3NhZ2U6XCJuZXh0XCJ9fSl9LGIucHJvdG90eXBlLm9yaWVudGF0aW9uQ2hhbmdlPWZ1bmN0aW9uKCl7dmFyIGE9dGhpczthLmNoZWNrUmVzcG9uc2l2ZSgpLGEuc2V0UG9zaXRpb24oKX0sYi5wcm90b3R5cGUucGF1c2U9Yi5wcm90b3R5cGUuc2xpY2tQYXVzZT1mdW5jdGlvbigpe3ZhciBhPXRoaXM7YS5hdXRvUGxheUNsZWFyKCksYS5wYXVzZWQ9ITB9LGIucHJvdG90eXBlLnBsYXk9Yi5wcm90b3R5cGUuc2xpY2tQbGF5PWZ1bmN0aW9uKCl7dmFyIGE9dGhpczthLnBhdXNlZD0hMSxhLmF1dG9QbGF5KCl9LGIucHJvdG90eXBlLnBvc3RTbGlkZT1mdW5jdGlvbihhKXt2YXIgYj10aGlzO2IuJHNsaWRlci50cmlnZ2VyKFwiYWZ0ZXJDaGFuZ2VcIixbYixhXSksYi5hbmltYXRpbmc9ITEsYi5zZXRQb3NpdGlvbigpLGIuc3dpcGVMZWZ0PW51bGwsYi5vcHRpb25zLmF1dG9wbGF5PT09ITAmJmIucGF1c2VkPT09ITEmJmIuYXV0b1BsYXkoKSxiLm9wdGlvbnMuYWNjZXNzaWJpbGl0eT09PSEwJiZiLmluaXRBREEoKX0sYi5wcm90b3R5cGUucHJldj1iLnByb3RvdHlwZS5zbGlja1ByZXY9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2EuY2hhbmdlU2xpZGUoe2RhdGE6e21lc3NhZ2U6XCJwcmV2aW91c1wifX0pfSxiLnByb3RvdHlwZS5wcmV2ZW50RGVmYXVsdD1mdW5jdGlvbihhKXthLnByZXZlbnREZWZhdWx0KCl9LGIucHJvdG90eXBlLnByb2dyZXNzaXZlTGF6eUxvYWQ9ZnVuY3Rpb24oKXt2YXIgYyxkLGI9dGhpcztjPWEoXCJpbWdbZGF0YS1sYXp5XVwiLGIuJHNsaWRlcikubGVuZ3RoLGM+MCYmKGQ9YShcImltZ1tkYXRhLWxhenldXCIsYi4kc2xpZGVyKS5maXJzdCgpLGQuYXR0cihcInNyY1wiLG51bGwpLGQuYXR0cihcInNyY1wiLGQuYXR0cihcImRhdGEtbGF6eVwiKSkucmVtb3ZlQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpLmxvYWQoZnVuY3Rpb24oKXtkLnJlbW92ZUF0dHIoXCJkYXRhLWxhenlcIiksYi5wcm9ncmVzc2l2ZUxhenlMb2FkKCksYi5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0PT09ITAmJmIuc2V0UG9zaXRpb24oKX0pLmVycm9yKGZ1bmN0aW9uKCl7ZC5yZW1vdmVBdHRyKFwiZGF0YS1sYXp5XCIpLGIucHJvZ3Jlc3NpdmVMYXp5TG9hZCgpfSkpfSxiLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKGIpe3ZhciBkLGUsYz10aGlzO2U9Yy5zbGlkZUNvdW50LWMub3B0aW9ucy5zbGlkZXNUb1Nob3csYy5vcHRpb25zLmluZmluaXRlfHwoYy5zbGlkZUNvdW50PD1jLm9wdGlvbnMuc2xpZGVzVG9TaG93P2MuY3VycmVudFNsaWRlPTA6Yy5jdXJyZW50U2xpZGU+ZSYmKGMuY3VycmVudFNsaWRlPWUpKSxkPWMuY3VycmVudFNsaWRlLGMuZGVzdHJveSghMCksYS5leHRlbmQoYyxjLmluaXRpYWxzLHtjdXJyZW50U2xpZGU6ZH0pLGMuaW5pdCgpLGJ8fGMuY2hhbmdlU2xpZGUoe2RhdGE6e21lc3NhZ2U6XCJpbmRleFwiLGluZGV4OmR9fSwhMSl9LGIucHJvdG90eXBlLnJlZ2lzdGVyQnJlYWtwb2ludHM9ZnVuY3Rpb24oKXt2YXIgYyxkLGUsYj10aGlzLGY9Yi5vcHRpb25zLnJlc3BvbnNpdmV8fG51bGw7aWYoXCJhcnJheVwiPT09YS50eXBlKGYpJiZmLmxlbmd0aCl7Yi5yZXNwb25kVG89Yi5vcHRpb25zLnJlc3BvbmRUb3x8XCJ3aW5kb3dcIjtmb3IoYyBpbiBmKWlmKGU9Yi5icmVha3BvaW50cy5sZW5ndGgtMSxkPWZbY10uYnJlYWtwb2ludCxmLmhhc093blByb3BlcnR5KGMpKXtmb3IoO2U+PTA7KWIuYnJlYWtwb2ludHNbZV0mJmIuYnJlYWtwb2ludHNbZV09PT1kJiZiLmJyZWFrcG9pbnRzLnNwbGljZShlLDEpLGUtLTtiLmJyZWFrcG9pbnRzLnB1c2goZCksYi5icmVha3BvaW50U2V0dGluZ3NbZF09ZltjXS5zZXR0aW5nc31iLmJyZWFrcG9pbnRzLnNvcnQoZnVuY3Rpb24oYSxjKXtyZXR1cm4gYi5vcHRpb25zLm1vYmlsZUZpcnN0P2EtYzpjLWF9KX19LGIucHJvdG90eXBlLnJlaW5pdD1mdW5jdGlvbigpe3ZhciBiPXRoaXM7Yi4kc2xpZGVzPWIuJHNsaWRlVHJhY2suY2hpbGRyZW4oYi5vcHRpb25zLnNsaWRlKS5hZGRDbGFzcyhcInNsaWNrLXNsaWRlXCIpLGIuc2xpZGVDb3VudD1iLiRzbGlkZXMubGVuZ3RoLGIuY3VycmVudFNsaWRlPj1iLnNsaWRlQ291bnQmJjAhPT1iLmN1cnJlbnRTbGlkZSYmKGIuY3VycmVudFNsaWRlPWIuY3VycmVudFNsaWRlLWIub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCksYi5zbGlkZUNvdW50PD1iLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoYi5jdXJyZW50U2xpZGU9MCksYi5yZWdpc3RlckJyZWFrcG9pbnRzKCksYi5zZXRQcm9wcygpLGIuc2V0dXBJbmZpbml0ZSgpLGIuYnVpbGRBcnJvd3MoKSxiLnVwZGF0ZUFycm93cygpLGIuaW5pdEFycm93RXZlbnRzKCksYi5idWlsZERvdHMoKSxiLnVwZGF0ZURvdHMoKSxiLmluaXREb3RFdmVudHMoKSxiLmNoZWNrUmVzcG9uc2l2ZSghMSwhMCksYi5vcHRpb25zLmZvY3VzT25TZWxlY3Q9PT0hMCYmYShiLiRzbGlkZVRyYWNrKS5jaGlsZHJlbigpLm9uKFwiY2xpY2suc2xpY2tcIixiLnNlbGVjdEhhbmRsZXIpLGIuc2V0U2xpZGVDbGFzc2VzKDApLGIuc2V0UG9zaXRpb24oKSxiLiRzbGlkZXIudHJpZ2dlcihcInJlSW5pdFwiLFtiXSksYi5vcHRpb25zLmF1dG9wbGF5PT09ITAmJmIuZm9jdXNIYW5kbGVyKCl9LGIucHJvdG90eXBlLnJlc2l6ZT1mdW5jdGlvbigpe3ZhciBiPXRoaXM7YSh3aW5kb3cpLndpZHRoKCkhPT1iLndpbmRvd1dpZHRoJiYoY2xlYXJUaW1lb3V0KGIud2luZG93RGVsYXkpLGIud2luZG93RGVsYXk9d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtiLndpbmRvd1dpZHRoPWEod2luZG93KS53aWR0aCgpLGIuY2hlY2tSZXNwb25zaXZlKCksYi51bnNsaWNrZWR8fGIuc2V0UG9zaXRpb24oKX0sNTApKX0sYi5wcm90b3R5cGUucmVtb3ZlU2xpZGU9Yi5wcm90b3R5cGUuc2xpY2tSZW1vdmU9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPXRoaXM7cmV0dXJuXCJib29sZWFuXCI9PXR5cGVvZiBhPyhiPWEsYT1iPT09ITA/MDpkLnNsaWRlQ291bnQtMSk6YT1iPT09ITA/LS1hOmEsZC5zbGlkZUNvdW50PDF8fDA+YXx8YT5kLnNsaWRlQ291bnQtMT8hMTooZC51bmxvYWQoKSxjPT09ITA/ZC4kc2xpZGVUcmFjay5jaGlsZHJlbigpLnJlbW92ZSgpOmQuJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5lcShhKS5yZW1vdmUoKSxkLiRzbGlkZXM9ZC4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLGQuJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKSxkLiRzbGlkZVRyYWNrLmFwcGVuZChkLiRzbGlkZXMpLGQuJHNsaWRlc0NhY2hlPWQuJHNsaWRlcyx2b2lkIGQucmVpbml0KCkpfSxiLnByb3RvdHlwZS5zZXRDU1M9ZnVuY3Rpb24oYSl7dmFyIGQsZSxiPXRoaXMsYz17fTtiLm9wdGlvbnMucnRsPT09ITAmJihhPS1hKSxkPVwibGVmdFwiPT1iLnBvc2l0aW9uUHJvcD9NYXRoLmNlaWwoYSkrXCJweFwiOlwiMHB4XCIsZT1cInRvcFwiPT1iLnBvc2l0aW9uUHJvcD9NYXRoLmNlaWwoYSkrXCJweFwiOlwiMHB4XCIsY1tiLnBvc2l0aW9uUHJvcF09YSxiLnRyYW5zZm9ybXNFbmFibGVkPT09ITE/Yi4kc2xpZGVUcmFjay5jc3MoYyk6KGM9e30sYi5jc3NUcmFuc2l0aW9ucz09PSExPyhjW2IuYW5pbVR5cGVdPVwidHJhbnNsYXRlKFwiK2QrXCIsIFwiK2UrXCIpXCIsYi4kc2xpZGVUcmFjay5jc3MoYykpOihjW2IuYW5pbVR5cGVdPVwidHJhbnNsYXRlM2QoXCIrZCtcIiwgXCIrZStcIiwgMHB4KVwiLGIuJHNsaWRlVHJhY2suY3NzKGMpKSl9LGIucHJvdG90eXBlLnNldERpbWVuc2lvbnM9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2Eub3B0aW9ucy52ZXJ0aWNhbD09PSExP2Eub3B0aW9ucy5jZW50ZXJNb2RlPT09ITAmJmEuJGxpc3QuY3NzKHtwYWRkaW5nOlwiMHB4IFwiK2Eub3B0aW9ucy5jZW50ZXJQYWRkaW5nfSk6KGEuJGxpc3QuaGVpZ2h0KGEuJHNsaWRlcy5maXJzdCgpLm91dGVySGVpZ2h0KCEwKSphLm9wdGlvbnMuc2xpZGVzVG9TaG93KSxhLm9wdGlvbnMuY2VudGVyTW9kZT09PSEwJiZhLiRsaXN0LmNzcyh7cGFkZGluZzphLm9wdGlvbnMuY2VudGVyUGFkZGluZytcIiAwcHhcIn0pKSxhLmxpc3RXaWR0aD1hLiRsaXN0LndpZHRoKCksYS5saXN0SGVpZ2h0PWEuJGxpc3QuaGVpZ2h0KCksYS5vcHRpb25zLnZlcnRpY2FsPT09ITEmJmEub3B0aW9ucy52YXJpYWJsZVdpZHRoPT09ITE/KGEuc2xpZGVXaWR0aD1NYXRoLmNlaWwoYS5saXN0V2lkdGgvYS5vcHRpb25zLnNsaWRlc1RvU2hvdyksYS4kc2xpZGVUcmFjay53aWR0aChNYXRoLmNlaWwoYS5zbGlkZVdpZHRoKmEuJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikubGVuZ3RoKSkpOmEub3B0aW9ucy52YXJpYWJsZVdpZHRoPT09ITA/YS4kc2xpZGVUcmFjay53aWR0aCg1ZTMqYS5zbGlkZUNvdW50KTooYS5zbGlkZVdpZHRoPU1hdGguY2VpbChhLmxpc3RXaWR0aCksYS4kc2xpZGVUcmFjay5oZWlnaHQoTWF0aC5jZWlsKGEuJHNsaWRlcy5maXJzdCgpLm91dGVySGVpZ2h0KCEwKSphLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLmxlbmd0aCkpKTt2YXIgYj1hLiRzbGlkZXMuZmlyc3QoKS5vdXRlcldpZHRoKCEwKS1hLiRzbGlkZXMuZmlyc3QoKS53aWR0aCgpO2Eub3B0aW9ucy52YXJpYWJsZVdpZHRoPT09ITEmJmEuJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikud2lkdGgoYS5zbGlkZVdpZHRoLWIpfSxiLnByb3RvdHlwZS5zZXRGYWRlPWZ1bmN0aW9uKCl7dmFyIGMsYj10aGlzO2IuJHNsaWRlcy5lYWNoKGZ1bmN0aW9uKGQsZSl7Yz1iLnNsaWRlV2lkdGgqZCotMSxiLm9wdGlvbnMucnRsPT09ITA/YShlKS5jc3Moe3Bvc2l0aW9uOlwicmVsYXRpdmVcIixyaWdodDpjLHRvcDowLHpJbmRleDpiLm9wdGlvbnMuekluZGV4LTIsb3BhY2l0eTowfSk6YShlKS5jc3Moe3Bvc2l0aW9uOlwicmVsYXRpdmVcIixsZWZ0OmMsdG9wOjAsekluZGV4OmIub3B0aW9ucy56SW5kZXgtMixvcGFjaXR5OjB9KX0pLGIuJHNsaWRlcy5lcShiLmN1cnJlbnRTbGlkZSkuY3NzKHt6SW5kZXg6Yi5vcHRpb25zLnpJbmRleC0xLG9wYWNpdHk6MX0pfSxiLnByb3RvdHlwZS5zZXRIZWlnaHQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2lmKDE9PT1hLm9wdGlvbnMuc2xpZGVzVG9TaG93JiZhLm9wdGlvbnMuYWRhcHRpdmVIZWlnaHQ9PT0hMCYmYS5vcHRpb25zLnZlcnRpY2FsPT09ITEpe3ZhciBiPWEuJHNsaWRlcy5lcShhLmN1cnJlbnRTbGlkZSkub3V0ZXJIZWlnaHQoITApO2EuJGxpc3QuY3NzKFwiaGVpZ2h0XCIsYil9fSxiLnByb3RvdHlwZS5zZXRPcHRpb249Yi5wcm90b3R5cGUuc2xpY2tTZXRPcHRpb249ZnVuY3Rpb24oYixjLGQpe3ZhciBmLGcsZT10aGlzO2lmKFwicmVzcG9uc2l2ZVwiPT09YiYmXCJhcnJheVwiPT09YS50eXBlKGMpKWZvcihnIGluIGMpaWYoXCJhcnJheVwiIT09YS50eXBlKGUub3B0aW9ucy5yZXNwb25zaXZlKSllLm9wdGlvbnMucmVzcG9uc2l2ZT1bY1tnXV07ZWxzZXtmb3IoZj1lLm9wdGlvbnMucmVzcG9uc2l2ZS5sZW5ndGgtMTtmPj0wOyllLm9wdGlvbnMucmVzcG9uc2l2ZVtmXS5icmVha3BvaW50PT09Y1tnXS5icmVha3BvaW50JiZlLm9wdGlvbnMucmVzcG9uc2l2ZS5zcGxpY2UoZiwxKSxmLS07ZS5vcHRpb25zLnJlc3BvbnNpdmUucHVzaChjW2ddKX1lbHNlIGUub3B0aW9uc1tiXT1jO2Q9PT0hMCYmKGUudW5sb2FkKCksZS5yZWluaXQoKSl9LGIucHJvdG90eXBlLnNldFBvc2l0aW9uPWZ1bmN0aW9uKCl7dmFyIGE9dGhpczthLnNldERpbWVuc2lvbnMoKSxhLnNldEhlaWdodCgpLGEub3B0aW9ucy5mYWRlPT09ITE/YS5zZXRDU1MoYS5nZXRMZWZ0KGEuY3VycmVudFNsaWRlKSk6YS5zZXRGYWRlKCksYS4kc2xpZGVyLnRyaWdnZXIoXCJzZXRQb3NpdGlvblwiLFthXSl9LGIucHJvdG90eXBlLnNldFByb3BzPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcyxiPWRvY3VtZW50LmJvZHkuc3R5bGU7YS5wb3NpdGlvblByb3A9YS5vcHRpb25zLnZlcnRpY2FsPT09ITA/XCJ0b3BcIjpcImxlZnRcIixcInRvcFwiPT09YS5wb3NpdGlvblByb3A/YS4kc2xpZGVyLmFkZENsYXNzKFwic2xpY2stdmVydGljYWxcIik6YS4kc2xpZGVyLnJlbW92ZUNsYXNzKFwic2xpY2stdmVydGljYWxcIiksKHZvaWQgMCE9PWIuV2Via2l0VHJhbnNpdGlvbnx8dm9pZCAwIT09Yi5Nb3pUcmFuc2l0aW9ufHx2b2lkIDAhPT1iLm1zVHJhbnNpdGlvbikmJmEub3B0aW9ucy51c2VDU1M9PT0hMCYmKGEuY3NzVHJhbnNpdGlvbnM9ITApLGEub3B0aW9ucy5mYWRlJiYoXCJudW1iZXJcIj09dHlwZW9mIGEub3B0aW9ucy56SW5kZXg/YS5vcHRpb25zLnpJbmRleDwzJiYoYS5vcHRpb25zLnpJbmRleD0zKTphLm9wdGlvbnMuekluZGV4PWEuZGVmYXVsdHMuekluZGV4KSx2b2lkIDAhPT1iLk9UcmFuc2Zvcm0mJihhLmFuaW1UeXBlPVwiT1RyYW5zZm9ybVwiLGEudHJhbnNmb3JtVHlwZT1cIi1vLXRyYW5zZm9ybVwiLGEudHJhbnNpdGlvblR5cGU9XCJPVHJhbnNpdGlvblwiLHZvaWQgMD09PWIucGVyc3BlY3RpdmVQcm9wZXJ0eSYmdm9pZCAwPT09Yi53ZWJraXRQZXJzcGVjdGl2ZSYmKGEuYW5pbVR5cGU9ITEpKSx2b2lkIDAhPT1iLk1velRyYW5zZm9ybSYmKGEuYW5pbVR5cGU9XCJNb3pUcmFuc2Zvcm1cIixhLnRyYW5zZm9ybVR5cGU9XCItbW96LXRyYW5zZm9ybVwiLGEudHJhbnNpdGlvblR5cGU9XCJNb3pUcmFuc2l0aW9uXCIsdm9pZCAwPT09Yi5wZXJzcGVjdGl2ZVByb3BlcnR5JiZ2b2lkIDA9PT1iLk1velBlcnNwZWN0aXZlJiYoYS5hbmltVHlwZT0hMSkpLHZvaWQgMCE9PWIud2Via2l0VHJhbnNmb3JtJiYoYS5hbmltVHlwZT1cIndlYmtpdFRyYW5zZm9ybVwiLGEudHJhbnNmb3JtVHlwZT1cIi13ZWJraXQtdHJhbnNmb3JtXCIsYS50cmFuc2l0aW9uVHlwZT1cIndlYmtpdFRyYW5zaXRpb25cIix2b2lkIDA9PT1iLnBlcnNwZWN0aXZlUHJvcGVydHkmJnZvaWQgMD09PWIud2Via2l0UGVyc3BlY3RpdmUmJihhLmFuaW1UeXBlPSExKSksdm9pZCAwIT09Yi5tc1RyYW5zZm9ybSYmKGEuYW5pbVR5cGU9XCJtc1RyYW5zZm9ybVwiLGEudHJhbnNmb3JtVHlwZT1cIi1tcy10cmFuc2Zvcm1cIixhLnRyYW5zaXRpb25UeXBlPVwibXNUcmFuc2l0aW9uXCIsdm9pZCAwPT09Yi5tc1RyYW5zZm9ybSYmKGEuYW5pbVR5cGU9ITEpKSx2b2lkIDAhPT1iLnRyYW5zZm9ybSYmYS5hbmltVHlwZSE9PSExJiYoYS5hbmltVHlwZT1cInRyYW5zZm9ybVwiLGEudHJhbnNmb3JtVHlwZT1cInRyYW5zZm9ybVwiLGEudHJhbnNpdGlvblR5cGU9XCJ0cmFuc2l0aW9uXCIpLGEudHJhbnNmb3Jtc0VuYWJsZWQ9YS5vcHRpb25zLnVzZVRyYW5zZm9ybSYmbnVsbCE9PWEuYW5pbVR5cGUmJmEuYW5pbVR5cGUhPT0hMX0sYi5wcm90b3R5cGUuc2V0U2xpZGVDbGFzc2VzPWZ1bmN0aW9uKGEpe3ZhciBjLGQsZSxmLGI9dGhpcztkPWIuJHNsaWRlci5maW5kKFwiLnNsaWNrLXNsaWRlXCIpLnJlbW92ZUNsYXNzKFwic2xpY2stYWN0aXZlIHNsaWNrLWNlbnRlciBzbGljay1jdXJyZW50XCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKSxiLiRzbGlkZXMuZXEoYSkuYWRkQ2xhc3MoXCJzbGljay1jdXJyZW50XCIpLGIub3B0aW9ucy5jZW50ZXJNb2RlPT09ITA/KGM9TWF0aC5mbG9vcihiLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIpLGIub3B0aW9ucy5pbmZpbml0ZT09PSEwJiYoYT49YyYmYTw9Yi5zbGlkZUNvdW50LTEtYz9iLiRzbGlkZXMuc2xpY2UoYS1jLGErYysxKS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpOihlPWIub3B0aW9ucy5zbGlkZXNUb1Nob3crYSxkLnNsaWNlKGUtYysxLGUrYysyKS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpKSwwPT09YT9kLmVxKGQubGVuZ3RoLTEtYi5vcHRpb25zLnNsaWRlc1RvU2hvdykuYWRkQ2xhc3MoXCJzbGljay1jZW50ZXJcIik6YT09PWIuc2xpZGVDb3VudC0xJiZkLmVxKGIub3B0aW9ucy5zbGlkZXNUb1Nob3cpLmFkZENsYXNzKFwic2xpY2stY2VudGVyXCIpKSxiLiRzbGlkZXMuZXEoYSkuYWRkQ2xhc3MoXCJzbGljay1jZW50ZXJcIikpOmE+PTAmJmE8PWIuc2xpZGVDb3VudC1iLm9wdGlvbnMuc2xpZGVzVG9TaG93P2IuJHNsaWRlcy5zbGljZShhLGErYi5vcHRpb25zLnNsaWRlc1RvU2hvdykuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKTpkLmxlbmd0aDw9Yi5vcHRpb25zLnNsaWRlc1RvU2hvdz9kLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIik6KGY9Yi5zbGlkZUNvdW50JWIub3B0aW9ucy5zbGlkZXNUb1Nob3csZT1iLm9wdGlvbnMuaW5maW5pdGU9PT0hMD9iLm9wdGlvbnMuc2xpZGVzVG9TaG93K2E6YSxiLm9wdGlvbnMuc2xpZGVzVG9TaG93PT1iLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwmJmIuc2xpZGVDb3VudC1hPGIub3B0aW9ucy5zbGlkZXNUb1Nob3c/ZC5zbGljZShlLShiLm9wdGlvbnMuc2xpZGVzVG9TaG93LWYpLGUrZikuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKTpkLnNsaWNlKGUsZStiLm9wdGlvbnMuc2xpZGVzVG9TaG93KS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpKSxcIm9uZGVtYW5kXCI9PT1iLm9wdGlvbnMubGF6eUxvYWQmJmIubGF6eUxvYWQoKX0sYi5wcm90b3R5cGUuc2V0dXBJbmZpbml0ZT1mdW5jdGlvbigpe3ZhciBjLGQsZSxiPXRoaXM7aWYoYi5vcHRpb25zLmZhZGU9PT0hMCYmKGIub3B0aW9ucy5jZW50ZXJNb2RlPSExKSxiLm9wdGlvbnMuaW5maW5pdGU9PT0hMCYmYi5vcHRpb25zLmZhZGU9PT0hMSYmKGQ9bnVsbCxiLnNsaWRlQ291bnQ+Yi5vcHRpb25zLnNsaWRlc1RvU2hvdykpe2ZvcihlPWIub3B0aW9ucy5jZW50ZXJNb2RlPT09ITA/Yi5vcHRpb25zLnNsaWRlc1RvU2hvdysxOmIub3B0aW9ucy5zbGlkZXNUb1Nob3csYz1iLnNsaWRlQ291bnQ7Yz5iLnNsaWRlQ291bnQtZTtjLT0xKWQ9Yy0xLGEoYi4kc2xpZGVzW2RdKS5jbG9uZSghMCkuYXR0cihcImlkXCIsXCJcIikuYXR0cihcImRhdGEtc2xpY2staW5kZXhcIixkLWIuc2xpZGVDb3VudCkucHJlcGVuZFRvKGIuJHNsaWRlVHJhY2spLmFkZENsYXNzKFwic2xpY2stY2xvbmVkXCIpO2ZvcihjPTA7ZT5jO2MrPTEpZD1jLGEoYi4kc2xpZGVzW2RdKS5jbG9uZSghMCkuYXR0cihcImlkXCIsXCJcIikuYXR0cihcImRhdGEtc2xpY2staW5kZXhcIixkK2Iuc2xpZGVDb3VudCkuYXBwZW5kVG8oYi4kc2xpZGVUcmFjaykuYWRkQ2xhc3MoXCJzbGljay1jbG9uZWRcIik7Yi4kc2xpZGVUcmFjay5maW5kKFwiLnNsaWNrLWNsb25lZFwiKS5maW5kKFwiW2lkXVwiKS5lYWNoKGZ1bmN0aW9uKCl7YSh0aGlzKS5hdHRyKFwiaWRcIixcIlwiKX0pfX0sYi5wcm90b3R5cGUuc2V0UGF1c2VkPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7Yi5vcHRpb25zLmF1dG9wbGF5PT09ITAmJmIub3B0aW9ucy5wYXVzZU9uSG92ZXI9PT0hMCYmKGIucGF1c2VkPWEsYT9iLmF1dG9QbGF5Q2xlYXIoKTpiLmF1dG9QbGF5KCkpfSxiLnByb3RvdHlwZS5zZWxlY3RIYW5kbGVyPWZ1bmN0aW9uKGIpe3ZhciBjPXRoaXMsZD1hKGIudGFyZ2V0KS5pcyhcIi5zbGljay1zbGlkZVwiKT9hKGIudGFyZ2V0KTphKGIudGFyZ2V0KS5wYXJlbnRzKFwiLnNsaWNrLXNsaWRlXCIpLGU9cGFyc2VJbnQoZC5hdHRyKFwiZGF0YS1zbGljay1pbmRleFwiKSk7cmV0dXJuIGV8fChlPTApLGMuc2xpZGVDb3VudDw9Yy5vcHRpb25zLnNsaWRlc1RvU2hvdz8oYy5zZXRTbGlkZUNsYXNzZXMoZSksdm9pZCBjLmFzTmF2Rm9yKGUpKTp2b2lkIGMuc2xpZGVIYW5kbGVyKGUpfSxiLnByb3RvdHlwZS5zbGlkZUhhbmRsZXI9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGUsZixnLGg9bnVsbCxpPXRoaXM7cmV0dXJuIGI9Ynx8ITEsaS5hbmltYXRpbmc9PT0hMCYmaS5vcHRpb25zLndhaXRGb3JBbmltYXRlPT09ITB8fGkub3B0aW9ucy5mYWRlPT09ITAmJmkuY3VycmVudFNsaWRlPT09YXx8aS5zbGlkZUNvdW50PD1pLm9wdGlvbnMuc2xpZGVzVG9TaG93P3ZvaWQgMDooYj09PSExJiZpLmFzTmF2Rm9yKGEpLGQ9YSxoPWkuZ2V0TGVmdChkKSxnPWkuZ2V0TGVmdChpLmN1cnJlbnRTbGlkZSksaS5jdXJyZW50TGVmdD1udWxsPT09aS5zd2lwZUxlZnQ/ZzppLnN3aXBlTGVmdCxpLm9wdGlvbnMuaW5maW5pdGU9PT0hMSYmaS5vcHRpb25zLmNlbnRlck1vZGU9PT0hMSYmKDA+YXx8YT5pLmdldERvdENvdW50KCkqaS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKT92b2lkKGkub3B0aW9ucy5mYWRlPT09ITEmJihkPWkuY3VycmVudFNsaWRlLGMhPT0hMD9pLmFuaW1hdGVTbGlkZShnLGZ1bmN0aW9uKCl7aS5wb3N0U2xpZGUoZCk7XG59KTppLnBvc3RTbGlkZShkKSkpOmkub3B0aW9ucy5pbmZpbml0ZT09PSExJiZpLm9wdGlvbnMuY2VudGVyTW9kZT09PSEwJiYoMD5hfHxhPmkuc2xpZGVDb3VudC1pLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpP3ZvaWQoaS5vcHRpb25zLmZhZGU9PT0hMSYmKGQ9aS5jdXJyZW50U2xpZGUsYyE9PSEwP2kuYW5pbWF0ZVNsaWRlKGcsZnVuY3Rpb24oKXtpLnBvc3RTbGlkZShkKX0pOmkucG9zdFNsaWRlKGQpKSk6KGkub3B0aW9ucy5hdXRvcGxheT09PSEwJiZjbGVhckludGVydmFsKGkuYXV0b1BsYXlUaW1lciksZT0wPmQ/aS5zbGlkZUNvdW50JWkub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCE9PTA/aS5zbGlkZUNvdW50LWkuc2xpZGVDb3VudCVpLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw6aS5zbGlkZUNvdW50K2Q6ZD49aS5zbGlkZUNvdW50P2kuc2xpZGVDb3VudCVpLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwhPT0wPzA6ZC1pLnNsaWRlQ291bnQ6ZCxpLmFuaW1hdGluZz0hMCxpLiRzbGlkZXIudHJpZ2dlcihcImJlZm9yZUNoYW5nZVwiLFtpLGkuY3VycmVudFNsaWRlLGVdKSxmPWkuY3VycmVudFNsaWRlLGkuY3VycmVudFNsaWRlPWUsaS5zZXRTbGlkZUNsYXNzZXMoaS5jdXJyZW50U2xpZGUpLGkudXBkYXRlRG90cygpLGkudXBkYXRlQXJyb3dzKCksaS5vcHRpb25zLmZhZGU9PT0hMD8oYyE9PSEwPyhpLmZhZGVTbGlkZU91dChmKSxpLmZhZGVTbGlkZShlLGZ1bmN0aW9uKCl7aS5wb3N0U2xpZGUoZSl9KSk6aS5wb3N0U2xpZGUoZSksdm9pZCBpLmFuaW1hdGVIZWlnaHQoKSk6dm9pZChjIT09ITA/aS5hbmltYXRlU2xpZGUoaCxmdW5jdGlvbigpe2kucG9zdFNsaWRlKGUpfSk6aS5wb3N0U2xpZGUoZSkpKSl9LGIucHJvdG90eXBlLnN0YXJ0TG9hZD1mdW5jdGlvbigpe3ZhciBhPXRoaXM7YS5vcHRpb25zLmFycm93cz09PSEwJiZhLnNsaWRlQ291bnQ+YS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKGEuJHByZXZBcnJvdy5oaWRlKCksYS4kbmV4dEFycm93LmhpZGUoKSksYS5vcHRpb25zLmRvdHM9PT0hMCYmYS5zbGlkZUNvdW50PmEub3B0aW9ucy5zbGlkZXNUb1Nob3cmJmEuJGRvdHMuaGlkZSgpLGEuJHNsaWRlci5hZGRDbGFzcyhcInNsaWNrLWxvYWRpbmdcIil9LGIucHJvdG90eXBlLnN3aXBlRGlyZWN0aW9uPWZ1bmN0aW9uKCl7dmFyIGEsYixjLGQsZT10aGlzO3JldHVybiBhPWUudG91Y2hPYmplY3Quc3RhcnRYLWUudG91Y2hPYmplY3QuY3VyWCxiPWUudG91Y2hPYmplY3Quc3RhcnRZLWUudG91Y2hPYmplY3QuY3VyWSxjPU1hdGguYXRhbjIoYixhKSxkPU1hdGgucm91bmQoMTgwKmMvTWF0aC5QSSksMD5kJiYoZD0zNjAtTWF0aC5hYnMoZCkpLDQ1Pj1kJiZkPj0wP2Uub3B0aW9ucy5ydGw9PT0hMT9cImxlZnRcIjpcInJpZ2h0XCI6MzYwPj1kJiZkPj0zMTU/ZS5vcHRpb25zLnJ0bD09PSExP1wibGVmdFwiOlwicmlnaHRcIjpkPj0xMzUmJjIyNT49ZD9lLm9wdGlvbnMucnRsPT09ITE/XCJyaWdodFwiOlwibGVmdFwiOmUub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmc9PT0hMD9kPj0zNSYmMTM1Pj1kP1wibGVmdFwiOlwicmlnaHRcIjpcInZlcnRpY2FsXCJ9LGIucHJvdG90eXBlLnN3aXBlRW5kPWZ1bmN0aW9uKGEpe3ZhciBjLGI9dGhpcztpZihiLmRyYWdnaW5nPSExLGIuc2hvdWxkQ2xpY2s9Yi50b3VjaE9iamVjdC5zd2lwZUxlbmd0aD4xMD8hMTohMCx2b2lkIDA9PT1iLnRvdWNoT2JqZWN0LmN1clgpcmV0dXJuITE7aWYoYi50b3VjaE9iamVjdC5lZGdlSGl0PT09ITAmJmIuJHNsaWRlci50cmlnZ2VyKFwiZWRnZVwiLFtiLGIuc3dpcGVEaXJlY3Rpb24oKV0pLGIudG91Y2hPYmplY3Quc3dpcGVMZW5ndGg+PWIudG91Y2hPYmplY3QubWluU3dpcGUpc3dpdGNoKGIuc3dpcGVEaXJlY3Rpb24oKSl7Y2FzZVwibGVmdFwiOmM9Yi5vcHRpb25zLnN3aXBlVG9TbGlkZT9iLmNoZWNrTmF2aWdhYmxlKGIuY3VycmVudFNsaWRlK2IuZ2V0U2xpZGVDb3VudCgpKTpiLmN1cnJlbnRTbGlkZStiLmdldFNsaWRlQ291bnQoKSxiLnNsaWRlSGFuZGxlcihjKSxiLmN1cnJlbnREaXJlY3Rpb249MCxiLnRvdWNoT2JqZWN0PXt9LGIuJHNsaWRlci50cmlnZ2VyKFwic3dpcGVcIixbYixcImxlZnRcIl0pO2JyZWFrO2Nhc2VcInJpZ2h0XCI6Yz1iLm9wdGlvbnMuc3dpcGVUb1NsaWRlP2IuY2hlY2tOYXZpZ2FibGUoYi5jdXJyZW50U2xpZGUtYi5nZXRTbGlkZUNvdW50KCkpOmIuY3VycmVudFNsaWRlLWIuZ2V0U2xpZGVDb3VudCgpLGIuc2xpZGVIYW5kbGVyKGMpLGIuY3VycmVudERpcmVjdGlvbj0xLGIudG91Y2hPYmplY3Q9e30sYi4kc2xpZGVyLnRyaWdnZXIoXCJzd2lwZVwiLFtiLFwicmlnaHRcIl0pfWVsc2UgYi50b3VjaE9iamVjdC5zdGFydFghPT1iLnRvdWNoT2JqZWN0LmN1clgmJihiLnNsaWRlSGFuZGxlcihiLmN1cnJlbnRTbGlkZSksYi50b3VjaE9iamVjdD17fSl9LGIucHJvdG90eXBlLnN3aXBlSGFuZGxlcj1mdW5jdGlvbihhKXt2YXIgYj10aGlzO2lmKCEoYi5vcHRpb25zLnN3aXBlPT09ITF8fFwib250b3VjaGVuZFwiaW4gZG9jdW1lbnQmJmIub3B0aW9ucy5zd2lwZT09PSExfHxiLm9wdGlvbnMuZHJhZ2dhYmxlPT09ITEmJi0xIT09YS50eXBlLmluZGV4T2YoXCJtb3VzZVwiKSkpc3dpdGNoKGIudG91Y2hPYmplY3QuZmluZ2VyQ291bnQ9YS5vcmlnaW5hbEV2ZW50JiZ2b2lkIDAhPT1hLm9yaWdpbmFsRXZlbnQudG91Y2hlcz9hLm9yaWdpbmFsRXZlbnQudG91Y2hlcy5sZW5ndGg6MSxiLnRvdWNoT2JqZWN0Lm1pblN3aXBlPWIubGlzdFdpZHRoL2Iub3B0aW9ucy50b3VjaFRocmVzaG9sZCxiLm9wdGlvbnMudmVydGljYWxTd2lwaW5nPT09ITAmJihiLnRvdWNoT2JqZWN0Lm1pblN3aXBlPWIubGlzdEhlaWdodC9iLm9wdGlvbnMudG91Y2hUaHJlc2hvbGQpLGEuZGF0YS5hY3Rpb24pe2Nhc2VcInN0YXJ0XCI6Yi5zd2lwZVN0YXJ0KGEpO2JyZWFrO2Nhc2VcIm1vdmVcIjpiLnN3aXBlTW92ZShhKTticmVhaztjYXNlXCJlbmRcIjpiLnN3aXBlRW5kKGEpfX0sYi5wcm90b3R5cGUuc3dpcGVNb3ZlPWZ1bmN0aW9uKGEpe3ZhciBkLGUsZixnLGgsYj10aGlzO3JldHVybiBoPXZvaWQgMCE9PWEub3JpZ2luYWxFdmVudD9hLm9yaWdpbmFsRXZlbnQudG91Y2hlczpudWxsLCFiLmRyYWdnaW5nfHxoJiYxIT09aC5sZW5ndGg/ITE6KGQ9Yi5nZXRMZWZ0KGIuY3VycmVudFNsaWRlKSxiLnRvdWNoT2JqZWN0LmN1clg9dm9pZCAwIT09aD9oWzBdLnBhZ2VYOmEuY2xpZW50WCxiLnRvdWNoT2JqZWN0LmN1clk9dm9pZCAwIT09aD9oWzBdLnBhZ2VZOmEuY2xpZW50WSxiLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoPU1hdGgucm91bmQoTWF0aC5zcXJ0KE1hdGgucG93KGIudG91Y2hPYmplY3QuY3VyWC1iLnRvdWNoT2JqZWN0LnN0YXJ0WCwyKSkpLGIub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmc9PT0hMCYmKGIudG91Y2hPYmplY3Quc3dpcGVMZW5ndGg9TWF0aC5yb3VuZChNYXRoLnNxcnQoTWF0aC5wb3coYi50b3VjaE9iamVjdC5jdXJZLWIudG91Y2hPYmplY3Quc3RhcnRZLDIpKSkpLGU9Yi5zd2lwZURpcmVjdGlvbigpLFwidmVydGljYWxcIiE9PWU/KHZvaWQgMCE9PWEub3JpZ2luYWxFdmVudCYmYi50b3VjaE9iamVjdC5zd2lwZUxlbmd0aD40JiZhLnByZXZlbnREZWZhdWx0KCksZz0oYi5vcHRpb25zLnJ0bD09PSExPzE6LTEpKihiLnRvdWNoT2JqZWN0LmN1clg+Yi50b3VjaE9iamVjdC5zdGFydFg/MTotMSksYi5vcHRpb25zLnZlcnRpY2FsU3dpcGluZz09PSEwJiYoZz1iLnRvdWNoT2JqZWN0LmN1clk+Yi50b3VjaE9iamVjdC5zdGFydFk/MTotMSksZj1iLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoLGIudG91Y2hPYmplY3QuZWRnZUhpdD0hMSxiLm9wdGlvbnMuaW5maW5pdGU9PT0hMSYmKDA9PT1iLmN1cnJlbnRTbGlkZSYmXCJyaWdodFwiPT09ZXx8Yi5jdXJyZW50U2xpZGU+PWIuZ2V0RG90Q291bnQoKSYmXCJsZWZ0XCI9PT1lKSYmKGY9Yi50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCpiLm9wdGlvbnMuZWRnZUZyaWN0aW9uLGIudG91Y2hPYmplY3QuZWRnZUhpdD0hMCksYi5vcHRpb25zLnZlcnRpY2FsPT09ITE/Yi5zd2lwZUxlZnQ9ZCtmKmc6Yi5zd2lwZUxlZnQ9ZCtmKihiLiRsaXN0LmhlaWdodCgpL2IubGlzdFdpZHRoKSpnLGIub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmc9PT0hMCYmKGIuc3dpcGVMZWZ0PWQrZipnKSxiLm9wdGlvbnMuZmFkZT09PSEwfHxiLm9wdGlvbnMudG91Y2hNb3ZlPT09ITE/ITE6Yi5hbmltYXRpbmc9PT0hMD8oYi5zd2lwZUxlZnQ9bnVsbCwhMSk6dm9pZCBiLnNldENTUyhiLnN3aXBlTGVmdCkpOnZvaWQgMCl9LGIucHJvdG90eXBlLnN3aXBlU3RhcnQ9ZnVuY3Rpb24oYSl7dmFyIGMsYj10aGlzO3JldHVybiAxIT09Yi50b3VjaE9iamVjdC5maW5nZXJDb3VudHx8Yi5zbGlkZUNvdW50PD1iLm9wdGlvbnMuc2xpZGVzVG9TaG93PyhiLnRvdWNoT2JqZWN0PXt9LCExKToodm9pZCAwIT09YS5vcmlnaW5hbEV2ZW50JiZ2b2lkIDAhPT1hLm9yaWdpbmFsRXZlbnQudG91Y2hlcyYmKGM9YS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0pLGIudG91Y2hPYmplY3Quc3RhcnRYPWIudG91Y2hPYmplY3QuY3VyWD12b2lkIDAhPT1jP2MucGFnZVg6YS5jbGllbnRYLGIudG91Y2hPYmplY3Quc3RhcnRZPWIudG91Y2hPYmplY3QuY3VyWT12b2lkIDAhPT1jP2MucGFnZVk6YS5jbGllbnRZLHZvaWQoYi5kcmFnZ2luZz0hMCkpfSxiLnByb3RvdHlwZS51bmZpbHRlclNsaWRlcz1iLnByb3RvdHlwZS5zbGlja1VuZmlsdGVyPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcztudWxsIT09YS4kc2xpZGVzQ2FjaGUmJihhLnVubG9hZCgpLGEuJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKSxhLiRzbGlkZXNDYWNoZS5hcHBlbmRUbyhhLiRzbGlkZVRyYWNrKSxhLnJlaW5pdCgpKX0sYi5wcm90b3R5cGUudW5sb2FkPWZ1bmN0aW9uKCl7dmFyIGI9dGhpczthKFwiLnNsaWNrLWNsb25lZFwiLGIuJHNsaWRlcikucmVtb3ZlKCksYi4kZG90cyYmYi4kZG90cy5yZW1vdmUoKSxiLiRwcmV2QXJyb3cmJmIuaHRtbEV4cHIudGVzdChiLm9wdGlvbnMucHJldkFycm93KSYmYi4kcHJldkFycm93LnJlbW92ZSgpLGIuJG5leHRBcnJvdyYmYi5odG1sRXhwci50ZXN0KGIub3B0aW9ucy5uZXh0QXJyb3cpJiZiLiRuZXh0QXJyb3cucmVtb3ZlKCksYi4kc2xpZGVzLnJlbW92ZUNsYXNzKFwic2xpY2stc2xpZGUgc2xpY2stYWN0aXZlIHNsaWNrLXZpc2libGUgc2xpY2stY3VycmVudFwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIikuY3NzKFwid2lkdGhcIixcIlwiKX0sYi5wcm90b3R5cGUudW5zbGljaz1mdW5jdGlvbihhKXt2YXIgYj10aGlzO2IuJHNsaWRlci50cmlnZ2VyKFwidW5zbGlja1wiLFtiLGFdKSxiLmRlc3Ryb3koKX0sYi5wcm90b3R5cGUudXBkYXRlQXJyb3dzPWZ1bmN0aW9uKCl7dmFyIGIsYT10aGlzO2I9TWF0aC5mbG9vcihhLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIpLGEub3B0aW9ucy5hcnJvd3M9PT0hMCYmYS5zbGlkZUNvdW50PmEub3B0aW9ucy5zbGlkZXNUb1Nob3cmJiFhLm9wdGlvbnMuaW5maW5pdGUmJihhLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwiZmFsc2VcIiksYS4kbmV4dEFycm93LnJlbW92ZUNsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcImZhbHNlXCIpLDA9PT1hLmN1cnJlbnRTbGlkZT8oYS4kcHJldkFycm93LmFkZENsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcInRydWVcIiksYS4kbmV4dEFycm93LnJlbW92ZUNsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcImZhbHNlXCIpKTphLmN1cnJlbnRTbGlkZT49YS5zbGlkZUNvdW50LWEub3B0aW9ucy5zbGlkZXNUb1Nob3cmJmEub3B0aW9ucy5jZW50ZXJNb2RlPT09ITE/KGEuJG5leHRBcnJvdy5hZGRDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJ0cnVlXCIpLGEuJHByZXZBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJmYWxzZVwiKSk6YS5jdXJyZW50U2xpZGU+PWEuc2xpZGVDb3VudC0xJiZhLm9wdGlvbnMuY2VudGVyTW9kZT09PSEwJiYoYS4kbmV4dEFycm93LmFkZENsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcInRydWVcIiksYS4kcHJldkFycm93LnJlbW92ZUNsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcImZhbHNlXCIpKSl9LGIucHJvdG90eXBlLnVwZGF0ZURvdHM9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO251bGwhPT1hLiRkb3RzJiYoYS4kZG90cy5maW5kKFwibGlcIikucmVtb3ZlQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpLGEuJGRvdHMuZmluZChcImxpXCIpLmVxKE1hdGguZmxvb3IoYS5jdXJyZW50U2xpZGUvYS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSkuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKSl9LGIucHJvdG90eXBlLnZpc2liaWxpdHk9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2RvY3VtZW50W2EuaGlkZGVuXT8oYS5wYXVzZWQ9ITAsYS5hdXRvUGxheUNsZWFyKCkpOmEub3B0aW9ucy5hdXRvcGxheT09PSEwJiYoYS5wYXVzZWQ9ITEsYS5hdXRvUGxheSgpKX0sYi5wcm90b3R5cGUuaW5pdEFEQT1mdW5jdGlvbigpe3ZhciBiPXRoaXM7Yi4kc2xpZGVzLmFkZChiLiRzbGlkZVRyYWNrLmZpbmQoXCIuc2xpY2stY2xvbmVkXCIpKS5hdHRyKHtcImFyaWEtaGlkZGVuXCI6XCJ0cnVlXCIsdGFiaW5kZXg6XCItMVwifSkuZmluZChcImEsIGlucHV0LCBidXR0b24sIHNlbGVjdFwiKS5hdHRyKHt0YWJpbmRleDpcIi0xXCJ9KSxiLiRzbGlkZVRyYWNrLmF0dHIoXCJyb2xlXCIsXCJsaXN0Ym94XCIpLGIuJHNsaWRlcy5ub3QoYi4kc2xpZGVUcmFjay5maW5kKFwiLnNsaWNrLWNsb25lZFwiKSkuZWFjaChmdW5jdGlvbihjKXthKHRoaXMpLmF0dHIoe3JvbGU6XCJvcHRpb25cIixcImFyaWEtZGVzY3JpYmVkYnlcIjpcInNsaWNrLXNsaWRlXCIrYi5pbnN0YW5jZVVpZCtjfSl9KSxudWxsIT09Yi4kZG90cyYmYi4kZG90cy5hdHRyKFwicm9sZVwiLFwidGFibGlzdFwiKS5maW5kKFwibGlcIikuZWFjaChmdW5jdGlvbihjKXthKHRoaXMpLmF0dHIoe3JvbGU6XCJwcmVzZW50YXRpb25cIixcImFyaWEtc2VsZWN0ZWRcIjpcImZhbHNlXCIsXCJhcmlhLWNvbnRyb2xzXCI6XCJuYXZpZ2F0aW9uXCIrYi5pbnN0YW5jZVVpZCtjLGlkOlwic2xpY2stc2xpZGVcIitiLmluc3RhbmNlVWlkK2N9KX0pLmZpcnN0KCkuYXR0cihcImFyaWEtc2VsZWN0ZWRcIixcInRydWVcIikuZW5kKCkuZmluZChcImJ1dHRvblwiKS5hdHRyKFwicm9sZVwiLFwiYnV0dG9uXCIpLmVuZCgpLmNsb3Nlc3QoXCJkaXZcIikuYXR0cihcInJvbGVcIixcInRvb2xiYXJcIiksYi5hY3RpdmF0ZUFEQSgpfSxiLnByb3RvdHlwZS5hY3RpdmF0ZUFEQT1mdW5jdGlvbigpe3ZhciBhPXRoaXM7YS4kc2xpZGVUcmFjay5maW5kKFwiLnNsaWNrLWFjdGl2ZVwiKS5hdHRyKHtcImFyaWEtaGlkZGVuXCI6XCJmYWxzZVwifSkuZmluZChcImEsIGlucHV0LCBidXR0b24sIHNlbGVjdFwiKS5hdHRyKHt0YWJpbmRleDpcIjBcIn0pfSxiLnByb3RvdHlwZS5mb2N1c0hhbmRsZXI9ZnVuY3Rpb24oKXt2YXIgYj10aGlzO2IuJHNsaWRlci5vbihcImZvY3VzLnNsaWNrIGJsdXIuc2xpY2tcIixcIipcIixmdW5jdGlvbihjKXtjLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO3ZhciBkPWEodGhpcyk7c2V0VGltZW91dChmdW5jdGlvbigpe2IuaXNQbGF5JiYoZC5pcyhcIjpmb2N1c1wiKT8oYi5hdXRvUGxheUNsZWFyKCksYi5wYXVzZWQ9ITApOihiLnBhdXNlZD0hMSxiLmF1dG9QbGF5KCkpKX0sMCl9KX0sYS5mbi5zbGljaz1mdW5jdGlvbigpe3ZhciBmLGcsYT10aGlzLGM9YXJndW1lbnRzWzBdLGQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpLGU9YS5sZW5ndGg7Zm9yKGY9MDtlPmY7ZisrKWlmKFwib2JqZWN0XCI9PXR5cGVvZiBjfHxcInVuZGVmaW5lZFwiPT10eXBlb2YgYz9hW2ZdLnNsaWNrPW5ldyBiKGFbZl0sYyk6Zz1hW2ZdLnNsaWNrW2NdLmFwcGx5KGFbZl0uc2xpY2ssZCksXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGcpcmV0dXJuIGc7cmV0dXJuIGF9fSk7IiwiZnVuY3Rpb24gc3NjX2luaXQoKSB7XG4gICAgaWYgKCFkb2N1bWVudC5ib2R5KSByZXR1cm47XG4gICAgdmFyIGUgPSBkb2N1bWVudC5ib2R5O1xuICAgIHZhciB0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIHZhciBuID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHZhciByID0gZS5zY3JvbGxIZWlnaHQ7XG5cbiAgICBzc2Nfcm9vdCA9IGRvY3VtZW50LmNvbXBhdE1vZGUuaW5kZXhPZihcIkNTU1wiKSA+PSAwID8gdCA6IGU7XG4gICAgc3NjX2FjdGl2ZUVsZW1lbnQgPSBlO1xuICAgIHNzY19pbml0ZG9uZSA9IHRydWU7XG5cbiAgICBpZiAodG9wICE9IHNlbGYpXG4gICAgICAgIHNzY19mcmFtZSA9IHRydWU7XG5cbiAgICBlbHNlIGlmIChyID4gbiAmJiAoZS5vZmZzZXRIZWlnaHQgPD0gbiB8fCB0Lm9mZnNldEhlaWdodCA8PSBuKSkge1xuICAgICAgICBzc2Nfcm9vdC5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICAgICAgaWYgKHNzY19yb290Lm9mZnNldEhlaWdodCA8PSBuKSB7XG4gICAgICAgICAgICB2YXIgaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBpLnN0eWxlLmNsZWFyID0gXCJib3RoXCI7XG4gICAgICAgICAgICBlLmFwcGVuZENoaWxkKGkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXNzY19maXhlZGJhY2spIHtcbiAgICAgICAgZS5zdHlsZS5iYWNrZ3JvdW5kQXR0YWNobWVudCA9IFwic2Nyb2xsXCI7XG4gICAgICAgIHQuc3R5bGUuYmFja2dyb3VuZEF0dGFjaG1lbnQgPSBcInNjcm9sbFwiXG4gICAgfVxuXG4gICAgaWYgKHNzY19rZXlib2FyZHN1cHBvcnQpXG4gICAgICAgIHNzY19hZGRFdmVudChcImtleWRvd25cIiwgc3NjX2tleWRvd24pO1xufVxuXG5mdW5jdGlvbiBzc2Nfc2Nyb2xsQXJyYXkoZSwgdCwgbiwgcikge1xuICAgIHIgfHwgKHIgPSAxZTMpO1xuICAgIHNzY19kaXJlY3Rpb25DaGVjayh0LCBuKTtcbiAgICBzc2NfcXVlLnB1c2goe1xuICAgICAgICB4OiB0LFxuICAgICAgICB5OiBuLFxuICAgICAgICBsYXN0WDogdCA8IDAgPyAuOTkgOiAtLjk5LFxuICAgICAgICBsYXN0WTogbiA8IDAgPyAuOTkgOiAtLjk5LFxuICAgICAgICBzdGFydDogKyhuZXcgRGF0ZSlcbiAgICB9KTtcblxuICAgIGlmIChzc2NfcGVuZGluZylcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgdmFyIGkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzID0gKyhuZXcgRGF0ZSk7XG4gICAgICAgIHZhciBvID0gMDtcbiAgICAgICAgdmFyIHUgPSAwO1xuICAgICAgICBmb3IgKHZhciBhID0gMDsgYSA8IHNzY19xdWUubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgICAgIHZhciBmID0gc3NjX3F1ZVthXTtcbiAgICAgICAgICAgIHZhciBsID0gcyAtIGYuc3RhcnQ7XG4gICAgICAgICAgICB2YXIgYyA9IGwgPj0gc3NjX2FuaW10aW1lO1xuICAgICAgICAgICAgdmFyIGggPSBjID8gMSA6IGwgLyBzc2NfYW5pbXRpbWU7XG4gICAgICAgICAgICBpZiAoc3NjX3B1bHNlQWxnb3JpdGhtKSB7XG4gICAgICAgICAgICAgICAgaCA9IHNzY19wdWxzZShoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHAgPSBmLnggKiBoIC0gZi5sYXN0WCA+PiAwO1xuICAgICAgICAgICAgdmFyIGQgPSBmLnkgKiBoIC0gZi5sYXN0WSA+PiAwO1xuICAgICAgICAgICAgbyArPSBwO1xuICAgICAgICAgICAgdSArPSBkO1xuICAgICAgICAgICAgZi5sYXN0WCArPSBwO1xuICAgICAgICAgICAgZi5sYXN0WSArPSBkO1xuICAgICAgICAgICAgaWYgKGMpIHtcbiAgICAgICAgICAgICAgICBzc2NfcXVlLnNwbGljZShhLCAxKTtcbiAgICAgICAgICAgICAgICBhLS1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgdmFyIHYgPSBlLnNjcm9sbExlZnQ7XG4gICAgICAgICAgICBlLnNjcm9sbExlZnQgKz0gbztcbiAgICAgICAgICAgIGlmIChvICYmIGUuc2Nyb2xsTGVmdCA9PT0gdikge1xuICAgICAgICAgICAgICAgIHQgPSAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgIHZhciBtID0gZS5zY3JvbGxUb3A7XG4gICAgICAgICAgICBlLnNjcm9sbFRvcCArPSB1O1xuICAgICAgICAgICAgaWYgKHUgJiYgZS5zY3JvbGxUb3AgPT09IG0pIHtcbiAgICAgICAgICAgICAgICBuID0gMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghdCAmJiAhbilcbiAgICAgICAgICAgIHNzY19xdWUgPSBbXTtcblxuICAgICAgICBpZiAoc3NjX3F1ZS5sZW5ndGgpXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGksIHIgLyBzc2NfZnJhbWVyYXRlICsgMSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHNzY19wZW5kaW5nID0gZmFsc2U7XG4gICAgfTtcbiAgICBzZXRUaW1lb3V0KGksIDApO1xuICAgIHNzY19wZW5kaW5nID0gdHJ1ZVxufVxuXG5mdW5jdGlvbiBzc2Nfd2hlZWwoZSkge1xuICAgIGlmICghc3NjX2luaXRkb25lKSB7XG4gICAgICAgIHNzY19pbml0KClcbiAgICB9XG4gICAgdmFyIHQgPSBlLnRhcmdldDtcbiAgICB2YXIgbiA9IHNzY19vdmVyZmxvd2luZ0FuY2VzdG9yKHQpO1xuICAgIGlmICghbiB8fCBlLmRlZmF1bHRQcmV2ZW50ZWQgfHwgc3NjX2lzTm9kZU5hbWUoc3NjX2FjdGl2ZUVsZW1lbnQsIFwiZW1iZWRcIikgfHwgc3NjX2lzTm9kZU5hbWUodCwgXCJlbWJlZFwiKSAmJiAvXFwucGRmL2kudGVzdCh0LnNyYykpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgdmFyIHIgPSBlLndoZWVsRGVsdGFYIHx8IDA7XG4gICAgdmFyIGkgPSBlLndoZWVsRGVsdGFZIHx8IDA7XG4gICAgaWYgKCFyICYmICFpKVxuICAgICAgICBpID0gZS53aGVlbERlbHRhIHx8IDA7XG5cbiAgICBpZiAoTWF0aC5hYnMocikgPiAxLjIpXG4gICAgICAgIHIgKj0gc3NjX3N0ZXBzaXplIC8gMTIwO1xuXG4gICAgaWYgKE1hdGguYWJzKGkpID4gMS4yKVxuICAgICAgICBpICo9IHNzY19zdGVwc2l6ZSAvIDEyMDtcblxuICAgIHNzY19zY3JvbGxBcnJheShuLCAtciwgLWkpO1xuICAgIGUucHJldmVudERlZmF1bHQoKVxufVxuXG5mdW5jdGlvbiBzc2Nfa2V5ZG93bihlKSB7XG4gICAgdmFyIHQgPSBlLnRhcmdldDtcbiAgICB2YXIgbiA9IGUuY3RybEtleSB8fCBlLmFsdEtleSB8fCBlLm1ldGFLZXk7XG5cbiAgICBpZiAoL2lucHV0fHRleHRhcmVhfGVtYmVkL2kudGVzdCh0Lm5vZGVOYW1lKSB8fCB0LmlzQ29udGVudEVkaXRhYmxlIHx8IGUuZGVmYXVsdFByZXZlbnRlZCB8fCBuKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGlmIChzc2NfaXNOb2RlTmFtZSh0LCBcImJ1dHRvblwiKSAmJiBlLmtleUNvZGUgPT09IHNzY19rZXkuc3BhY2ViYXIpXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgdmFyIHIsIGkgPSAwLFxuICAgICAgICBzID0gMDtcbiAgICB2YXIgbyA9IHNzY19vdmVyZmxvd2luZ0FuY2VzdG9yKHNzY19hY3RpdmVFbGVtZW50KTtcbiAgICB2YXIgdSA9IG8uY2xpZW50SGVpZ2h0O1xuXG4gICAgaWYgKG8gPT0gZG9jdW1lbnQuYm9keSlcbiAgICAgICAgdSA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgIGNhc2Ugc3NjX2tleS51cDpcbiAgICAgICAgICAgIHMgPSAtc3NjX2Fycm93c2Nyb2xsO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugc3NjX2tleS5kb3duOlxuICAgICAgICAgICAgcyA9IHNzY19hcnJvd3Njcm9sbDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHNzY19rZXkuc3BhY2ViYXI6XG4gICAgICAgICAgICByID0gZS5zaGlmdEtleSA/IDEgOiAtMTtcbiAgICAgICAgICAgIHMgPSAtciAqIHUgKiAuOTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHNzY19rZXkucGFnZXVwOlxuICAgICAgICAgICAgcyA9IC11ICogLjk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBzc2Nfa2V5LnBhZ2Vkb3duOlxuICAgICAgICAgICAgcyA9IHUgKiAuOTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHNzY19rZXkuaG9tZTpcbiAgICAgICAgICAgIHMgPSAtby5zY3JvbGxUb3A7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBzc2Nfa2V5LmVuZDpcbiAgICAgICAgICAgIHZhciBhID0gby5zY3JvbGxIZWlnaHQgLSBvLnNjcm9sbFRvcCAtIHU7XG4gICAgICAgICAgICBzID0gYSA+IDAgPyBhICsgMTAgOiAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugc3NjX2tleS5sZWZ0OlxuICAgICAgICAgICAgaSA9IC1zc2NfYXJyb3dzY3JvbGw7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBzc2Nfa2V5LnJpZ2h0OlxuICAgICAgICAgICAgaSA9IHNzY19hcnJvd3Njcm9sbDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgc3NjX3Njcm9sbEFycmF5KG8sIGksIHMpO1xuICAgIGUucHJldmVudERlZmF1bHQoKVxufVxuXG5mdW5jdGlvbiBzc2NfbW91c2Vkb3duKGUpIHtcbiAgICBzc2NfYWN0aXZlRWxlbWVudCA9IGUudGFyZ2V0XG59XG5cbmZ1bmN0aW9uIHNzY19zZXRDYWNoZShlLCB0KSB7XG4gICAgZm9yICh2YXIgbiA9IGUubGVuZ3RoOyBuLS07KSBzc2NfY2FjaGVbc3NjX3VuaXF1ZUlEKGVbbl0pXSA9IHQ7XG4gICAgcmV0dXJuIHRcbn1cblxuZnVuY3Rpb24gc3NjX292ZXJmbG93aW5nQW5jZXN0b3IoZSkge1xuICAgIHZhciB0ID0gW107XG4gICAgdmFyIG4gPSBzc2Nfcm9vdC5zY3JvbGxIZWlnaHQ7XG4gICAgZG8ge1xuICAgICAgICB2YXIgciA9IHNzY19jYWNoZVtzc2NfdW5pcXVlSUQoZSldO1xuICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgcmV0dXJuIHNzY19zZXRDYWNoZSh0LCByKVxuICAgICAgICB9XG4gICAgICAgIHQucHVzaChlKTtcbiAgICAgICAgaWYgKG4gPT09IGUuc2Nyb2xsSGVpZ2h0KSB7XG4gICAgICAgICAgICBpZiAoIXNzY19mcmFtZSB8fCBzc2Nfcm9vdC5jbGllbnRIZWlnaHQgKyAxMCA8IG4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3NjX3NldENhY2hlKHQsIGRvY3VtZW50LmJvZHkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZS5jbGllbnRIZWlnaHQgKyAxMCA8IGUuc2Nyb2xsSGVpZ2h0KSB7XG4gICAgICAgICAgICBvdmVyZmxvdyA9IGdldENvbXB1dGVkU3R5bGUoZSwgXCJcIikuZ2V0UHJvcGVydHlWYWx1ZShcIm92ZXJmbG93XCIpO1xuICAgICAgICAgICAgaWYgKG92ZXJmbG93ID09PSBcInNjcm9sbFwiIHx8IG92ZXJmbG93ID09PSBcImF1dG9cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzc2Nfc2V0Q2FjaGUodCwgZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB3aGlsZSAoZSA9IGUucGFyZW50Tm9kZSlcbn1cblxuZnVuY3Rpb24gc3NjX2FkZEV2ZW50KGUsIHQsIG4pIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihlLCB0LCBuIHx8IGZhbHNlKVxufVxuXG5mdW5jdGlvbiBzc2NfcmVtb3ZlRXZlbnQoZSwgdCwgbikge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGUsIHQsIG4gfHwgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIHNzY19pc05vZGVOYW1lKGUsIHQpIHtcbiAgICByZXR1cm4gZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSB0LnRvTG93ZXJDYXNlKClcbn1cblxuZnVuY3Rpb24gc3NjX2RpcmVjdGlvbkNoZWNrKGUsIHQpIHtcbiAgICBlID0gZSA+IDAgPyAxIDogLTE7XG4gICAgdCA9IHQgPiAwID8gMSA6IC0xO1xuICAgIGlmIChzc2NfZGlyZWN0aW9uLnggIT09IGUgfHwgc3NjX2RpcmVjdGlvbi55ICE9PSB0KSB7XG4gICAgICAgIHNzY19kaXJlY3Rpb24ueCA9IGU7XG4gICAgICAgIHNzY19kaXJlY3Rpb24ueSA9IHQ7XG4gICAgICAgIHNzY19xdWUgPSBbXVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc3NjX3B1bHNlXyhlKSB7XG4gICAgdmFyIHQsIG4sIHI7XG4gICAgZSA9IGUgKiBzc2NfcHVsc2VTY2FsZTtcbiAgICBpZiAoZSA8IDEpIHtcbiAgICAgICAgdCA9IGUgLSAoMSAtIE1hdGguZXhwKC1lKSlcbiAgICB9IGVsc2Uge1xuICAgICAgICBuID0gTWF0aC5leHAoLTEpO1xuICAgICAgICBlIC09IDE7XG4gICAgICAgIHIgPSAxIC0gTWF0aC5leHAoLWUpO1xuICAgICAgICB0ID0gbiArIHIgKiAoMSAtIG4pXG4gICAgfVxuICAgIHJldHVybiB0ICogc3NjX3B1bHNlTm9ybWFsaXplXG59XG5cbmZ1bmN0aW9uIHNzY19wdWxzZShlKSB7XG4gICAgaWYgKGUgPj0gMSkgcmV0dXJuIDE7XG4gICAgaWYgKGUgPD0gMCkgcmV0dXJuIDA7XG4gICAgaWYgKHNzY19wdWxzZU5vcm1hbGl6ZSA9PSAxKSB7XG4gICAgICAgIHNzY19wdWxzZU5vcm1hbGl6ZSAvPSBzc2NfcHVsc2VfKDEpXG4gICAgfVxuICAgIHJldHVybiBzc2NfcHVsc2VfKGUpXG59XG5cbnZhciBzc2NfZnJhbWVyYXRlID0gMTUwO1xudmFyIHNzY19hbmltdGltZSA9IDUwMDtcbnZhciBzc2Nfc3RlcHNpemUgPSAxNTA7XG52YXIgc3NjX3B1bHNlQWxnb3JpdGhtID0gdHJ1ZTtcbnZhciBzc2NfcHVsc2VTY2FsZSA9IDY7XG52YXIgc3NjX3B1bHNlTm9ybWFsaXplID0gMTtcbnZhciBzc2Nfa2V5Ym9hcmRzdXBwb3J0ID0gdHJ1ZTtcbnZhciBzc2NfYXJyb3dzY3JvbGwgPSA1MDtcbnZhciBzc2NfZnJhbWUgPSBmYWxzZTtcbnZhciBzc2NfZGlyZWN0aW9uID0ge1xuICAgIHg6IDAsXG4gICAgeTogMFxufTtcbnZhciBzc2NfaW5pdGRvbmUgPSBmYWxzZTtcbnZhciBzc2NfZml4ZWRiYWNrID0gdHJ1ZTtcbnZhciBzc2Nfcm9vdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbnZhciBzc2NfYWN0aXZlRWxlbWVudDtcbnZhciBzc2Nfa2V5ID0ge1xuICAgIGxlZnQ6IDM3LFxuICAgIHVwOiAzOCxcbiAgICByaWdodDogMzksXG4gICAgZG93bjogNDAsXG4gICAgc3BhY2ViYXI6IDMyLFxuICAgIHBhZ2V1cDogMzMsXG4gICAgcGFnZWRvd246IDM0LFxuICAgIGVuZDogMzUsXG4gICAgaG9tZTogMzZcbn07XG52YXIgc3NjX3F1ZSA9IFtdO1xudmFyIHNzY19wZW5kaW5nID0gZmFsc2U7XG52YXIgc3NjX2NhY2hlID0ge307XG5cbnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICBzc2NfY2FjaGUgPSB7fVxufSwgMTAgKiAxZTMpO1xuXG52YXIgc3NjX3VuaXF1ZUlEID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlID0gMDtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHQuc3NjX3VuaXF1ZUlEIHx8ICh0LnNzY191bmlxdWVJRCA9IGUrKylcbiAgICB9XG59KCk7XG5cbnZhciBpc2Nocm9tZSA9IC9jaHJvbWUvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcbmlmIChpc2Nocm9tZSkge1xuICAgIHNzY19hZGRFdmVudChcIm1vdXNlZG93blwiLCBzc2NfbW91c2Vkb3duKTtcbiAgICBzc2NfYWRkRXZlbnQoXCJtb3VzZXdoZWVsXCIsIHNzY193aGVlbCk7XG4gICAgc3NjX2FkZEV2ZW50KFwibG9hZFwiLCBzc2NfaW5pdClcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
