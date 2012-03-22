/*
jquery.yy.bookpages.js
Copyright (c) 2012, Tingdong Chen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*
This plugin Requires jQuery 1.3.2 and jquery.columinizer 1.4.0
Example:
<div class="bookpages"><img src="..." /></div>
<div class="bookpages"><img src="..." /></div>
<div class="bookpages"><img src="..." /></div>

$('.bookpages').bookpages();

It support multiple level of div wrappers, just make sure there is only one image inside it.
*/
(function($) {
	var BookPages = function(element){
		//default settings
		this.defaults = {
			width:410,
			height:410,
			time:1000,
			bookCover:true
		};
	};

	$.fn.bookpages = function(options) {
		var bookPages = new BookPages(this);

        var options = $.extend(bookPages.defaults, options || {});

		// private variables
		var $wrapper = $('<div>').addClass('book-wrapper');
		var $book = $(this).addClass('book').wrap($wrapper);
		
	    // extend default settings.
	    var options = $.extend(this.defaults, options);

		// run it
		splitPages();
		pageTo(0, 10);

		//private functions
		function splitPages() {
			$book.find('h2').addClass('dontsplit');

			$book.columnize({
				width:options.width,
				height:options.height,
				buildOnce:true,
				doneFunc:function(){
					buildBookPages();
				}
			});
		}

		function buildBookPages() {
			$book.children('br').remove();
			if (options.bookCover) {
				var covers = buildBookCovers();
				$('<div>').addClass('column cover').html(covers['front']).prependTo($book);
				$('<div>').addClass('column cover').html(covers['back']).appendTo($book);
			}

			$book.children('.column').each(function(index) {
				var $columns = $(this).wrap('<div class="page">');
				var zebra = (index % 2 == 0) ? 'page even' : 'page odd';
				if (index == 0) {
					zebra = 'page even first';
				}
				var $page = $(this).parent().addClass(zebra);
				var pageNumber = (index == 0) ? '' : index;
				var $pager = $('<div>').addClass('pager').html(pageNumber).appendTo($page);

				//click the page to turn it, don't loop.
				$page.bind('click', function(){
					if (index % 2 == 0 && index > 1) {
						pageTo(index - 2);
					} 
					else if (index % 2 == 1 && index < $(bookPages.pages).length - 1) {
						pageTo(index + 2);
					}
				});
			});
			bookPages.pages = $book.find('.page');
		}

		function buildBookCovers(){
			var covers = new Array();
			var number = decodeURI(
				(RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,0])[1]
			);

			var viewPage = '<h1>Volumn ' + (parseInt(number) + 1) + '</h1>';
			var dates = $('.date-display-single');
			var chronicle = '<div class="chronicle">' 
				+ dates.eq(0).html() 
				+ ' - ' 
				+ dates.eq(dates.length - 1).html() 
				+ '</div>';
			covers['front'] = $('<div>').html(viewPage + chronicle);
			covers['back'] = $('<h1>').html('The end');
			return covers;
		}

		//public functions
		function pageTo(index, time){
			var pages = bookPages.pages;
			if (typeof(time) == 'undefined') {
				time = options.time;
			}
			var width = pages.width();

			$(pages).stop(true,true).hide();

			// even for paging to prev page
			if (index % 2 == 0) {
				$(pages).eq(index).show().css({
					zIndex: 1,
					left: 0,
					width: 0,
				}).animate({
					width: width
				}, time, 'linear');

				$(pages).eq(index + 1).show().css({
					zIndex: 3,
					left: 0,
					width: 0
				}).animate({
					left: width,
					width: width
				}, time, 'linear');

				$(pages).eq(index + 2).show().css({
					zIndex: 0,
				});

				$(pages).eq(index + 3).show().css({
					zIndex: 1,
					left: width,
					width: width
				});
			}
			else {
				// odd for paging to next page
				$(pages).eq(index - 3).show().css({
					zIndex : 1,
					left : 0,
					width : width
				});

				$(pages).eq(index - 2).show().css({
					zIndex: 2,
					left: width,
					width: width
				}).animate({
					left: width,
					width: 0
				}, time, 'linear', function(){
					$(this).hide();
				});

				$(pages).eq(index - 1).show().css({
					zIndex: 3,
					left: width * 2,
					width: 0
				}).animate({
					left: 0,
					width: width
				}, time , 'linear');

				$(pages).eq(index + 0).show().css({
					zIndex: 1,
					left:width,
					width:width
				});
			}

		};

		return this;
	}
})(jQuery);

