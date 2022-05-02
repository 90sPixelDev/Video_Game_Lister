// API OPTIONS
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
		'X-RapidAPI-Key': '3a60d8be74msh2c52c4cf188b0cep1cfe1fjsn43e75d3457a2',
	},
};

// ALL VARIABLES USED
const gameItem = document.querySelectorAll('.game-item');
const animatedItem = document.querySelectorAll('.anim');
const nextPage = document.querySelector('.next-page');
const nextPageB = document.querySelector('#next-page');
const prevPage = document.querySelector('.prev-page');
const prevPageB = document.querySelector('#prev-page');
const pageNum = document.querySelectorAll('.page-holder p');
const toTop = document.querySelector('.to-top');
let page = 1;

// LOADING THE VISUAL DATA DYNAMICALLY
const loadGameList = (data) => {
	if (gameItem === undefined) return;
	let lastIndex;
	let startIndex;
	if (page === 1) {
		startIndex = 0;
		lastIndex = 15;
	}
	startIndex = (page - 1) * 15;
	lastIndex = 15 * page;
	let titleArr = [];
	let count = 0;
	console.log('startIndex: ' + startIndex);
	console.log('lastIndex: ' + lastIndex);
	for (let i = startIndex; i < lastIndex; i++) {
		let title = data[i].title;
		let imgURL = data[i].thumbnail;
		titleArr.push(title);
		gameItem[count].innerText = titleArr[count];
		createGameImg(gameItem[count], imgURL);
		titleSize(gameItem[count], titleArr[count]);
		count++;
	}
	pageNum[0].innerText = page;
	pageNum[1].innerText = page;

	animatedItem.forEach((el) => {
		notInView(el);
	});
};

const playPageAnim = () => {};

const createGameImg = (el, imgURL) => {
	const img = document.createElement('img');
	img.src = imgURL;
	el.append(img);
};

const titleSize = (gameItem, gameTitle) => {
	let textSize = window.getComputedStyle(gameItem, null).getPropertyValue('font-size');
	if (gameTitle.length > 15) gameItem.style.fontSize = '15px';
	else if (gameTitle.length > 20) gameItem.style.fontSize = '10px';
};

const checkStatus = (response) => {
	if (!response.ok) throw new Error('Something went wrong');
	console.log('Status: OK');
	return response.json();
};

// LOADING INITIAL DATA
fetch('https://free-to-play-games-database.p.rapidapi.com/api/games', options)
	.then(checkStatus)
	.then((data) => {
		console.log(data);
		return data;
	})
	.then(loadGameList)
	.catch((err) => console.error(err));

// CHANGING PAGES AND LOADING DATA
nextPage.addEventListener('click', () => {
	nextPageFunc();
	fetch('https://free-to-play-games-database.p.rapidapi.com/api/games', options)
		.then(checkStatus)
		.then(loadGameList);
});
nextPageB.addEventListener('click', () => {
	nextPageFunc();
	fetch('https://free-to-play-games-database.p.rapidapi.com/api/games', options)
		.then(checkStatus)
		.then(loadGameList);
});
prevPage.addEventListener('click', () => {
	prevPageFunc();
	console.log('Page: ' + page);
	fetch('https://free-to-play-games-database.p.rapidapi.com/api/games', options)
		.then(checkStatus)
		.then(loadGameList);
});
prevPageB.addEventListener('click', () => {
	prevPageFunc();
	console.log('Page: ' + page);
	fetch('https://free-to-play-games-database.p.rapidapi.com/api/games', options)
		.then(checkStatus)
		.then(loadGameList);
});

const nextPageFunc = () => {
	console.log('Pressed the next page!');
	page++;
	console.log('Page: ' + page);
};
const prevPageFunc = () => {
	if (page === 1) return;
	console.log('Pressed the previous page!');
	page--;
};

// FADE ANIMATION FUNCTIONS
const elementInView = (el, scrollOffset) => {
	const elementTop = el.getBoundingClientRect().top;

	if (
		elementTop >=
			(Window.innerHeight || document.documentElement.clientHeight) - scrollOffset ||
		elementTop <= -scrollOffset
	)
		return false;
	else return true;
};

const scrollAnimManager = () => {
	animatedItem.forEach((el) => {
		if (elementInView(el, 100)) {
			displayScrolledElement(el);
		} else notInView(el);
	});
};

const displayScrolledElement = (el) => {
	if (el.classList.contains('anim')) {
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

// 	SCROLL TO TOP FUNCTIONS
const scrollTop = () => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
};

toTop.addEventListener('click', () => {
	scrollTop();
});
