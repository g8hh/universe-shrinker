const UPGRADE_RESOURCE = 0, UPGRADE_GENERATOR = 1, UPGRADE_GENMULTI = 2, UPGRADE_POWERGENERATOR = 3, UPGRADE_PRESTIGEREWARD = 4,
    UPGRADE_RESOURCE_TIMELAYER = 5, UPGRADE_GENERATOR_TIMELAYER = 6, UPGRADE_POWERGENERATOR_TIMELAYER = 7;

const RESOURCE_ALEPH = 0;

class AbstractUpgrade
{
    constructor(getPrice, getEffect, cfg)
    {
        this.getPrice = getPrice;
        this.getEffect = getEffect;
        this.cfg = cfg;
        this.level = new Decimal(0);
        this.maxLevel = cfg && cfg.maxLevel ? new Decimal(cfg.maxLevel) : Infinity;
        this.getEffectDisplay = cfg && cfg.getEffectDisplay ? cfg.getEffectDisplay : this.getEffectDisplay;
        this.description = this.getDescription();
    }

    getDescription()
    {
        return null;
    }

    currentPrice()
    {
        return this.getPrice(this.level);
    }

    apply()
    {
        return this.getEffect(this.level);
    }

    getEffectDisplay()
    {
        if(this.level.eq(this.maxLevel))
        {
            return "x" + functions.formatNumber(this.apply(), 2, 2);
        }
        return "x" + functions.formatNumber(this.getEffect(this.level), 2, 2) + " 🠚 " +
            "x" + functions.formatNumber(this.getEffect(this.level.add(1)), 2, 2);
    }

    getPriceDisplay()
    {
        if(this.level.eq(this.maxLevel))
        {
            return "Max";
        }
        return functions.formatNumber(this.currentPrice(), 2, 0, 1e9);
    }
}

class LayerUpgrade extends AbstractUpgrade
{
    constructor(layerCost, layerBoost, getPrice, getEffect, type, cfg)
    {
        super(getPrice, getEffect, cfg);
        this.layerCost = layerCost; //which resource has to be paid
        this.layerBoost = layerBoost; //which layer it boosts on
        this.type = type;
        this.description = this.getDescription();
    }

    getDescription()
    {
        switch (this.type)
        {
            case UPGRADE_RESOURCE:
                return "Boost " + this.layerBoost.name + " Production";
            case UPGRADE_GENERATOR:
            case UPGRADE_POWERGENERATOR:
                let genNames = [];
                let genName = this.type === UPGRADE_GENERATOR ? "Generators" : "Power Generators";
                for(let id of this.cfg.generators)
                {
                    genNames.push(this.layerBoost[this.type === UPGRADE_GENERATOR ? "generators" : "powerGenerators"][id].name);
                }
                return "Boost Production of " + genName + " " + genNames.join(" and ");
            case UPGRADE_GENMULTI:
                return "Boost the Production Boost of Generators per 10 Levels";
            case UPGRADE_PRESTIGEREWARD:
                return "Boost Prestige Reward on Layer " + this.layerBoost.name;
            case UPGRADE_RESOURCE_TIMELAYER:
                return "Boost " + this.layerBoost.name + " Production based on Time spent this " + this.layerCost.name;
            case UPGRADE_GENERATOR_TIMELAYER:
                return "Boost all " + this.layerBoost.name + " Generators based on time spent this " + this.layerCost.name;
            case UPGRADE_POWERGENERATOR_TIMELAYER:
                return "All " + this.layerBoost.name + " Generators are stronger based on time spent this " + this.layerCost.name;
            default:
                return "It boosts stuff. Sadly I have no idea what exactly it boosts :(";
        }
    }

    // for challenges
    static getPricePower()
    {
        if(game.currentChallenge && game.currentChallenge.effectType === CHALLENGE_EFFECT_PRICES_POWER)
        {
            return game.currentChallenge.applyEffect();
        }
        return new Decimal(1);
    }

    // for challenges
    static getEffectPower()
    {
        if(game.currentChallenge && game.currentChallenge.effectType === CHALLENGE_EFFECT_UPGRADESTRENGTH_SIMPLEBOOST)
        {
            return game.currentChallenge.applyEffect();
        }
        return new Decimal(1);
    }

    buy()
    {
        if(this.layerCost.resource.gte(this.currentPrice()) && this.level.lt(this.maxLevel))
        {
            this.layerCost.resource = this.layerCost.resource.sub(this.currentPrice());
            this.level = this.level.add(1);
        }
    }

    buyMax()
    {
        let oldLvl = new Decimal(this.level);
        this.level = new Decimal(Utils.determineMaxLevel(this.layerCost.resource, this));
        if(this.level.sub(oldLvl).gt(0) && this.level.lt(1e9))
        {
            this.layerCost.resource = this.layerCost.resource.sub(this.getPrice(this.level.sub(1)));
        }
        while(this.currentPrice().lte(this.layerCost.resource) && this.level.lt(1e9) && this.level.lt(this.maxLevel))
        {
            this.buy();
        }
    }
}

class TreeUpgrade extends LayerUpgrade
{
    constructor(layerCost, layerBoost, getPrice, getEffect, type, requires, blacklist, cfg)
    {
        super(layerCost, layerBoost, getPrice, getEffect, type, cfg);
        this.requires = requires; //required upgrades
        this.blacklist = blacklist; //cannot have these
    }

    isUnlocked()
    {
        for(let req of this.requires)
        {
            if(req.level.eq(0))
            {
                return false;
            }
        }
        return true;
    }

    isLocked()
    {
        if(this.layerCost.isNonVolatile())
        {
            return false;
        }
        for(let b of this.blacklist)
        {
            if(b.level.gt(0))
            {
                return true;
            }
        }
        return false;
    }

    isBuyable()
    {
        if(this.layerCost.isNonVolatile()) return true;
        return this.isUnlocked() && !this.isLocked();
    }

    buy()
    {
        if(this.isBuyable())
        {
            super.buy();
        }
    }
}

class DynamicLayerUpgrade extends LayerUpgrade
{
    constructor(getCostLayer, getBoostLayer, getDescription, getPrice, getEffect, type, cfg)
    {
        super(null, null, getPrice, getEffect, type, cfg);
        this.getCostLayer = getCostLayer;
        this.getBoostLayer = getBoostLayer;
        this.description = getDescription(this);
    }

    currentCostLayer()
    {
        return game.layers[this.getCostLayer(this.level.toNumber())];
    }

    currentBoostLayer()
    {
        return game.layers[this.getBoostLayer(this.level.toNumber())];
    }

    buy()
    {
        if(!this.currentCostLayer()) return;
        if(this.currentCostLayer().resource.gte(this.currentPrice()) && this.level.lt(this.maxLevel))
        {
            this.currentCostLayer().resource = this.currentCostLayer().resource.sub(this.currentPrice());
            this.level = this.level.add(1);
        }
    }

    buyMax()
    {
        if(!this.currentCostLayer()) return;
        let oldLvl = new Decimal(this.level);
        this.level = new Decimal(Utils.determineMaxLevel(this.currentCostLayer().resource, this));
        if(this.level.sub(oldLvl).gt(0) && this.level.lt(1e9))
        {
            this.currentCostLayer().resource = this.currentCostLayer().resource.sub(this.getPrice(this.level.sub(1)));
        }
        while(this.currentPrice().lte(this.currentCostLayer().resource) && this.level.lt(1e9) && this.level.lt(this.maxLevel))
        {
            this.buy();
        }
    }
}

class ResourceUpgrade extends AbstractUpgrade
{
    constructor(description, getPrice, getEffect, resource, cfg)
    {
        super(getPrice, getEffect, cfg);
        this.resource = resource;
        this.description = description;
    }

    getResource()
    {
        switch(this.resource)
        {
            case RESOURCE_ALEPH:
                return game.alephLayer.aleph;
        }
    }

    substractResource(res)
    {
        switch(this.resource)
        {
            case RESOURCE_ALEPH:
                game.alephLayer.aleph = game.alephLayer.aleph.sub(res);
                break;
        }
    }

    buy()
    {
        if(this.getResource().gte(this.currentPrice()) && this.level.lt(this.maxLevel))
        {
            this.substractResource(this.currentPrice());
            this.level = this.level.add(1);
        }
    }

    buyMax()
    {
        let oldLvl = new Decimal(this.level);
        this.level = new Decimal(Utils.determineMaxLevel(this.getResource(), this));
        if(this.level.sub(oldLvl).gt(0) && this.level.lt(1e9))
        {
            this.substractResource(this.getPrice(this.level.sub(1)));
        }
        while(this.currentPrice().lte(this.getResource()) && this.level.lt(1e9) && this.level.lt(this.maxLevel))
        {
            this.buy();
        }
    }
}

class AlephUpgrade extends ResourceUpgrade
{
    constructor(description, getPrice, getEffect, cfg)
    {
        super(description, getPrice, getEffect, RESOURCE_ALEPH, cfg);
    }
}

var effectDisplayTemplates = {
    numberStandard: function(digits, prefix = "x", suffix = "")
    {
        return function()
        {
            if(this.level.eq(this.maxLevel))
            {
                return prefix + functions.formatNumber(this.apply(), digits, digits) + suffix;
            }
            return prefix + functions.formatNumber(this.apply(), digits, digits) + suffix + " → "
                + prefix + functions.formatNumber(this.getEffect(this.level.add(1)), digits, digits) + suffix;
        };
    },
    percentStandard: function(digits, prefix = "", suffix = " %", digits1000 = digits)
    {
        return function()
        {
            let thisVal = this.apply().mul(100);
            let nextVal = this.getEffect(this.level.add(1)).mul(100);
            if(this.level.eq(this.maxLevel))
            {
                return prefix + functions.formatNumber(thisVal, digits, digits1000) + suffix;
            }
            return prefix + functions.formatNumber(thisVal, digits, digits1000) + suffix + " → "
                + prefix + functions.formatNumber(nextVal, digits, digits1000) + suffix;
        };
    },
    automator: function()
    {
        return function()
        {
            let thisVal = this.level.eq(0) ? "Inactive" : this.apply().toFixed(2) + " s";
            let nextVal = this.getEffect(this.level.add(1)).toFixed(2) + " s";
            if(this.level.eq(this.maxLevel))
            {
                return thisVal;
            }
            return thisVal + " → " + nextVal;
        }
    }
};