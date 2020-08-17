console.log("Bem-vindo ao meu flappy bird");
const som_hit = new Audio();
const sprites = new Image();
sprites.src = "sprites.png";
som_hit.src = "./efeitos/hit.wav";

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

//[planoDeFundo]
const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,

    desenha(){
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height )
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        )

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x + planoDeFundo.largura, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        )
    }

}
// [Chão]
const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,

    desenha(){
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            chao.x, chao.y,
            chao.largura, chao.altura,
        );

        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            chao.x + chao.largura, chao.y,
            chao.largura, chao.altura,
        );
    }
}
// [Menu]
const menu = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 30,

    desenha(){
        contexto.drawImage(
            sprites,
            menu.spriteX, menu.spriteY,
            menu.largura, menu.altura,
            menu.x, menu.y,
            menu.largura, menu.altura
        )
    }
}

function fazColisao(flappyBird, chao){
    if(flappyBird.y  + flappyBird.altura >= chao.y){
        return true
    }
    return false
}


// [Passaro]
const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    gravidade: 0.25,
    velocidade: 0, 
    pulo: 4.6,
    atualiza(){
        if(fazColisao(flappyBird, chao)){
            som_hit.play()
            setTimeout(function(){
                mudaParaTela(Telas.INICIO)
                flappyBird.reinicia();
            }, 500);

            
        }else{
            flappyBird.velocidade += flappyBird.gravidade
            flappyBird.y += flappyBird.velocidade
        }
    },

    pula(){
        flappyBird.velocidade = -flappyBird.pulo
    },

    desenha(){
        contexto.drawImage(
            sprites,
            flappyBird.spriteX, flappyBird.spriteY,
            flappyBird.largura, flappyBird.altura, // Tamanho do recorte da sprite
            flappyBird.x, flappyBird.y, // Posição X e Y
            flappyBird.largura, flappyBird.altura // Largura e altura da imagem 
        );
    },
    
    reinicia(){
        flappyBird.x = 10
        flappyBird.y = 50
        flappyBird.gravidade = 0.25
        flappyBird.velocidade = 0,
        flappyBird.pulo = 4.6
    },
}

let telaAtiva = {};
function mudaParaTela(tela){
    telaAtiva = tela 
}
const Telas = {
    INICIO: {
        desenha(){
            planoDeFundo.desenha();
            chao.desenha();
            flappyBird.desenha();
            menu.desenha();
        },

        click(){
            mudaParaTela(Telas.JOGO);
        },

        atualiza(){

        }
    }
}

Telas.JOGO = {
    desenha(){
        planoDeFundo.desenha();
        chao.desenha();
        flappyBird.desenha();
    },

    click(){
        flappyBird.pula();
    },

    atualiza(){
        flappyBird.atualiza();
    }
}

function loop(){
    telaAtiva.desenha();
    telaAtiva.atualiza();

    requestAnimationFrame(loop) // Ajuda a gente a desenhar os quadros na tela. FPS!!
}

window.addEventListener('click', function(){
    if(telaAtiva.click){
        telaAtiva.click();
    }
    console.log('Clickado lixxo')
});
mudaParaTela(Telas.INICIO);
loop()