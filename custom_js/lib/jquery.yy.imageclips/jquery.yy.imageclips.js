/*
 * Version 1.0
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php                 * Programmed by Tingdong Chen chentingdong@gmail.com
 */
(function($){
	var ImageClips = function(elem){
		this.defaults = {
			cols:8,
			rows:8,
			speed:1000,
			effect:'fade'
		};
	}

	$.fn.imageClips = function(opts){
		var imageClips = new ImageClips(this);
        var opts = $.extend(imageClips.defaults, opts || {});

		var $clipsWrapper = $('<div>').addClass('clips-wrapper');
		var clips = $(this).addClass('image-cilp').wrapAll($clipsWrapper);

		clips.each(function(){
			$(this).find('img').clone().appendTo($(this));
		});
	};
})(jQuery);
