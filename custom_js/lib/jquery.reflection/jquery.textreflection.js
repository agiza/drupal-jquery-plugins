/*
 * jQuery text reflection plugin
 *
 * This is the non-minified development version; use jquery.textreflection.min.js in your production environment
 *
 * creates a reflection for every text element with a class "textreflection"
 * created by jarón barends http://jaron.nl
 *
 * Read the accompanying blogpost:
 * http://jaron.nl/blog/2011/text-reflections-with-css-and-javascript-jquery-text-reflection-plugin
 *
*/
(function($) {
	
	
	$.fn.textreflection = function(options){
		var config = {
		};
		if(options) {$.extend(config, options);}
		
		//-- Start Heeeeel erg uitgeklede versie van Modernizr - alleen gradients check
			function contains( str, substr ) {
				//contains returns a boolean for if substr is found within str.
				return (''+str).indexOf( substr ) !== -1;
			}
			
			function set_css( str ) {
				//set_css applies given styles to the Modernizr DOM node.
				m_style.cssText = str;
			}
			
			var mod = 'modernizr',
			modElem = document.createElement( mod ),
			m_style = modElem.style,
			prefixes = ' -webkit- -moz- -o- -ms- -khtml- '.split(' ');
		
			function hasGradients() {
				var str1 = 'background-image:',
					str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
					str3 = 'linear-gradient(left top,#9f9, white);';
				set_css(
					(str1 + prefixes.join(str2 + str1) + prefixes.join(str3 + str1)).slice(0,-str1.length)
				);
				return contains( m_style.backgroundImage, 'gradient' );
			};
		//-- Einde Heeeeel erg uitgeklede versie van Modernizr - alleen gradients check
	
		function createReflection(obj) {
			var clone = $(obj).wrap('<div class="textreflectionWrapper"></div>').clone().removeClass("textreflection").addClass("textreflectionClone");
			var wrapper = $(obj).parent();
			//$(obj).addClass("textreflectionSource");
			$('<div class="textreflectionEffectWrapper"></div>').appendTo(wrapper).append('<div class="textreflectionMask"></div>').append(clone);
			
			if (!hasGradients()) {
				//put in bg image
				$(".textreflectionMask").addClass("noGradients");
			}
		}
		
		//doe stuff met elk element van wrapped set, en return de set zodat we hem voor chaining kunnen gebruiken
		return this.each(function() {
			createReflection(this);
		});
	};
})(jQuery);

//Nu ready handler definiëren
jQuery(document).ready(function($) {
	$(".textreflection").textreflection();
});
