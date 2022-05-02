// ALL VARIABLES USED
const toTop = document.querySelector('.to-top');

toTop.addEventListener('click', () => {
	window.scroll({ top: '0', behavior: 'smooth' });
});
