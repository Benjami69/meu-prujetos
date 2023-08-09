class Game{
    constructor(){
      this.botao = createButton("REINICIAR")
      this.titulo = createElement("h2");
      this.lugar1 = createElement("h2");
      this.lugar2 = createElement("h2");
      this.playerMoving = false
      this.esquerda = false;
      this.explodido = false;
        }
       posicionarElementos(){
       this.botao.position(width*0.66,100);
       this.titulo.position(width*0.33,100);
       this.lugar1.position(width*0.33,150);
       this.lugar2.position(width*0.33,200);
       this.titulo.html("Placar")
       this.botao.mousePressed(()=>{
         database.ref("/").set({
        carsAtEnd:0, gameState:0, playerCount:0, players:{}
         })
         window.location.reload();
       })
       }
    start(){
        //cria o objeto form da classe Form
        form = new Form();
        //chama o método exibir do formulário
        form.exibir();

        //cria uma instância de novo jogador
        player = new Player();
        player.getCount();

        car1 = createSprite(width/2-100, height-100)
        car1.addImage("carro", carimg1);
        car1.addImage("blast", explosao)
        car1.scale = 0.07;

        car2 = createSprite(width/2+100, height-100)
        car2.addImage("carro", carimg2);
        car2.addImage("blast", explosao)
        car2.scale = 0.07;
        //agrupa os carrinhos na mesma variável
        cars = [car1, car2];
        //criar o grupo das moedas
      coins = new Group()
      fuels = new Group()
      obs = new Group()
      var oPos = [
        {x:width/2 + 250, y: height - 800},
        {x:width/2 - 250, y: height - 1300},
        {x:width/2 + 250, y: height - 1800},
        {x:width/2 - 180, y: height - 2300}
      ]
      var oPos2 = [
        {x:width/2 - 180, y: height - 3300},
        {x:width/2 + 180, y: height - 3300},
        {x:width/2 + 250, y: height - 3800},
        {x:width/2 - 150, y: height - 4300}
      ]
      this.addSprites(coins, coinImg, 0.15, 30);
      this.addSprites(fuels, fuelImg, 0.17, 35);
      this.addSprites(obs, o1, 0.4,oPos.length, oPos);
      this.addSprites(obs, o2, 0.3,oPos2.length, oPos2);
    }

    showFuelBar(){
        push();
        image(fuelImg, width/2 -130, height - player.posY - 100, 20, 20)
        fill("#fff");
        rect(width/2 - 100, height - player.posY - 100, 185, 20);
        fill("#ffc400");
        rect(width/2 - 100, height - player.posY - 100, player.fuel, 20);
        pop();
       }
      showLifeBar(){
        push();
        image(lifeImg, width/2 -130, height - player.posY - 80, 20, 20);
        fill("#fff");
        rect(width/2 - 100, height - player.posY - 80 , 185, 20 );
        fill("#d42020");
        rect(width/2 - 100, height - player.posY - 80 , player.life, 20);
        pop();
      }
    mostrarPlacar(){
        var lugar1, lugar2;
        var players = Object.values(allPlayers)

        if(players[0].rank == 0 && players[1].rank == 0){
        lugar1 = players[0].rank 
        +"&emsp;"
        +players[0].nome
        +"&emsp;"
        +players[0].score

        lugar2 = players[1].rank
        +"&emsp;"
        +players[1].nome
        +"&emsp;"
        +players[1].score
        }

        if(players[0].rank == 1){
            lugar1 = players[0].rank
            +"&emsp;"
            +players[0].nome
            +"&emsp;"
            +players[0].score;

            lugar2 = players[1].rank
            +"&emps;"
            +players[1].nome
            +"&emsp;"
            +players[1].score
        }

        if(players[1].rank == 1){
            lugar1 = players[1].rank
            +"&emsp;"
            +players[1].nome
            +"&emsp;"
            +players[1].score;

            lugar2 = players[0].rank
            +"&emps;"
            +players[0].nome
            +"&emsp;"
            +players[0].score
        }
         this.lugar1.html(lugar1);
         this.lugar2.html(lugar2);

    }

addSprites(grupo, imagem, tamanho, quantidade){
    for(var i = 0; i < quantidade; i++){
        var x = random(width*0.33,width*0.66);
        var y = random(-height*4.5, height-100);
        var sprite = createSprite(x, y)
        sprite.addImage(imagem);
        sprite.scale = tamanho;
        grupo.add(sprite);
    }

}
    play(){
        form.esconder();
        Player.getInfo();
        player.getCarsAtEnd()
        this.posicionarElementos();
        if (allPlayers !== undefined){
            image (pista, 0, -height*4.5, width, height*6)
            var i = 0;
            for(var p in allPlayers){
                //pega o valor do banco de dados
                var x = allPlayers[p].posicaoX;
                var y = height - allPlayers[p].posicaoY;
                //atribui o valor na sprite do pc local
                cars[i].position.x = x;
                cars[i].position.y = y;
                i++;
                if(player.indice == i){
                    //definir a posição da câmera
                    camera.position.y = y;
                    textSize(25);
                    fill ("red");
                    textAlign("center");
                    text (allPlayers[p].nome,x, y-80 )
                    this.mostrarPlacar()
                    this.showFuelBar()
                    this.showLifeBar()
                    this.handleCoins(i);
                     var linhaChegada = height*5.3;
                     if(player.posY > linhaChegada){
                        player.rank++;
                        player.update();
                        Player.updateCarsAtEnd(player.rank);
                        gameState = 2;
                        this.gameOver();
                     }
                
                }
            }
            this.controlarCarro()
            drawSprites()
        }
        
    }

    controlarCarro(){
        if(!this.explodido){
        //checa se pressionou para cima
        if(keyDown(UP_ARROW)){
            player.posY += 10;
            this.playerMoving = true
            player.update();
        }
        if(keyDown(RIGHT_ARROW)){
            player.posX += 10;
            this.playerMoving = true
            player.update()     
            this.esquerda = false  
         }
         if(keyDown(LEFT_ARROW)){
            player.posX -= 10;
            this.playerMoving = true
            player.update()
            this.esquerda = true
         }
      }
    }
      
    //lê no banco de dados e copia o valor de gameState
    getState(){
        database.ref("gameState").on("value", function(data){
            gameState = data.val();
        })
    }

    //atualiza o valor de gameState 
    update(state){
        database.ref("/").update({
            gameState:state
        })
    }
 

    handleCoins(i){
        cars[i-1].overlap(coins, function(carro, collided){
          collided.remove()
          player.score++;
          player.update()
        });
        cars[i-1].overlap(fuels, function(carro, collided){
            collided.remove()

            player.fuel = 160;
            player.update()
          });
        if(player.fuel > 0 && this.playerMoving){
            player.fuel -=0.5
        }
        if(player.fuel <= 0){
            gameState = 2;
            this.gameOver();
        }
        if(cars[i-1].collide(obs)){
          this.perderVida(i)
        }
    }
    

     perderVida(i){
        if(player.life >= 1){
        player.life-=185/4; 
      }else{cars[i-1].changeImage("blast") 
            cars[i-1].scale = 0.7
            this.explodido = true;
            this.gameOver();
            
            
        }

      if(this.esqueda){
       player.posX += 100;
      }else{
        player.posX -= 100;
      }
      player.update()
      
     }

    gameOver(){
        if(player.fuel<=0 || player.life <= 1){
            swal({
            title:"Seu lixo kakakka , voce e um bosta ",
            text:"Voce esta em "+player.rank+"º lugar  ",
            imageUrl:"https://media.tenor.com/hXWq-c0gSXQAAAAM/funny-laugh.gif",
            imageSize:"200x200",
            confirmButtonText:"Ok!"
        })
        }else{
        swal({
            title:"GG meu mano, vc amassou o outor ",
            text:"Voce esta em "+player.rank+"º lugar 🐱‍👤",
            imageUrl:"https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Brazil/Blog%20Images%20PT/O%20Facebook%20finalmente%20aceita%20GIFs%2010%20formas%20de%20comemorar/giph-brazil.gif?width=645&name=giph-brazil.gif",
            imageSize:"300x300",
            confirmButtonText:"Ok!"
        })
    }
  
}

}