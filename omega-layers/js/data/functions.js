var functions = {
    formatNumber: function(n, prec, prec1000, lim = new Decimal(1000))
    {
        if(typeof n === "number")
        {
            n = new Decimal(n);
        }
        if(n.mag === Infinity)
        {
            return "Infinite";
        }
        if(n.lt(0))
        {
            return "-" + this.formatNumber(n.mul(-1), prec, prec1000, lim);
        }
        if(n.lt(Decimal.pow(0.1, Math.max(1, prec1000))) && n.neq(0))
        {
            return "1/" + this.formatNumber(n.pow(-1), prec, prec1000, lim);
        }
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
            let diff = Math.ceil(n.mag) - n.mag;
            let mag = n.mag;
            if(diff < 1e-10)
            {
                mag = Math.ceil(mag);
            }
            return Decimal.pow(10, mag % 1).toFixed(prec) + "e" + Math.floor(mag).toLocaleString("en-us", {minimumFractionDigits:0 , maximumFractionDigits:0});
        }
        else
        {
            return "e".repeat(n.layer) + n.mag.toLocaleString("en-us", {minimumFractionDigits: prec , maximumFractionDigits: prec});
        }
    },
    formatTime: function(s)
    {
        let times = [Math.floor(s / 60) % 60, Math.floor(s) % 60];
        if(s >= 3600)
        {
            times.unshift(Math.floor(s / 3600) % 24);
        }
        if(s >= 3600 * 24)
        {
            times.unshift(Math.floor(s / (3600 * 24)));
        }
        return times.map(t => t.toString().padStart(2, "0")).join(":");
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
    maxLayerUnlocked: function()
    {
        return game.layers.length - 1;
    },
    setTheme: function(css)
    {
        document.getElementById("theme").href = "css/themes/" + css;
        game.settings.theme = css;
    },
    createNotification: function(notification)
    {
        game.notifications.push(notification);
    },
    getSaveString()
    {
        let replacer = function(key, value)
        {
            if(key === "currentChallenge")
            {
                return value !== null && value !== undefined && game.layers[value.layer.layer] ? {layer: value.layer.layer, index: game.layers[value.layer.layer].challenges.findIndex(c => c === value)} : null;
            }
            if(value instanceof PrestigeLayer)
            {
                return {challenges: value.challenges, generators: value.generators, powerGenerators: value.powerGenerators,
                        upgrades: value.upgrades, treeUpgrades: value.treeUpgrades, power: "d" + value.power, resource: "d" + value.resource,
                        totalResource: "d" + value.totalResource, maxResource: "d" + value.maxResource, timeSpent: value.timeSpent, timesReset: value.timesReset,
                        volatility: value.volatility, alephLayer: value.alephLayer, achievements: value.achievements, automators: value.automators};
            }
            if(value instanceof Achievement)
            {
                return {title: value.title, isCompleted: value.isCompleted};
            }
            if(value instanceof AlephLayer)
            {
                return {aleph: "d" + value.aleph, upgrades: value.upgrades};
            }
            if(value instanceof Generator)
            {
                return {amount: "d" + value.amount, bought: "d" + value.bought};
            }
            if(value instanceof AbstractUpgrade)
            {
                return {level: "d" + value.level};
            }
            if(value instanceof Challenge)
            {
                return {level: value.level};
            }
            if(value instanceof Automator)
            {
                return {upgrade: value.upgrade, active: value.active, desiredInterval: value.desiredInterval};
            }
            return value;
        }
        //return JSON.stringify(game, replacer);
        return btoa(unescape(encodeURIComponent(JSON.stringify(game, replacer))));
    },
    saveGame: function()
    {
        localStorage.setItem("OmegaLayers", this.getSaveString());
        if(game.settings.notifications && game.settings.saveNotifications)
        {
            functions.createNotification(new Notification(NOTIFICATION_STANDARD, "Game Saved!", "images/save.svg"));
        }
    },
    loadGame(str)
    {
        let loadObj;
        str = str || localStorage.getItem("OmegaLayers") || null;
        if(str === null) return;
        if(str === "free boost")
        {
            functions.setTheme("broken.css");
            return -1;
        }
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
            return false;
        }

        game.timeSpent = loadObj.timeSpent !== undefined ? loadObj.timeSpent : 0;
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
        if(loadObj.volatility)
        {
            for(let k of Object.getOwnPropertyNames(loadObj.volatility))
            {
                game.volatility[k].level = loadObj.volatility[k].level;
            }
        }
        if(loadObj.alephLayer)
        {
            game.alephLayer.loadFromSave(loadObj.alephLayer);
        }
        if(loadObj.automators)
        {
            for(let k of Object.keys(loadObj.automators))
            {
                game.automators[k].loadFromSave(loadObj.automators[k]);
            }
        }
        if(loadObj.achievements)
        {
            for(let ach of loadObj.achievements)
            {
                let idx = game.achievements.findIndex(a => a.title === ach.title);
                if(idx !== -1)
                {
                    game.achievements[idx].isCompleted = ach.isCompleted;
                }
            }
        }
        this.setTheme(game.settings.theme);

        if(game.version !== loadObj.version)
        {
            if(game.version === "2")
            {
                for(let l of game.layers)
                {
                    if(!l.isNonVolatile() && l.hasTreeUpgrades())
                    {
                        l.respecUpgradeTree();
                    }
                }
            }
        }

        return true;
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