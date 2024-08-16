// API OPTIONS
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
		'X-RapidAPI-Key':
			'3a60d8be74msh2c52c4cf188b0cep1cfe1fjsn43e75d3457a2',
	},
};

// ALL VARIABLES USED
const gameItemParent = document.querySelector('.container');
const gameItem = document.querySelectorAll('.game-item');
let animatedItem = document.querySelectorAll('.anim');
const nextPage = document.querySelector('.next-page');
const nextPageB = document.querySelector('#next-page');
const prevPage = document.querySelector('.prev-page');
const prevPageB = document.querySelector('#prev-page');
const pageNum = document.querySelectorAll('.page-holder p');
const toTop = document.querySelector('.to-top');

const topElements = document.querySelector('.top');
const gameList = document.querySelector('.games');
const bottomElements = document.querySelector('.bottom');
const gameElements = document.querySelector('.game');

const gameInfoImg = document.querySelector('.game-img');
const gameInfoTitle = document.querySelector('.game-title');
const gameInfoGenre = document.querySelector('.genre');
const gameInfoPlatform = document.querySelector('.platform');
const gameInfoDeveloper = document.querySelector('.developer');
const gameInfoReleaseDate = document.querySelector('.release-date');
const gameInfoDescription = document.querySelector('.description');
const gameScreenshots = document.querySelectorAll('.game-screenshot');
const screenshotsParent = document.querySelector('.game-screenshots');

const backBtn = document.querySelector('.back-btn');

const searchInput = document.querySelector('.search-game');
const searchType = document.querySelector('#search-type');
const searchBtn = document.querySelector('.search-btn');
const filterType = document.querySelector('#filter-type');
const filterPlatform = document.querySelector('#filter-platform');
let filterTagSelected = 'all';
let filterPlatformSelected = 'all';
let filteredURL =
	'https://free-to-play-games-database.p.rapidapi.com/api/games';

let page = 1;
let lastPage;

const tagList = [
	'all',
	'mmorpg',
	'shooter',
	'strategy',
	'moba',
	'racing',
	'sports',
	'social',
	'sandbox',
	'open-world',
	'survival',
	'pvp',
	'pve',
	'pixel',
	'voxel',
	'zombie',
	'turn-based',
	'first-person',
	'third-Person',
	'top-down',
	'tank',
	'space',
	'sailing',
	'side-scroller',
	'superhero',
	'permadeath',
	'card',
	'battle-royale',
	'mmo',
	'mmofps',
	'mmotps',
	'3d',
	'2d',
	'anime',
	'fantasy',
	'sci-fi',
	'fighting',
	'action-rpg',
	'action',
	'military',
	'martial-arts',
	'flight',
	'low-spec',
	'tower-defense',
	'horror',
	'mmorts',
];

// LOADING THE VISUAL DATA DYNAMICALLY ON BROWSE VIEW
const loadGameData = (data) => {
	if (gameItem === undefined) return;
	if (gameItemParent.children.length > 0) {
		// console.log('GameItems in Game Parent List!');
		gameItemParent.textContent = '';
	}

	console.log(data.length);
	const amtOfGames = data.length;
	console.log(`%cTotal Games: ${amtOfGames}`, 'color: #CD96CD');

	let lastIndex;
	let startIndex;
	let lastPage;
	const amtOfGamesPerPage = 16;

	lastPage = amtOfGames / amtOfGamesPerPage;
	if (lastPage % 1 != 0) {
		lastPage = Math.ceil(lastPage);
	}
	startIndex = (page - 1) * amtOfGamesPerPage;
	console.log('startIndex: ' + startIndex);
	lastIndex = amtOfGamesPerPage * page;
	if (page === 1) {
		startIndex = 0;
	}
	if (page === lastPage) {
		console.log('LAST PAGE!');
		lastIndex =
			Math.abs(
				amtOfGamesPerPage * lastPage -
					amtOfGames -
					amtOfGamesPerPage
			) + startIndex;
	}
	let titleArr = [];
	let count = 0;
	for (let i = startIndex; i < lastIndex; i++) {
		let title = data[i].title;
		let imgURL = data[i].thumbnail;
		let gameID = data[i].id;

		titleArr.push(title);
		createGameItem(titleArr[count], gameID, imgURL);

		count++;
	}

	pageNum[0].innerText = `Page: ${page}`;
	pageNum[1].innerText = `Page: ${page}`;

	animatedItem = document.querySelectorAll('.anim');
	scrollAnimManager();
};

// CREATING THE GAME ITEM PARENT BEFORE CREATING THE CHILD ELEMENT WITH THE GAME IMG
const createGameItem = (title, gameID, imgURL) => {
	const gI = document.createElement('button');
	gI.innerText = title;
	gI.id = gameID;
	gI.classList.add('game-item');
	gI.classList.add('anim');
	gI.classList.add('fade-anim');
	gameItemParent.append(gI);

	gI.addEventListener('click', function () {
		loadGameSelected(this);
	});

	createGameImg(gI, imgURL);
};

// CREATING, APPENDING, AND SETTING SRC OF THE GAME THUMBNAIL
const createGameImg = (el, imgURL) => {
	const img = document.createElement('img');
	img.src = imgURL;
	img.loading = 'lazy';
	el.append(img);
};

// ADJUSTING FONT SIZE DEPENDING ON LENGTH OF TITLE OF GAME
const titleSize = (gameItem, gameTitle) => {
	if (gameTitle.length > 25) gameItem.style.fontSize = '10px';
	else if (gameTitle.length > 22) gameItem.style.fontSize = '11px';
	else if (gameTitle.length > 20) gameItem.style.fontSize = '12px';
	else if (gameTitle.length > 15) gameItem.style.fontSize = '15px';
};

// CHECKING API CALL IS OK
const checkStatus = (response) => {
	if (!response.ok) throw new Error('Something went wrong ❌');
	console.log('%cStatus: OK ✅', 'color: lightgreen;');
	return response.json();
};

// LOADING INITIAL DATA
document.addEventListener('DOMContentLoaded', () => {
	if (window.location.pathname === '/browse.html') {
		loadGameList();

		// CHANGING PAGES AND LOADING DATA
		nextPage.addEventListener('click', () => {
			nextPageFunc();
			loadGameList();
		});
		nextPageB.addEventListener('click', () => {
			nextPageFunc();
			loadGameList();
		});
		prevPage.addEventListener('click', () => {
			prevPageFunc();
			loadGameList();
		});
		prevPageB.addEventListener('click', () => {
			prevPageFunc();
			loadGameList();
		});

		tagList.forEach((tag) => {
			const createOption = document.createElement('option');
			filterType.append(createOption);
			createOption.value = tag;
			createOption.innerText = tag;
		});

		filterType.addEventListener('change', function () {
			page = 1;
			if (this.value === 'all') {
				filteredURL = `https://free-to-play-games-database.p.rapidapi.com/api/games?platform=${filterPlatformSelected}`;
				loadGameList();
			} else if (
				this.value === 'all' &&
				filterPlatformSelected === 'all'
			) {
				filteredURL =
					'https://free-to-play-games-database.p.rapidapi.com/api/games';
				loadGameList();
			} else if (filterPlatformSelected === 'all') {
				console.log('Changed Category only!');
				filterTagSelected = this.value;
				console.log(filterTagSelected);
				filteredURL = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${this.value}`;
				loadGameList();
			} else {
				filterTagSelected = this.value;
				filteredURL = `https://free-to-play-games-database.p.rapidapi.com/api/games?platform=${filterPlatformSelected}&category=${this.value}`;
				loadGameList();
			}
		});
		filterPlatform.addEventListener('change', function () {
			console.log('Platform: ' + this.value);
			page = 1;
			if (this.value === 'all') {
				filteredURL = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${filterTagSelected}`;
				loadGameList();
			} else if (this.value === 'all' && filterTagSelected === 'all') {
				filteredURL =
					'https://free-to-play-games-database.p.rapidapi.com/api/games';
				loadGameList();
			} else if (filterTagSelected === 'all') {
				filterPlatformSelected = this.value;
				filteredURL = `https://free-to-play-games-database.p.rapidapi.com/api/games?platform=${this.value}`;
				loadGameList();
			} else {
				filterPlatformSelected = this.value;
				filteredURL = `https://free-to-play-games-database.p.rapidapi.com/api/games?platform=${this.value}&category=${filterTagSelected}`;
				loadGameList();
			}
		});

		backBtn.addEventListener('click', () => {
			topElements.style.display = 'block';
			gameList.style.display = 'flex';
			bottomElements.style.display = 'flex';

			gameElements.style.display = 'none';

			screenshotsParent.replaceChildren();

			console.log('Removed last game images in screenshot area!');
		});
	}
});
const loadGameList = () => {
	console.log(`%cFilter: ${filterTagSelected}`, 'color: pink;');
	console.log(`%cPlatform: ${filterPlatformSelected}`, 'color: pink;');
	fetch(filteredURL, options)
		.then(checkStatus)
		.then(loadGameData)
		.catch((err) => console.error(err));
};

const loadGameSelected = (el) => {
	console.log('Game Selected!');
	topElements.style.display = 'none';
	gameList.style.display = 'none';
	bottomElements.style.display = 'none';

	gameElements.style.display = 'block';
	loadGameInfo(el);
};

const gameDetails = (data) => {
	gameInfoImg.src = data.thumbnail;

	gameInfoTitle.innerText = data.title;
	gameInfoGenre.innerText = data.genre;
	gameInfoPlatform.innerText = data.platform;
	gameInfoDeveloper.innerText = data.developer;
	gameInfoReleaseDate.innerText = data.release_date;
	gameInfoDescription.innerText = data.short_description;

	// console.log(data.screenshots.length);

	for (let i = 0; i < data.screenshots.length; i++) {
		let createImg = document.createElement('img');
		screenshotsParent.append(createImg);
		let screenshot = data.screenshots[i].image;
		createImg.src = screenshot;
		createImg.classList.add('game-screenshot');
	}
	return data;
};

const loadGameInfo = function (el) {
	let elementId = el.id;
	fetch(
		`https://free-to-play-games-database.p.rapidapi.com/api/game?id=${elementId}`,
		options
	)
		.then(checkStatus)
		.then((data) => {
			console.log(data);
			return data;
		})
		.then(gameDetails);
};

const nextPageFunc = () => {
	if (page === lastPage || lastPage === undefined) return;
	page++;
};
const prevPageFunc = () => {
	if (page === 1) return;
	page--;
};

// FADE ANIMATION FUNCTIONS
const elementInView = (el, scrollOffset) => {
	const elementTop = el.getBoundingClientRect().top;

	if (
		elementTop >=
			(Window.innerHeight || document.documentElement.clientHeight) -
				scrollOffset ||
		elementTop <= -scrollOffset
	)
		return false;
	else return true;
};

const scrollAnimManager = () => {
	animatedItem.forEach((el) => {
		if (elementInView(el, 50)) {
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
toTop.addEventListener('click', () => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
});
