var plScore=0;
var dlScore=0;

window.addEventListener("load",function(){
	console.log("Start here");
	var suit = ["&spades;", "&clubs;", "&hearts;", "&diams;"];
	var picture = ["J", "Q", "K", "A"];

	window.deck = [];
		for(i=2;i<15;i++){
			suit.forEach(function(entry) {
				switch(i){
					case 11: deck.push([picture[0],entry]);
					break;
					case 12: deck.push([picture[1],entry]);
					break;
					case 13: deck.push([picture[2],entry]);
					break;
					case 14: deck.push([picture[3],entry]);
					break;
					default:deck.push([i,entry]);
					break;
				}
			});
		}

/*
	// Параметри тестування туза
	//Shuffle(deck);
	deck[3]=["A", "&clubs;"];
	deck[4]=["J", "&clubs;"];
	// Player and Dealer starting with 2 cards
	getCards(0,2);
	getCards(1,3);

*/


	Shuffle(deck);
	// Player and Dealer starting with 2 cards
	getCards(0,2);
	getCards(1,2);

});



function showCard(plOverflow){

	var allCards =$('.close');
	var dealerCards=$('.dealerCards span');
	var dealerScore=$('#dealerScore');
	dealerScore.css({"visibility":"visible"});
	dealerCards.css({"visibility":"visible"});
	allCards.removeClass("close").addClass("open");
	
	// Сховати кнопки, якщо гравцю досить карт
	var buttonsLine=$('.line');
	buttonsLine.css({"visibility":"hidden"});
	if(!plOverflow)	dealerAI();
}

function dealerAI(){
	while(dlScore<17){
	getCards(0,1);
	
	// чутка неправильна логы
	//if(dlScore>21) msgAboutEndTheGame("Диллер совершил перебор.");
	}
	//if( (dlScore>=plScore) || (plScore>21) )msgAboutEndTheGame("Fatality :(");
	//else msgAboutEndTheGame("Flawless victory!");
	
}

function Shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

function getCards (targetPlayer, cnt) {
	console.log("getCards print");
	var plCards=[];
	var dlCards=[];
	var div1;
	if(targetPlayer==0){ //для діллєра
		div1 = $('.dealerCards');
		// console.log(div1);

		for(i=0;cnt!==0;cnt--,i++){
			var closeCard = $('<div class="close" align="left">');
			var str="<span style=\"visibility:hidden\">"+deck[cnt]+"</span>";
			str = str.replace(/,/g, ""); // видаляю кому, яка вилізла тому, що воно перевело deck[cnt] в строку
			closeCard.html(str);

			//closeCard.html("<span style=\"visibility:hidden\">"+deck[cnt]+"</span>");
			//~ closeCard.html("<span style=\"visibility:visible\">"+deck[cnt]+"</span>");

			// console.log(closeCard);
			div1.append(closeCard);
			// console.log(deck[cnt]);
			dlCards[i]=deck[cnt];
			deck.splice(cnt,1);
		}

		// HERE FIX TODO !!!
		getScore(0,dlCards);
	}

	else{
		div1 = $('.playerCards');
		// console.log(div1);		

		for(i=0;cnt!==0;cnt--,i++){
			var openCard = $('<div class="open" align="left">');
			openCard.html(deck[cnt]);
			plCards[i]=deck[cnt];
			div1.append(openCard);

			//~ splice start item del mass items
			deck.splice(cnt,1);
		}

		getScore(1,plCards);
		if(plScore>21){
			showCard(true);
			//msgAboutEndTheGame("У вас перебор.");
		}
	}
}

function getScore(targetPlayer,arrCards){
	var index = arrCards.length;
			var tmp=0;
			var parent,span;

			for(var i=0;i<index;i++){
				var varietyFlag=false;
				var card = arrCards[i][0];
				switch(card){
					default:card = arrCards[i][0];
					break;
					case "J":card = 10;
					break;
					case "Q":card = 10;
					break;
					case "K": card = 10;
					break;
					case "A": card = 11;varietyFlag=true;
					break;
				}
				// card = arrCards[i][0];

				// Вибір очків туза 11 чи 1
				if( (varietyFlag==true) && (tmp+11>21) ) card = 1;
				tmp=tmp+card;
			}
			if(targetPlayer==0){
				dlScore=dlScore+tmp;
				console.log("dlScore",dlScore);

				parent = $('#dealerScore');
				span = $('#count0');
				span.html(dlScore);
				parent.append(span);
			}
			else{
				plScore=plScore+tmp;
				console.log("plScore",plScore);
				//adding Score
				parent = $('#playerScore');
				span = $('#count1');
				span.html(plScore);
				parent.append(span);
			}
}

function msgAboutEndTheGame (text){
	if (confirm(text + " Начать новую игру?")) { 
		location.reload(true);
	}
	else {
		window.close();
	}
}