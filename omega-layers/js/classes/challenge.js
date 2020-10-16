var CHALLENGE_EFFECT_UPGRADESTRENGTH = 0, CHALLENGE_EFFECT_PRICES = 1, CHALLENGE_EFFECT_GENMULTI = 2,
    CHALLENGE_EFFECT_PRESTIGEREWARD = 3;
var CHALLENGE_REWARD_POWERGENERATORS = 0, CHALLENGE_REWARD_GENMULTI = 1, CHALLENGE_REWARD_PRESTIGEREWARD = 2;

class Challenge
{
    constructor(layer, name, getEffect, getReward, effectType, rewardType, goalLayer, goalResource, maxLevel = 10)
    {
        this.layer = layer;
        this.name = name;
        this.getEffect = getEffect;
        this.getReward = getReward;
        this.effectType = effectType;
        this.rewardType = rewardType;
        this.goalLayer = goalLayer;
        this.goalResource = goalResource;
        this.level = 0;
        this.maxLevel = maxLevel;
    }

    applyEffect()
    {
        return this.getEffect(this.level);
    }

    applyReward()
    {
        return this.getReward(this.level);
    }

    getDescription()
    {
        switch (this.effectType)
        {
            case CHALLENGE_EFFECT_UPGRADESTRENGTH:
                return "All Upgrade Effects are raised to the Power of " + this.applyEffect().toFixed(2);
            case CHALLENGE_EFFECT_PRICES:
                return "All Generator and Upgrade Prices are raised to the Power of " + this.applyEffect().toFixed(2);
            case CHALLENGE_EFFECT_GENMULTI:
                return "All Generator Multipliers are raised to the Power of " + this.applyEffect().toFixed(2);
            case CHALLENGE_EFFECT_PRESTIGEREWARD:
                return "All Prestige Rewards are raised to the Power of " + this.applyEffect().toFixed(2);
            default:
                return "That's weird. Something's different..."
        }
    }

    getRewardDescription()
    {
        switch (this.rewardType)
        {
            case CHALLENGE_REWARD_POWERGENERATORS:
                return "All Power Generators are x" + functions.formatNumber(this.applyReward()) + " stronger";
            case CHALLENGE_REWARD_GENMULTI:
                return "All Generator Multiplicators per 10 Levels are +" + this.applyReward().toFixed(3) + " better";
            case CHALLENGE_REWARD_PRESTIGEREWARD:
                return "Prestige Reward of all Layers is added by x" + functions.formatNumber(this.applyReward());
            default:
                return "A Cake."
        }
    }

    resetPreviousLayers()
    {
        for(let i = 0; i < game.layers.length; i++)
        {
            if(game.layers[i].isNonVolatile())
            {
                continue;
            }
            if(game.layers[i] === this.layer)
            {
                break;
            }
            game.layers[i].reset();
        }
    }

    getResourceGoal()
    {
        return Decimal.pow(this.goalResource, 1 + 0.2 * this.level);
    }

    canEnter()
    {
        return !game.currentChallenge && this.level < this.maxLevel;
    }

    isCompleted()
    {
        return this.goalLayer.resource.gte(this.getResourceGoal());
    }

    enter()
    {
        if(this.canEnter())
        {
            this.resetPreviousLayers();
            game.currentChallenge = this;
        }
    }

    leave()
    {
        this.resetPreviousLayers();
        game.currentChallenge = null;
    }

    succeed()
    {
        game.currentChallenge = null;
        this.level++;
    }

    tick(dt)
    {
        if(this.goalLayer.resource.gte(this.goalResource))
        {
            this.succeed();
        }
    }
}