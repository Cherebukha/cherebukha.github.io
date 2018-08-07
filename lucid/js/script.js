$(document).ready(function(){
	$('.slider-picture').first().addClass('active');
	$('.slider-picture').hide();
	$('.active').show();

	$('#slider-right').click(function(){
		$('.active').removeClass('active').addClass('old-active');
		if ($('.old-active').is(':last-child')) {
			$('.slider-picture').first().addClass('active');
		} else {
			$('.old-active').next().addClass('active');
		}
		$('.old-active').removeClass('old-active');
		$('.slider-picture').fadeOut();
		$('.active').fadeIn();
	});

	$('#slider-left').click(function(){
		$('.active').removeClass('active').addClass('old-active');
		if ($('.old-active').is(':first-child')) {
			$('.slider-picture').last().addClass('active');
		} else {
			$('.old-active').prev().addClass('active');
		}
		$('.old-active').removeClass('old-active');
		$('.slider-picture').fadeOut();
		$('.active').fadeIn();
	});

	$('.about-image').click(function(){
		$('#overlay, #slider-left, #slider-wrapper, #slider-right').css({'visibility': 'visible'});
	});

	$('#overlay').click(function(){
		$('#overlay, #slider-left, #slider-wrapper, #slider-right').css({'visibility': 'hidden'});
	});
});