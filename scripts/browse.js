const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
		'X-RapidAPI-Key': '3a60d8be74msh2c52c4cf188b0cep1cfe1fjsn43e75d3457a2',
	},
};

const gameItem = document.querySelectorAll('.game-item');
const nextPage = document.querySelector('.next-page');
const prevPage = document.querySelector('.prev-page');
const pageNum = document.querySelectorAll('.page-holder p');
let page = 1;

const loadGameList = (data) => {
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
};

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

fetch('https://free-to-play-games-database.p.rapidapi.com/api/games', options)
	.then(checkStatus)
	.then((data) => {
		console.log(data);
		return data;
	})
	.then(loadGameList)
	.catch((err) => console.error(err));

nextPage.addEventListener('click', () => {
	console.log('Pressed the next page!');
	page++;
	console.log('Page: ' + page);
	fetch('https://free-to-play-games-database.p.rapidapi.com/api/games', options)
		.then(checkStatus)
		.then(loadGameList);
});
prevPage.addEventListener('click', () => {
	if (page === 1) return;
	console.log('Pressed the previous page!');
	page--;
	console.log('Page: ' + page);
	fetch('https://free-to-play-games-database.p.rapidapi.com/api/games', options)
		.then(checkStatus)
		.then(loadGameList);
});
