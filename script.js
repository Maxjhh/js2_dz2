//Максим Варгин
//Записи добавляются при скролле вниз, картинки грузятся с сайта, (при наведении меняются), подробная инфа в сплывающем блоке

var POKLIM = 6; //Грузить записей за раз
var TOTALLIM = 802; //Предел записей на странице

var pokset = 0;
var upd = 0;
var j = 1;

window.onload = start();

function start() {
	var head = document.createElement('h1');
	head.classList.add('head');
	head.innerText = 'POK';
	document.body.appendChild(head);
	var poks = document.createElement('div');
	poks.classList.add('poks');
	document.body.appendChild(poks);
	var load = document.createElement('div');
	load.classList.add('load');
	load.innerText = 'Грузим...';
	document.body.appendChild(load);
	myReq(POKLIM, pokset);
}

function myReq(limit, offset){
	upd = 1;
	console.log("upd");
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/?limit=' + limit + '&offset=' + offset, true);
	xhr.timeout = 30000;
	xhr.ontimeout = function(){ 
		console.log('err'); 
		document.querySelector('.load').innerText = 'Ошибка';
	}
	xhr.send();
	xhr.onreadystatechange = function(){
		if(xhr.readyState === XMLHttpRequest.DONE){
			if (xhr.status === 200){
				onReady(JSON.parse(xhr.responseText).results);
			}
		}
	}
}

function detReq(e){
	e.preventDefault();
	var id = parseInt(e.target.parentElement.id.replace('pok', ''));
	console.log(id);

	var popup = document.createElement('div');
	popup.classList.add('popup');
	var popmes = document.createElement('div');
	popmes.classList.add('popmes');
	var clpop = document.createElement('div');
	clpop.classList.add('clpop');
	clpop.innerText = 'X';
	clpop.addEventListener('click', closePop);
	popmes.appendChild(clpop);
	var pophead = document.createElement('h2');
	pophead.classList.add('pophead');
	pophead.innerText = e.target.parentElement.childNodes[1].innerText.replace('Имя: ', '');
	popmes.appendChild(pophead);
	var popinfo = document.createElement('div');
	popinfo.classList.add('popinfo');
	var popload = document.createElement('p');
	popload.classList.add('popload');
	popload.innerText = 'Грузим...';
	popinfo.appendChild(popload);
	popmes.appendChild(popinfo);
	popup.appendChild(popmes);
	document.body.appendChild(popup);

	var xhr2 = new XMLHttpRequest();
	xhr2.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + id + '/', true);
	xhr2.timeout = 30000;
	xhr2.ontimeout = function(){
		console.log('err');
		popload.innerText = 'Ошибка';
	}
	xhr2.send();
	xhr2.onreadystatechange = function(){
		if(xhr2.readyState === XMLHttpRequest.DONE){
			if (xhr2.status === 200){
				var pok = JSON.parse(xhr2.responseText);
				console.log(pok);
				popload.parentElement.removeChild(popload);
				popinfo.innerHTML = '<b>Способности:</b><ul></ul>';
				for(var i = 0; i < pok.abilities.length; i++){
					popinfo.childNodes[1].innerHTML += '<li>' + pok.abilities[i].ability.name + '</li>';
					if(pok.abilities[i].is_hidden){ popinfo.childNodes[1].childNodes[i].innerText += ' (скрыто)'; }
					//popinfo.innerHTML += '</li>';
				}
				popinfo.innerHTML += 'Опыт: ' + pok.base_experience + '<br>Рост: ' + pok.height + '<br>Вес: ' + pok.weight + '<br>';
			}
		}
	}
}

function closePop(e){
	var popup = document.querySelector('.popup');
	document.body.removeChild(popup);
}

function imgOver(e){
	var id = parseInt(e.target.parentElement.id.replace('pok', ''));
	e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/' + id + '.png'
}

function imgOut(e){
	var id = parseInt(e.target.parentElement.id.replace('pok', ''));
	e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + id + '.png'
}

function onReady(pokmass){
console.log(pokmass);
	var poks = document.querySelector('.poks');
	var pok, id;
	for (var i = 0; (i < pokmass.length && j <= TOTALLIM); i++, j++){
		pok = document.createElement('div');
		pok.classList.add('pok');
		pok.id = 'pok' + j;

		id = document.createElement('p');
		id.innerText = 'Номер: ' + j;
		id.classList.add('pokid');
		pok.appendChild(id);

		nam = document.createElement('p');
		nam.innerText = 'Имя: ' + pokmass[i].name;
		nam.classList.add('poknam');
		pok.appendChild(nam);

		img = document.createElement('img');
		img.classList.add('pokimg');
		img.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + j + '.png';
		img.alt = 'Грузим...';
		img.addEventListener('mouseover', imgOver);
		img.addEventListener('mouseout', imgOut);
		pok.appendChild(img);

		detals = document.createElement('a');
		detals.href = '#';
		detals.innerText = 'Подробно';
		detals.classList.add('pokdetals');
		detals.addEventListener('click', detReq);
		pok.appendChild(detals);

		url = document.createElement('p');
		url.classList.add('pokurl');
		urla = document.createElement('a');
		urla.href = pokmass[i].url;
		urla.innerText = pokmass[i].url;
		url.innerText = 'URL: ';
		url.appendChild(urla);
		pok.appendChild(url);

		poks.appendChild(pok);
	}
	pokset += POKLIM;
	upd = 0;
	if(document.body.offsetHeight < window.innerHeight){
		myReq(POKLIM, pokset);
	}
}

window.onscroll = function(){
	if(window.scrollY > (document.body.offsetHeight - window.innerHeight - 100) && upd == 0){
		if(j <= TOTALLIM){ myReq(POKLIM, pokset); }
		else {
			var load = document.querySelector('.load'); 
			load.parentElement.removeChild(load);
		}
	}
}
