// API OPTIONS
const options = {
	method: 'GET',
	url: 'https://free-to-play-games-database.p.rapidapi.com/api/game',
	params: { id: '1' },
	headers: {
		'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
		'X-RapidAPI-Key':
			'3a60d8be74msh2c52c4cf188b0cep1cfe1fjsn43e75d3457a2',
	},
};

// ALL VARIABLES USED
const gameItemParent = document.querySelector('.container');
const nextPage = document.querySelector('.next-page');
const nextPageB = document.querySelector('#next-page');
const prevPage = document.querySelector('.prev-page');
const prevPageB = document.querySelector('#prev-page');
const pageNum = document.querySelectorAll('.page-num');

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

let canTurnPage = true;
let page = 1;

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

const obsOptions = {
	root: null,
	rootMargin: '0px',
	threshold: 0.5,
};

let observer = new IntersectionObserver(onChange, obsOptions);

function onChange(entries, obsOptions) {
	entries.forEach((entry) => {
		if (entry.intersectionRatio > 0) {
			displayScrolledElement(entry.target);
		} else {
			notInView(entry.target);
		}
	});
}

const observeItems = (animatedItem) => {
	animatedItem.forEach((el) => {
		observer.observe(el);
	});
};

// LOADING THE VISUAL DATA DYNAMICALLY ON BROWSE VIEW
const loadGameData = async (data) => {
	const gameItem = document.querySelectorAll('.game-item');
	if (gameItem.length > 0) {
		gameItem.forEach((el) => {
			el.remove();
		});
	}
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
	let gameItems = [];
	let count = 0;
	for (let i = startIndex; i < lastIndex; i++) {
		if (!(data[i] === undefined)) {
			let title = data[i].title;
			let imgURL = data[i].thumbnail;
			let gameID = data[i].id;

			const createGameItem = document.createElement('button');
			createGameItem.classList.add('game-item');
			createGameItem.classList.add('anim');
			createGameItem.classList.add('fade-anim');
			gameItemParent.append(createGameItem);
			gameItems.push(createGameItem);

			titleArr.push(title);
			gameItems[count].innerText = titleArr[count];
			createGameImg(gameItems[count], imgURL);
			titleSize(gameItems[count], titleArr[count]);
			gameItems[count].id = gameID;
			count++;
		} else {
			console.log(
				'There are no more games to display onto next page.'
			);
			canTurnPage = false;
			break;
		}
	}
	pageNum[0].innerText = 'Page: ' + page;
	pageNum[1].innerText = 'Page: ' + page;

	let animatedItem = document.querySelectorAll('.anim');
	observeItems(animatedItem);
	return data;
};

// CREATING, APPENDING, AND SETTING SRC OF THE GAME THUMBNAIL
const createGameImg = (el, imgURL) => {
	const img = document.createElement('img');
	img.src = imgURL;
	el.append(img);
};

// ADJUSTING FONT SIZE DEPENDING ON LENGTH OF TITLE OF GAME
const titleSize = (gameItem, gameTitle) => {
	if (gameTitle.length > 25) gameItem.style.fontSize = '10px';
	else if (gameTitle.length > 20) gameItem.style.fontSize = '12px';
	else if (gameTitle.length > 15) gameItem.style.fontSize = '15px';
};

// ADDING EVENT LISTENER TO EACH NEW GAME ITEM CREATED ON PAGE LOAD
const addGameSelectEvent = (currentGameItemList) =>
	currentGameItemList.forEach((el) => {
		el.addEventListener('click', function () {
			loadGameSelected(this);
		});
	});

// LOADING INITIAL DATA
document.addEventListener('DOMContentLoaded', async () => {
	// if (window.location.pathname === '/projects/Video_Game_Lister/browse.html') {
	let path = window.location.pathname;
	if (path.includes('browse')) {
		console.log('Correct Path!');
		await loadGameList();

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
			if (page === 1) return;
			prevPageFunc();
			loadGameList();
		});
		prevPageB.addEventListener('click', () => {
			if (page === 1) return;
			prevPageFunc();
			loadGameList();
		});

		// const gameItem = document.querySelectorAll('.game-item');
		// addGameSelectEvent(gameItem);

		// AUTOMATICALLY CREATING THE CATEGORY SELECT LIST OR I WOULD TAKE OVER 10 MIN JUST HARD CODING IT IN
		tagList.forEach((tag) => {
			const createOption = document.createElement('option');
			filterType.append(createOption);
			createOption.value = tag;
			createOption.innerText = tag;
		});

		filterType.addEventListener('change', function () {
			canTurnPage = true;

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
			canTurnPage = true;

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
		});
	}
	let animatedItem = document.querySelectorAll('.anim');
	observeItems(animatedItem);
});

const loadGameList = async () => {
	console.log('Filter by: ' + filterTagSelected);
	console.log('Platform: ' + filterPlatformSelected);
	try {
		const res = await axios.get(filteredURL, options);
		loadGameData(res.data);
	} catch (err) {
		console.log(err);
	}
	const gameItem = document.querySelectorAll('.game-item');
	addGameSelectEvent(gameItem);
};

// SHOW THE DETAILED INFO OF GAME SELECTED
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

	removePrevImgs();

	for (let i = 0; i < data.screenshots.length; i++) {
		let createImg = document.createElement('img');
		screenshotsParent.append(createImg);
		let screenshot = data.screenshots[i].image;
		createImg.src = screenshot;
		createImg.classList.add('game-screenshot');
	}
	return data;
};

const removePrevImgs = () => {
	while (screenshotsParent.firstChild) {
		screenshotsParent.removeChild(screenshotsParent.firstChild);
	}
};

const loadGameInfo = async function (el) {
	options.params = el.id;
	try {
		const res = await axios.get(
			`https://free-to-play-games-database.p.rapidapi.com/api/game?id=${options.params}`,
			options
		);
		gameDetails(res.data);
	} catch (err) {
		console.log(err);
	}
};

const nextPageFunc = () => {
	if (canTurnPage) {
		page++;
		console.log('Page: ' + page);
	} else console.log('No more games to display on next page!');
};
const prevPageFunc = () => {
	canTurnPage = true;
	if (page === 1) return;
	page--;
	console.log('Page: ' + page);
};

// FADE ANIMATION FUNCTIONS
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

toTop.addEventListener('click', () => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('click', (e) => {
	console.log(e.target);
});
