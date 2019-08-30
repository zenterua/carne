jQuery(function($) {

	var controller = new ScrollMagic.Controller();

	controller.scrollTo(function (newScrollPos) {
	    $("html, body").animate({scrollTop: newScrollPos}, 1000);
	});


	var $window = $(window);
	var isTweening = false;
	
	document.onmousewheel = function(){ customScroll(); }
	if(document.addEventListener){
	    document.addEventListener('DOMMouseScroll', customScroll, false);
	}
	 
	function customScroll(event){
	   
	   var delta = 0;
	   
	   if (!event){
	       event = window.event;
	   }
	   
	   if (event.wheelDelta) {
	       delta = event.wheelDelta/120;
	   } else if(event.detail) {
	       delta = -event.detail/3;
	   }
	   
	   if (delta){
            var scrollTop = $window.scrollTop();
            var finScroll = scrollTop - parseInt(delta*100) * 3;
           
            TweenMax.to($window, 1.5, {
                scrollTo : { y: finScroll, autoKill:true },
                ease: Power4.easeOut,
                //autoKill: true,
                overwrite: 5,
                onComplete: function(){ 
                    
                }
            });
	   }
	   
	   if (event.preventDefault){
	       event.preventDefault();
	   }
	   
	   event.returnValue = false;
	                        
	}

	//slider
	var eSlidesBg = document.querySelectorAll(".e-slider-backgrounds .entry"),
		eSlidesTh = document.querySelectorAll(".e-slider-thumbnails .entry"),
		eSlidesTx = document.querySelectorAll(".e-slider-texts .entry"),
		eSlidesTl = document.querySelectorAll(".e-slider-titles .entry"),
		slidesL = eSlidesBg.length;

	var sceneSlider = new ScrollMagic.Scene({
	  triggerElement: "#e-slider",
	  duration: $(window).height()*(slidesL-1),
	  triggerHook: 0,
	})
	.setPin("#e-slider")
	.addTo(controller);

	var activeScenes = [];
	
	for (var i=0; i<slidesL; i++) {
		var rel = $(eSlidesBg[i]).data('rel');
		new ScrollMagic.Scene({
				triggerElement: "#e-slider",
				triggerHook: 1,
				// offset: $(window).height()*i + i*$(window).height()/slidesL,
				// duration: $(window).height() + $(window).height()/slidesL
				offset: $(window).height()*i,
				duration: $(window).height()
			})
			.setTween(
				new TimelineMax().fromTo('.e-slider-thumbnails .entry[data-rel="'+rel+'"]', 1, 
					{autoAlpha: 0.5, x: '-100%'},
					{autoAlpha: 6, x: '0%', ease: Linear.easeNone}
				)
				.fromTo('.e-slider-thumbnails .entry[data-rel="'+rel+'"] div', 1, 
					{autoAlpha: 0.5, x: '95%'},
					{autoAlpha: 1, x: '0%', ease: Linear.easeNone}, 0
				)
				.fromTo('.e-slider-backgrounds .entry[data-rel="'+rel+'"]', 1, 
					{autoAlpha: 0.5, y: '100%'},
					{autoAlpha: 6, y: '0%', ease: Linear.easeNone}, 0
				)
				.fromTo('.e-slider-backgrounds .entry[data-rel="'+rel+'"] div', 1, 
					{autoAlpha: 0.5, y: '-100%'},
					{autoAlpha: 1, y: '0%', ease: Linear.easeNone}, 0
				)
			)
			.addTo(controller);

		activeScenes.push(
			new ScrollMagic.Scene({
					triggerElement: "#e-slider",
					triggerHook: 1,
					offset: $(window).height()*(i+1) - 1,
					duration: $(window).height()
				})
				.setClassToggle('#e-slider .entry[data-rel="'+rel+'"]', "active")
				.addTo(controller)
		);
	}

	//scroll slider
	$(eSlidesTl).on('click', function(){
		controller.scrollTo(activeScenes[parseInt($(this).data('rel'), 10)].scrollOffset() + 1);
		return false;
	});


	//video
	var sceneVideo1 = new ScrollMagic.Scene({
	  triggerElement: "#e-video",
	  duration: '200%',
	  triggerHook: 1,
	})
	.setTween(
		new TimelineMax().fromTo('#e-video .paddingBottonWrapper', 1, 
			{scale: '1.2'},
			{scale: '0.8', ease: Linear.easeNone}
		)
	)
	.addTo(controller);

	var sceneVideo2 = new ScrollMagic.Scene({
	  triggerElement: "#e-video",
	  duration: '100%',
	  triggerHook: 0
	})
	.setTween(
		new TimelineMax().fromTo('#e-video > .bg-entry', 1, 
			{autoAlpha: 1},
			{autoAlpha: 0, ease: Linear.easeNone}
		)
		.to('#e-video .e-video-line', 1, 
			{width: '0px', ease: Linear.easeNone}, 0
		)
	)
	.setPin('#e-video .e-video-line')
	.addTo(controller);

	var sceneVideo3 = new ScrollMagic.Scene({
	  triggerElement: "#e-video",
	  duration: '50%',
	  offset: $(window).height()*0.25,
	  triggerHook: 0
	})
	.setTween(
		new TimelineMax().fromTo('#e-video .e-video-wrapper', 1, 
			{autoAlpha: 1},
			{autoAlpha: 0, ease: Linear.easeNone}
		)
		.fromTo('#e-video .cell-view', 1, 
			{y: '0%'},
			{y: '25%', ease: Linear.easeNone}, 0
		)
	)
	.addTo(controller);


	//images
	var sceneImages = new ScrollMagic.Scene({
	  triggerElement: "#e-images",
	  duration: '200%',
	  triggerHook: 1,
	})
	.setTween(
		new TimelineMax().fromTo('#e-images .image-1', 1, 
			{y: '57%'},
			{y: '-57%', ease: Linear.easeNone}
		)
		.fromTo('#e-images .image-2', 1, 
			{y: '25%'},
			{y: '-25%', ease: Linear.easeNone}, 0
		)
		.fromTo('#e-images .image-3', 1, 
			{y: '123%'},
			{y: '-123%', ease: Linear.easeNone}, 0
		)
		.fromTo('#e-images .image-4', 1, 
			{y: '114%'},
			{y: '-114%', ease: Linear.easeNone}, 0
		)
		.fromTo('#e-images .image-5', 1, 
			{y: '117%'},
			{y: '-117%', ease: Linear.easeNone}, 0
		)
		.fromTo('#e-images .image-6', 1, 
			{y: '155%'},
			{y: '-155%', ease: Linear.easeNone}, 0
		)
		.fromTo('#e-images .image-7', 1, 
			{y: '127%'},
			{y: '-127%', ease: Linear.easeNone}, 0
		)
		.fromTo('#e-images .image-8', 1, 
			{y: '150%'},
			{y: '-150%', ease: Linear.easeNone}, 0
		)
	)
	.addTo(controller);


	//banner
	var sceneBanner = new ScrollMagic.Scene({
	  triggerElement: ".mainBanner",
	  duration: '100%',
	  triggerHook: 0,
	})
	.setTween(
		new TimelineMax().fromTo('.mainBanner .swiper-container', 1, 
			{autoAlpha: 1, y: '0px'},
			{autoAlpha: 0, y: '500px', ease: Linear.easeNone}
		)
	)
	.addTo(controller);


});