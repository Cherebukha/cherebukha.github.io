$(document).ready(function() {
	$('.nav-button').on('click', function(e) {
		e.preventDefault();
		if ($('nav').css('display') === 'none') {
			$('.nav-button').addClass('close');
			$('nav').fadeIn(300);
			//$('nav').css('display', 'block');
		}
		else {
			$('.nav-button').removeClass('close');
			$('nav').fadeOut(300);
			//$('nav').css('display', 'none');
		}
	});
	
	$('.about-slider').slick({
		arrows: false,
		autoplay: true,
		autoplaySpeed: 3000,
		pauseOnHover: false,
		swipe: false,
		cssEase: 'ease-in',
		dots: true,
		fade: true
	});

	$('.events-slider').slick({
		arrows: false,
		variableWidth: true
	});

	$('.books-slider').slick({
		arrows: false,
		dots: true,
		slidesToShow: 2,
		slidesToScroll: 2,
		variableWidth: true,
		responsive: [
			{
				breakpoint: 750,
				settings: {
					centerMode: true,
					infinite: false
				}
			},
			{
				breakpoint: 1150,
				settings: {
					centerMode: false,
					slidesToScroll: 1
				}
			}
		]
	});
	$('.books-popular-slider').slick({
		arrows: false,
		slidesToShow: 6,
		slideToScroll: 6,
		variableWidth: true,
		responsive: [
			{
				breakpoint: 1360,
				settings: {
					infinite: true,
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});
	$('.articles-slider').slick({
		arrows: false,
		dots: true,
		infinite: true,
		slidesToShow: 2,
		slidesToScroll: 2,
		responsive: [
			{
				breakpoint: 750,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});
	$('.about-slider, .events-slider, .books-slider, .books-popular-slider, .articles-slider, #map').fadeIn(500).removeClass('hidden');
});