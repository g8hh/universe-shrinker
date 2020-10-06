var functions = {
    formatNumber: function(n, prec, prec1000, lim = new Decimal(1000))
    {
        if(n.lt(lim))
        {
            let num = n.toNumber();
            if(num === -0) num = 0; //weird
            return num.toLocaleString("en-us", {minimumFractionDigits: prec1000, maximumFractionDigits: prec1000});
        }
        if(n.layer === 0)
        {
            return n.gte(1000) ? n.toNumber().toExponential(prec).replace(/\+/g, "") : n.toNumber().toFixed(prec1000);
        }
        if(n.layer === 1)
        {
            return Decimal.pow(10, n.mag % 1).toFixed(prec) + "e" + Math.floor(n.mag).toLocaleString("en-us", {minimumFractionDigits:0 , maximumFractionDigits:0});
        }
        else
        {
            return "e".repeat(n.layer) + n.mag.toLocaleString("en-us", {minimumFractionDigits: prec , maximumFractionDigits: prec});
        }
    },
    generateLayer: function(id)
    {
        let rand = new Random(id);
        let possibleFeatures = FeatureUnlockManager.getFeatures(id);
        let features = [];
        for(let i = 0; i < 3; i++)
        {
            let f = possibleFeatures[rand.nextInt(possibleFeatures.length)];
            possibleFeatures = possibleFeatures.filter(feature => feature !== f);
            features.push(f);
        }
        game.layers.push(new PrestigeLayer(id, features));
    },
    setCurrentLayer: function(l)
    {
        game.currentLayer = l;
    },
    setPreviousLayer: function()
    {
        if(game.currentLayer.layer > 0 && game.settings.tab === "Layers")
        {
            this.setCurrentLayer(game.layers[game.currentLayer.layer - 1]);
        }
    },
    setNextLayer: function()
    {
        if(game.currentLayer.layer < game.layers.length - 1 && game.settings.tab === "Layers")
        {
            this.setCurrentLayer(game.layers[game.currentLayer.layer + 1]);
        }
    },
    setTheme(css)
    {
        document.getElementById("theme").href = "css/themes/" + css;
        game.settings.theme = css;
    },
    getSaveString()
    {
        let replacer = function(key, value)
        {
            /*if(value instanceof Decimal)
            {
                return "d" + value;
            }*/
            if(key === "currentChallenge")
            {
                return value !== null ? {layer: value.layer.layer, index: game.layers[value.layer.layer].challenges.findIndex(c => c === value)} : null;
            }
            if(value instanceof PrestigeLayer)
            {
                return {challenges: value.challenges, generators: value.generators, powerGenerators: value.powerGenerators,
                        upgrades: value.upgrades, treeUpgrades: value.treeUpgrades, power: "d" + value.power, resource: "d" + value.resource,
                        totalResource: "d" + value.totalResource, maxResource: "d" + value.maxResource, timeSpent: value.timeSpent, timesReset: value.timesReset};
            }
            if(value instanceof Generator)
            {
                return {amount: "d" + value.amount, bought: "d" + value.bought};
            }
            if(value instanceof Upgrade)
            {
                return {level: "d" + value.level};
            }
            if(value instanceof Challenge)
            {
                return {level: value.level};
            }
            return value;
        }
        //return JSON.stringify(game, replacer);
        return btoa(unescape(encodeURIComponent(JSON.stringify(game, replacer))));
    },
    saveGame: function()
    {
        localStorage.setItem("OmegaLayers", this.getSaveString());
    },
    loadGame(str)
    {
        let loadObj;
        str = str || localStorage.getItem("OmegaLayers") || null;
        if(str === null) return;
        try
        {
            let reviver = function(key, value)
            {
                if(key === "theme") return value;
                if(typeof value === "string" && value.startsWith("d"))
                {
                    return new Decimal(value.replace("d", ""));
                }
                return value;
            };
            loadObj = JSON.parse(decodeURIComponent(escape(atob(str))), reviver);
        }
        catch(e)
        {
            console.warn("Error loading save\n", e.stack);
            return;
            //alert("Error loading game");
        }

        for(let i = 0; i < loadObj.layers.length; i++)
        {
            if(!game.layers[i])
            {
                functions.generateLayer(i);
            }
            game.layers[i].loadFromSave(loadObj.layers[i]);
        }
        if(loadObj.currentChallenge)
        {
            game.currentChallenge = game.layers[loadObj.currentChallenge.layer].challenges[loadObj.currentChallenge.index];
        }
        for(let k in loadObj.settings)
        {
            if(loadObj.settings.hasOwnProperty(k))
            {
                game.settings[k] = loadObj.settings[k];
            }
        }
        this.setTheme(game.settings.theme);
    },
    hardResetGame: function()
    {
        let confirmations = 0;
        do
        {
            if(!confirm("Are you " + "really ".repeat(confirmations) + "sure? There is no reward. " +
                "Click " + (3 - confirmations) + " more " + (confirmations >= 2 ? "time" : "times") + " to confirm."))
            {
                return;
            }
            confirmations++;
        } while(confirmations < 3)

        localStorage.setItem("OmegaLayers", null);
        game.currentLayer = null;
        game.layers = [];
        functions.loadGame(initialGame);
        functions.generateLayer(0);
        game.currentLayer = game.layers[0];
    }
};