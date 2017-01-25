$('document').ready(function(){
	var gameStatus = {};
	
	$('.back').click(function(){
		var obj = $(this).parents('.page');
		obj.fadeOut(1000);
		gameStatus.fadeHndlto = setTimeout(function(){
			$('#firstPage').fadeIn();
		},800);
	});
	
	$('#p1').click(function(){
		var obj = $(this).parents('.page');
		obj.fadeOut(1000);
		gameStatus.fadeHndlto = setTimeout(function(){
			$('#singleUser').fadeIn();
		},800);
	});

	$('#p2').click(function(){
		var obj = $(this).parents('.page');
		obj.fadeOut(1000);
		gameStatus.fadeHndlto = setTimeout(function(){
			$('#biUser').fadeIn();
		},800);
	});
	
	function init(){
		gameStatus.turn = true;
		gameStatus.score = [0,0];
		gameStatus.keys = [0,0,0,0,0,0,0,0,0];
		gameStatus.permu = ['','',''];
		$('.key').removeClass('off');	
		$('.key').removeClass('blackBack');	
		$('.key').text('');
		$('#score1').text(gameStatus.score[0]);
		$('#score2').text(gameStatus.score[1]);	
		$('.hint1').show();
		$('.hint2').hide();
	}

	$('.xo').click(function(){
		var obj = $(this).parents('.page');
		obj.fadeOut(1000);
		gameStatus.fadeHndlto = setTimeout(function(){
			$('#chessBoard').fadeIn();
		},800);
		init();//初始化gameStatus的各项值
	});	
	
	$('#reset').click(function(){
		var obj = $(this).parents('.page');
		obj.fadeOut(1000);
		gameStatus.fadeHndlto = setTimeout(function(){
			$('#firstPage').fadeIn();
		},800);
	});
	
	gameStatus.xo = ['X','O'];
	gameStatus.turn = true;//true for first player,else for another
	gameStatus.score = [0,0];//first for player1,second for another
	gameStatus.keys = [0,0,0,0,0,0,0,0,0];
	gameStatus.names = ['Player1','Computer'];
	gameStatus.startTurn = true;//指示当前局谁先手。true为选手1.第一局时，选手1先开始走，下一轮换手先下.
	
	function checkWin(){
		var win = false;
		for(var i=0;i<9;i=i+3){		//check for every row
			if(gameStatus.keys[i] != 0 &&  gameStatus.keys[i] == gameStatus.keys[i+1] && gameStatus.keys[i+2] == gameStatus.keys[i+1] ){
				win = true;
				var rowID = i/3+1;
				gameStatus.permu = ['k'+rowID+'1','k'+rowID+'2','k'+rowID+'3'];
				return win;
			}
		}
		for(var i=0;i<3;i++){		//check for every colomn
			if(gameStatus.keys[i] != 0 && gameStatus.keys[i] == gameStatus.keys[i+3] && gameStatus.keys[i+3] == gameStatus.keys[i+6]){
				win = true;
				var colomnID = i+1;
				gameStatus.permu = ['k'+'1'+colomnID,'k'+'2'+colomnID,'k'+'3'+colomnID];
				return win;
			}
		}		
		if(gameStatus.keys[0] != 0 && gameStatus.keys[0] == gameStatus.keys[4] && gameStatus.keys[4] == gameStatus.keys[8]){
				win = true;
				gameStatus.permu = ['k11','k22','k33'];
				return win;
			}
		if(gameStatus.keys[2] != 0 && gameStatus.keys[2] == gameStatus.keys[4] && gameStatus.keys[4] == gameStatus.keys[6]){
				win = true;
				gameStatus.permu = ['k13','k22','k31'];
				return win;
			}			
		return false;
	}
	function checkFull(){
		var flag = true;
		for(var i=0;i<gameStatus.keys.length;i++){
			if(gameStatus.keys[i] == 0){
				flag = false;
				break;
			}
		}
		return flag;
	}
	function startRound(){
		for(var i=0;i<9;i++){
			gameStatus.keys[i] = 0;
		}
		$('.key').removeClass('off');
		gameStatus.permu = ['','',''];
		$('.key').text('');
		$('.key').removeClass('blackBack');
		$('#score1').text(gameStatus.score[0]);
		$('#score2').text(gameStatus.score[1]);	
		if(gameStatus.startTurn){//上一局为选手1先走
				$('.hint2').show();
				gameStatus.turn = false;
			}else{
				$('.hint1').show();
				gameStatus.turn = true;
			}
		gameStatus.startTurn = !gameStatus.startTurn;
		gameStatus.winHndl = setTimeout(function(){
			$('#over').fadeOut(1000);
		},1000);
		if(gameStatus.single && !gameStatus.startTurn){//若为单机模式且这局电脑先下，为电脑下棋
			gameStatus.comHndl = setTimeout(goCom,2000);
		}
	}
	
	function showWin(){
		for(var i=0;i<3;i++){
			$('#'+gameStatus.permu[i]).addClass('blackBack');
		}
		$('.hint1').hide();
		$('.hint2').hide();			
		gameStatus.winHndl = setTimeout(function(){
			if(gameStatus.turn){//此时已经在count()中改过rurn，因此取反
				$('#roundOver').text(gameStatus.names[1]+' Wins!!:D');
			}else{
				$('#roundOver').text(gameStatus.names[0]+' Wins!!:D');
			}
			$('#over').fadeIn(500);
			gameStatus.roundHndl = setTimeout(function(){
				startRound();
			},500);
		},500);
	}
	
	function showDraw(){
		$('.hint1').hide();
		$('.hint2').hide();			
		gameStatus.winHndl = setTimeout(function(){			
			$('#roundOver').text('This is A Draw!!');			
			$('#over').fadeIn(500);
			gameStatus.roundHndl = setTimeout(function(){
				startRound();
			},500);
		},500);
	}

	function getMove(weight,oddFlag){
		//oddFlag = !oddFlag;
		var rezult = {score:0,position:0};
		var scores = [];
		var keys = gameStatus.keys;
		
		var keyOf0 = [];
		for(var i=0;i<9;i++){
			if(keys[i] == 0){
				keyOf0.push(i);
			}
		}
		var k = keyOf0.length;
		if(k == 0){
			rezult = {score:0,position:0}
			return rezult;
		}	
			
		var temScore = 0;
		
		if(oddFlag){
			for(var j=0;j<k;j++){
				keys[keyOf0[j]] = 2;
				if(checkWinA()){
					temScore = weight;
				}else{
					var temRezult = getMove(weight/10,false);
					temScore = temRezult.score;
				}
				keys[keyOf0[j]] = 0;	
				scores.push(temScore);		
			}
			rezult.score = Math.max.apply(null,scores);
			var num = scores.indexOf(rezult.score);
			rezult.position = keyOf0[num];
			if(weight == 100000){
				//如果score==0，且有多个同等解(理性情况下，都会走出平局)，选择下在没有自己子的行或列上。
				if(rezult.score == 0){
						var keyOfSame = [];
						for(var m=0;m<k;m++){
							if(scores[m] == rezult.score){
								keyOfSame.push(keyOf0[m]);
							}
						}			
						var n = keyOfSame.length;
						if(n>1){
							var evaluation = [];
							var maxEva = -100;
							var choosen = [];
							for(var j=0;j<n;j++){
								var temp = evaluate(keyOfSame[j]);
								evaluation.push(temp);
								if(temp > maxEva){
									maxEva = temp;
									choosen = [];
									choosen.push(keyOfSame[j]);
								}else if(temp == maxEva){
									choosen.push(keyOfSame[j]);
								}
							}
							var maxN = choosen.length;
							if(maxN > 1){
								var posi = choosen[Math.round(Math.random()*maxN)];
								rezult.position = posi;							
							}
						}
				}
			}
			return rezult;
		}else{
			for(var j=0;j<k;j++){		
				keys[keyOf0[j]] = 1;
				if(checkWinA()){
					temScore = weight*(-1);
				}else{
					var temRezult = getMove(weight/10,true);
					temScore = temRezult.score;
				}
				keys[keyOf0[j]] = 0;	
				scores.push(temScore);	
			}	
			rezult.score = Math.min.apply(null,scores);
			var num = scores.indexOf(rezult.score);
			rezult.position = keyOf0[num];
			return rezult;
		}
		
	function checkWinA(){
		var win = false;
		for(var i=0;i<9;i=i+3){		//check for every row
			if(keys[i] != 0 &&  keys[i] == keys[i+1] && keys[i+2] == keys[i+1] ){
				win = true;
				return win;
			}
		}
		for(var i=0;i<3;i++){		//check for every colomn
			if(keys[i] != 0 && keys[i] == keys[i+3] && keys[i+3] == keys[i+6]){
				win = true;
				return win;
			}
		}		
		if(keys[0] != 0 && keys[0] == keys[4] && keys[4] == keys[8]){
				win = true;
				return win;
			}
		if(keys[2] != 0 && keys[2] == keys[4] && keys[4] == keys[6]){
				win = true;
				return win;
			}			
		return false;
	}	
	function evaluate(key){
		var score = 0;
		var pattern = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8]];
	
		for(var i=0;i<pattern.length;i++){
			if(pattern[i].includes(key)){
				for(var j=0;j<pattern[i].length;j++){
						if(keys[pattern[i][j]] == 2){
							score -= 10;		
						}				
				}	
			}			
		}
		return score;
	}	
	}
	
	function goCom(){
		$('.key').addClass('off');
		var weight = 100000;
		if(!gameStatus.keys.includes(1) && !gameStatus.keys.includes(2)){
			var i = Math.round(Math.random()*8);
		}else{
			var ii = getMove(weight,true);
			var i = ii.position;
		}
		//var i = 3;
		var idMove = 'k' + (Math.floor(i/3)+1) + (i%3+1);
		$('#'+idMove).text(gameStatus.xo[gameStatus.player2shape]);
		gameStatus.keys[i] = 2;
		if(checkWin()){
				$('.key').addClass('off');
				gameStatus.score[1]++;
				gameStatus.turn = !gameStatus.turn;
				showWin();				
		}else if(checkFull()){
				showDraw();		
		}else{
			gameStatus.comHndl = setTimeout(function(){
				gameStatus.turn = !gameStatus.turn;
				$('.hint2').hide();
				$('.hint1').show();
				$('.key').removeClass('off');
			},500);			
		}
	}
	
	function count(obj){
		if(gameStatus.single){	
					obj.text(gameStatus.xo[gameStatus.player1shape]);
					var i = obj.attr('value');
					gameStatus.keys[i] = 1;//此键为选手1所下
					if(checkWin()){//选手1获胜
						$('.key').addClass('off');
						gameStatus.score[0]++;
						gameStatus.turn = !gameStatus.turn;
						showWin();
					}else if(checkFull()){//平局
						showDraw();			
					}else{//切换选手下子
						gameStatus.turn = !gameStatus.turn;
						$('.hint1').hide();
						$('.hint2').show();
						$('.key').addClass('off');
						gameStatus.comHndl = setTimeout(goCom,500);
					}			
		}else{	
					if(gameStatus.turn){
						obj.text(gameStatus.xo[gameStatus.player1shape]);
						var i = obj.attr('value');
						gameStatus.keys[i] = 1;//此键为选手1所下
						if(checkWin()){//选手1获胜
							$('.key').addClass('off');
							gameStatus.score[0]++;
							gameStatus.turn = !gameStatus.turn;
							showWin();
						}else if(checkFull()){//平局
							showDraw();			
						}else{//切换选手下子
							gameStatus.turn = !gameStatus.turn;
							$('.hint1').hide();
							$('.hint2').show();
						}						
					}else{
						obj.text(gameStatus.xo[gameStatus.player2shape]);
						var i = obj.attr('value');
						gameStatus.keys[i] = 2;//此键为选手2所下
						if(checkWin()){//选手2获胜
							$('.key').addClass('off');
							gameStatus.score[1]++;
							gameStatus.turn = !gameStatus.turn;
							showWin();				
						}else if(checkFull()){//平局
							showDraw();			
						}else{//切换选手下子
							gameStatus.turn = !gameStatus.turn;
							$('.hint2').hide();
							$('.hint1').show();
						}
					}
		}
	}
	
	$('#p1').click(function(){
		gameStatus.names = ['Player1','Computer'];
		gameStatus.single = true;//单人模式
		$('#name2').text('Computer');
		$('#p1name').text('Your turn!');
		$('#p2name').text('Computer\'s turn!');		
	});
	
	$('#p2').click(function(){
		gameStatus.names = ['Player1','Player2'];
		gameStatus.single = false;
		$('#name2').text('Player2');
		$('#p1name').text('Go Player1!');
		$('#p2name').text('Go Player2!');
	});
	
	$('.x').click(function(){
		gameStatus.player1shape = 0;
		gameStatus.player2shape = 1;
	});
	
	$('.o').click(function(){
		gameStatus.player1shape = 1;
		gameStatus.player2shape = 0;
	});	
	
	$('.key').click(function(){
		var obj = $(this);	
		var n = obj.attr('value');
		if(gameStatus.keys[n] == 0){
			count(obj);
		}
	});
	
});