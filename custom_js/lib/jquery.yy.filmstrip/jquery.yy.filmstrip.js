(function($){
	$.fn.filmstrip = function(options) {
		var opts = $.extend($.fn.filmstrip.defaults,options);

		//set up
		var container = $(this).addClass('filmstrip-container');
		var film_container = $('<div>').addClass('filmstrip-film-container');
		var film = container.find('ul').addClass('filmstrip-film').wrap(film_container);
		
		var frames = film.find('li');

		frames.each(function(index){
			$(this).addClass('filmstrip-frame')
				.addClass('filmstrip-frame-' + index);
		});

		//create control buttons.
		var prev = $('<div class="filmstrip-prev">&lt;</div>').prependTo(container);
		var next = $('<div class="filmstrip-next">&gt;</div>').appendTo(container);

		buildStrip();

		//plugin functions
		function buildStrip(){
			//calculate film width
			var film_width = 0;
			frames.each(function(){
				film_width += $(this).width() + opts.frame_gap;
			});
			orig_width = film_width;

			//duplicate some frames to the left start
			var left_frames_width = 0;
			for(var i=frames.length-1; i>=0; i--) {
				frames.eq(i).clone().prependTo(film);

				left_frames_width += frames.eq(i).width() + opts.frame_gap;
				if (left_frames_width >= opts.panel_width)
					break;
			};
			film_width += left_frames_width;

			//duplicate some frames to the right end.
			var right_frames_width = 0;
			for(var i=0; i<frames.length; i++) {
				frames.eq(i).clone().appendTo(film);

				right_frames_width += frames.eq(i).width() + opts.frame_gap;
				if (right_frames_width >= opts.panel_width) 
					break;
			};
			film_width += right_frames_width;

			//re define frames to include all
			frames = film.find('li');

			//put frames inline 
			frames.css({
				'list-style':'none',
				'display':'inline',
				'float':'left',
				'margin':0,
				'margin-right': opts.frame_gap
			});
			
			film.css({
				'position': 'absolute',
				'left': - left_frames_width,
				'width': film_width,
				'height': container.height(),
			});

			//animation
			prev.click(function(){
				film.stop(true,true);

				film.animate({
					'left': film.position().left + opts.scroll_width
				}, opts.transition_speed, function(){
					if (film.position().left + left_frames_width >=0) {
						film.css({
							'left': film.position().left - orig_width
						});
					}
				});
            });		

			next.click(function(){
				film.stop(true,true);

				film.animate({
					'left': film.position().left - opts.scroll_width
				}, opts.transition_speed, function(){
					if (film.position().left + film_width < orig_width) {
						film.css({
							'left': film.position().left + orig_width
						});
					}
				});
			});
		}

	}

	$.fn.filmstrip.defaults = {
		transition_speed: 800,
		frame_gap: 8,
		panel_width: 918,
		scroll_width: 918
	};
})(jQuery);
