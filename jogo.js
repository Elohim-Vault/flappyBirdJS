console.log("Bem-vindo ao meu flappy bird");
const som_hit = new Audio();
const sprites = new Image();
let frame = 0;
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
    atualiza(){
        const movimentoDoChao = 1;
        const repeteEm = chao.largura / 2;
        const movimentacao = chao.x - movimentoDoChao;
        chao.x = movimentacao % repeteEm
        },

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

// [Cano]
const cano = {
    largura: 52,
    altura: 400,
    chao: {
        spriteX: 0,
        spriteY: 169,
    },
    ceu: {
        spriteX: 52,
        spriteY: 169
    },
    espaco: 80,
    pares: [],
    reinicia(){
        cano.pares.shift()
        cano.pares.shift()
        cano.pares.shift()
    },
    desenha() {
        cano.pares.forEach(function (par){
            let randomY = par.y
            const espacamentoEntreCanos = 80;
            const canoCeuX = par.x;
            const canoCeuY = randomY;
            contexto.drawImage(
                sprites,
                cano.ceu.spriteX, cano.ceu.spriteY,
                cano.largura, cano.altura,
                canoCeuX, canoCeuY,
                cano.largura, cano.altura
            );
            const canoChaoX = par.x
            const canoChaoY = cano.altura + espacamentoEntreCanos + randomY;
            contexto.drawImage(
                sprites,
                cano.chao.spriteX, cano.chao.spriteY,
                cano.largura, cano.altura,
                canoChaoX, canoChaoY,
                cano.largura, cano.altura
            );

            par.canoCeu = {
                x: canoCeuX,
                y: cano.altura + canoCeuY
            }

            par.canoChao = {
                x: canoChaoX,
                y: canoChaoY
            }
            
        });
    },
    temColisaoComOFlappyBird(par){
        const cabecaDoFlappy = flappyBird.y;
        const peDoFlappy = flappyBird.y + flappyBird.altura;
        
        if(flappyBird.x + flappyBird.largura >= par.x){
            if(cabecaDoFlappy <= par.canoCeu.y){
                return true
            }

            if(peDoFlappy >= par.canoChao.y){
                return true
            }

            return false
        }
    },
    atualiza() {
        const passou100Frames = frame % 100 === 0
        if(passou100Frames){
            cano.pares.push({
                x: canvas.width + 100,
                y: -150 * (Math.random() + 1),
            }) 
            cano.desenha();
        }

        cano.pares.forEach(function (par){
            par.x -= 2
            
            if(cano.temColisaoComOFlappyBird(par)){
                // console.log("Você perdeu!")
                flappyBird.reinicia();
                cano.reinicia();
                mudaParaTela(Telas.INICIO)
            }

            else if(flappyBird.x == par.x + cano.largura){
                pontuacao.atribuirPonto(10);
            }

            if(par.x + cano.largura <= 0){
                cano.pares.shift()
            }
        });

    }   
}

const pontuacao = {
    ponto: 0,
    atribuirPonto(quantidade){
        pontuacao.ponto += quantidade
    },
    reinicia(){
        pontuacao.ponto = 0;
    }
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
    frameAtual: 0,
    movimentos: [
        { spriteX: 0, spriteY: 0},
        { spriteX: 0, spriteY: 26 },
        { spriteX: 0, spriteY: 52},
    ],
    atualizaOFrameAtual(){
        const intervaloDeFrame = 10;
        const passouOIntervalo = frame % intervaloDeFrame === 0;
        if(passouOIntervalo){
            const baseDoIncremento = 1
            const incremento = baseDoIncremento + flappyBird.frameAtual
            const baseRepeticao = flappyBird.movimentos.length
            flappyBird.frameAtual = incremento % baseRepeticao
        }
    },
    atualiza(){
        if(fazColisao(flappyBird, chao)){
            // som_hit.play()
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
        flappyBird.atualizaOFrameAtual();
        const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual]
        contexto.drawImage(
            sprites,
            spriteX, spriteY,
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
            cano.desenha();
            chao.desenha();
            flappyBird.desenha();
            menu.desenha();
        },

        click(){
            mudaParaTela(Telas.JOGO);
            pontuacao.reinicia()
        },

        atualiza(){
            chao.atualiza()
        }
    }
}

Telas.JOGO = {
    desenha(){
        planoDeFundo.desenha();
        cano.desenha();
        cano.atualiza();
        chao.desenha()
        flappyBird.desenha();
    },

    click(){
        flappyBird.pula();
    },

    atualiza(){
        flappyBird.atualiza();
        chao.atualiza()
    }
}

function loop(){
    telaAtiva.desenha();
    telaAtiva.atualiza();
    frame += 1
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