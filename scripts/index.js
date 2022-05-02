// ALL VARIABLES USED
const toTop = document.querySelector('.to-top');
const animatedEl = document.querySelectorAll('.anim');

toTop.addEventListener('click', () => {
	window.scroll({ top: '0', behavior: 'smooth' });
});

// ANIMATION FUNCTIONS
const elementInView = (el, scrollOffset) => {
	const elementTop = el.getBoundingClientRect().top;

	if (
		elementTop >=
			(Window.innerHeight || document.documentElement.clientHeight) - scrollOffset ||
		elementTop <= -100
	)
		return false;
	else return true;
};

const scrollAnimManager = () => {
	animatedEl.forEach((el) => {
		if (elementInView(el, 100)) {
			displayScrolledElement(el);
		} else notInView(el);
	});
};

const displayScrolledElement = (el) => {
	if (el.classList.contains('fade-anim')) {
		el.classList.add('fade-animated');
	}
	if (el.classList.contains('left-anim')) {
		el.classList.add('left-animated');
	}
	if (el.classList.contains('right-anim')) {
		el.classList.add('right-animated');
	}
	if (el.classList.contains('bottom-anim')) {
		el.classList.add('bottom-animated');
	}
};

const notInView = (el) => {
	if (el.classList.contains('fade-anim')) {
		el.classList.remove('fade-animated');
	}
	if (el.classList.contains('left-anim')) {
		el.classList.remove('left-animated');
	}
	if (el.classList.contains('right-anim')) {
		el.classList.remove('right-animated');
	}
	if (el.classList.contains('bottom-anim')) {
		el.classList.remove('bottom-animated');
	}
};

window.addEventListener('scroll', () => {
	scrollAnimManager();
});
