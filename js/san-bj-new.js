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
	Shuffle(deck);
	// Player and Dealer starting with 2 cards
	getCards(0,2);
	getCards(1,2);

});

function showCard(plOverflow){

	var allCards = $('.close');
	// брав не те, адже після першого проходу ф-ції вже не всі карти діллєра - закриті.
	//var dealerCards=$('.dealerCards span');
	var dealerCards=$('.close span');
	var dealerScore=$('#dealerScore');
	dealerScore.css({"visibility":"visible"});

	var numClosed=allCards.length;
	var i=0;
	var timerId = setInterval(function() {
	        if (i>=numClosed){
	                clearInterval(timerId);
	        }
	        // код, що працює в таймері
	        var oneCard = allCards.eq(i);
	        var oneSpan = dealerCards.eq(i);
	        oneCard.removeClass("close").addClass("open");
	        //console.log("test", oneSpan);
	        setTimeout(function(){
	        	oneSpan.css({"visibility":"visible"});
	        },
	        100);
	        i++;
	}, 500 /* 0.5 сек */);

	// Сховати кнопки, якщо гравцю досить карт
	var buttonsLine=$('.line');
	buttonsLine.css({"visibility":"hidden"});

	// сет таймайт - один раз виконати.
	if(!plOverflow)	setTimeout(dealerAI, 900);
	//dealerAI();	

}

function dealerAI(){
	// setTimeout
	// clearTimeout
	var flag=0;
	var timerId1 = setInterval(function() {
	        if (dlScore<17){
	        	getCards(0,1);
	        	// false - у гравця не перебор, отже є сенс відкривати карти діллєра
				showCard(false);
	        }
	        else {
	        	flag=1;
	        	clearInterval(timerId1);
	        }
	}, 700);

	setTimeout(	function (){
		if(dlScore>21){
			endMsg("Диллер совершил перебор.");
			//return;
		}
		if(flag==1){
			if( (dlScore<=21) && (dlScore>=plScore) ){
				endMsg("Fatality :(");
			} 
			else endMsg("Flawless victory!");
		}
	},
	1500);

	// while(dlScore<17){
	// 	getCards(0,1);
	// 	// false - у гравця не перебор, отже є сенс відкривати карти діллєра
	// 	showCard(false);
	// }
		/* було всередині while if(dlScore>21) endMsg("Диллер совершил перебор."); */
	//}
	//if( (dlScore>=plScore) || (plScore>21) )endMsg("Fatality :(");
	//else endMsg("Flawless victory!");
	
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

		for(i=0;cnt!==0;cnt--,i++){
			var closeCard = $('<div class="close" align="left">');
			var str="<span style=\"visibility:hidden\">"+deck[cnt]+"</span>";
			str = str.replace(/,/g, ""); // видаляю кому, яка вилізла тому, що воно перевело deck[cnt] в строку
			closeCard.html(str);
			
			//closeCard.html("<span style=\"visibility:hidden\">"+deck[cnt]+"</span>");
			//~ closeCard.html("<span style=\"visibility:visible\">"+deck[cnt]+"</span>");

			div1.append(closeCard);
			dlCards[i]=deck[cnt];
			deck.splice(cnt,1);
		}
		getScore(0,dlCards);
	}

	else{

		div1 = $('.playerCards');
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
			endMsg("У вас перебор.");
			// нема сенсу при переборі
			//showCard(true);
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
					case "J":
					case "Q":
					case "K": card = 10;
					break;
					case "A": card = 11;varietyFlag=true;
					break;
				}

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

function endMsg (msg){
	if(confirm(msg + " Начать заново?")){ 
		location.reload(true);
	}
	else {
		$('body').html("<style = visibility:\"hidden\">");

		// firefox цього не робить
		//window.close();
	}
}
