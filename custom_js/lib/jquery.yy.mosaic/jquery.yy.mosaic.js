/*
 * Version 1.0.1
Copyright (c) 2012, Tingdong Chen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*
 * This lib align images into a rectangler, percisely fit to the edges, then add masks for hover effect.
 *
 * run on a list of items. 
 * <div class="a"><img/></div>
 * ... 
 * <div class="a"><img/></div>
 * <script> 
 * $('a').mosaic();
 * </script>
 * 
 * Wrapper <div> can have multiple depth, but only contains one image.
 */
(function ($) {
	$.fn.mosaic = function(options, callback){
		var opts = $.extend($.fn.mosaic.defaults, options || {});

		/* wrap up */
		var mosaicItems = this.addClass('mosaic-item');

		var mosaic = $('<div>').addClass('mosaic').appendTo($(this).parent());
		mosaicItems.appendTo(mosaic);
		
		/* group to rows */
		var rowsLength = Math.floor(mosaicItems.length / opts.numberPerRow);
		var numberExtraItems = mosaicItems.length % opts.numberPerRow;

		/* css all height equal */
		var origItemHeight = mosaicItems.eq(0).height();

		for (var i=0; i < rowsLength; i++) {
			var row = $('<div>').addClass('mosaic-row').appendTo(mosaic);
			/* last line contains all extra items*/
			var numberPerRow = (i == rowsLength - 1) 
				? (opts.numberPerRow + numberExtraItems) 
				: opts.numberPerRow;

			var rowWidth = 0;
			for (var j=0; j < numberPerRow; j++){
				var item = mosaicItems.eq(i * opts.numberPerRow + j).appendTo(row);
				rowWidth += item.width();
			}

			/* adjust width by ratio */
			var ratio = mosaic.width() / rowWidth;
			row.width(Math.floor(rowWidth * ratio) + 2 * opts.numberPerRow);

			var newHeight = Math.floor(origItemHeight * ratio);

			row.find('.mosaic-item').each(function(n, e){
				var $image = (e.tagName == 'IMG') ? $(e) : $(e).find('img').eq(0);
				var newWidth = $image.width() * ratio;

				var css = {
					height: newHeight,
					width: newWidth
				}
				$(this).css(css).find('*').css(css);
			});
		}

		/* cut off the edge to make sure alignment */
		$('.mosaic').width( $('.mosaic').width() - 2 * opts.numberPerRow);

		if (opts.mask) {
			mosaicItems.addMask(opts);
		}

		if (typeof callback == 'function' ) {
			callback.call(this);
		}

	};

	$.fn.addMask = function(opts){
		return this.each(function(){
			var $item = $(this);

			var width = $item.width();
			var height = $item.height();
			
			$item.wrap('<div class="mosaic-wrapper"></div>');

			var $wrapper = $item.parent().css({
				width: width,
				height: height
			});

			$item.css({
				width: width,
				height: height
			});

			var mask = $('<div>').addClass('mosaic-mask').css({
				opacity: opts.opacity,
				width: width,
				height: height
			}).appendTo($wrapper);

			if (opts.fadingMask == true) {
				$wrapper.hover(function(){
					$(this).find('.mosaic-mask').fadeOut(opts.fadingInterval);
				},function(){
					$(this).find('.mosaic-mask').fadeIn(opts.fadingInterval);
				});
			}
		});
	}

	$.fn.mosaic.defaults = {
		numberPerRow: 8,
		mask: true,
		fadingMask: true,
		fadingInterval: 141,
		opacity: 0.41
	}

})(jQuery);