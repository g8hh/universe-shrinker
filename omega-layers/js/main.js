var dtOld = Date.now();
var dtNew = Date.now();
var minimizedLayer = 0;
let saveTimer = 0;
const INFINITY = Decimal.pow(2, 1024);

var app = new Vue({
    el: "#app",
    data: game,
    methods: functions,
    computed: computed,
    created: onCreate
});

function onCreate()
{
    functions.generateLayer(0);
    functions.setCurrentLayer(game.layers[0]);
    functions.loadGame();

    requestAnimationFrame(update);
}

function update()
{
    dtNew = Date.now();
    let dt = (dtNew - dtOld) / 1000;
    dtOld = Date.now();

    game.timeSpent += dt;
    saveTimer += dt;

    if(saveTimer > 30)
    {
        functions.saveGame();
    }

    if(game.layers[game.layers.length - 1].canGenerateNextLayer())
    {
        functions.generateLayer(game.layers.length);
    }

    if(game.currentChallenge && game.currentChallenge.isCompleted())
    {
        game.currentChallenge.succeed();
    }

    let numMinimizedLayers = 0;
    let minActiveLayer = game.settings.showMinLayers;
    let maxActiveLayer = game.layers.length - game.settings.showMaxLayers;

    //find out how many layers are minimized
    let currentId = game.currentLayer.layer;
    numMinimizedLayers = game.settings.showMinLayers + game.settings.showMaxLayers + (currentId > game.settings.showMinLayers && currentId < game.layers.length - game.settings.showMaxLayers ? 1 : 0);

    if(numMinimizedLayers < game.layers.length)
    {
        //if the layer is active, tick every frame
        for(let i = 0; i < game.layers.length; i++)
        {
            if(i < minActiveLayer || i >= maxActiveLayer || game.layers[i] === game.currentLayer)
            {
                game.layers[i].tick(dt);
            }
        }
        //increase and wrap the minimized layer
        //to increase performance, inactive layers only tick one at a time
        let layersAtOnce = game.settings.layerTickSpeed;
        for(let i = 0; i < layersAtOnce; i++)
        {
            minimizedLayer = (minimizedLayer + 1) % game.layers.length;
            while(minimizedLayer < minActiveLayer || minimizedLayer >= maxActiveLayer || game.layers[minimizedLayer] === game.currentLayer)
            {
                minimizedLayer = (minimizedLayer + 1) % game.layers.length;
            }
            //otherwise, tick with less resolution
            game.layers[minimizedLayer].tick(dt * numMinimizedLayers / layersAtOnce);
        }
    }
    else
    {
        for(let l of game.layers)
        {
            l.tick(dt);
        }
    }

    requestAnimationFrame(update);
}