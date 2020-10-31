const FEATURE_GENERATORS = 0, FEATURE_RESOURCEBUTTON = 1, FEATURE_UPGRADES = 2, FEATURE_POWER = 3, FEATURE_SIMPLEBOOST = 4,
    FEATURE_CHALLENGES = 5, FEATURE_UPGRADE_TREE = 6;
const TARGET_GENERATORS = 0, TARGET_POWERGENERATORS = 1;

class PrestigeLayer
{
    constructor(layer, features)
    {
        this.layer = layer;
        this.resource = new Decimal(0);
        this.totalResource = new Decimal(0);
        this.maxResource = new Decimal(0);
        this.power = new Decimal(0); //like infinity power in AD
        this.timesReset = 0;
        this.timeSpent = 0;
        this.name = this.getName(layer);
        this.hasResourceButton = false;
        this.features = features;
        for(let feature of features)
        {
            if(feature === FEATURE_GENERATORS)
            {
                this.createGenerators();
            }
            if(feature === FEATURE_UPGRADES)
            {
                this.createUpgrades();
            }
            if(feature === FEATURE_POWER)
            {
                this.createPowerGenerators();
            }
            if(feature === FEATURE_CHALLENGES)
            {
                this.createChallenges();
            }
            if(feature === FEATURE_UPGRADE_TREE)
            {
                this.createUpgradeTree();
            }
            if(feature === FEATURE_RESOURCEBUTTON)
            {
                this.hasResourceButton = true;
            }
        }
    }

    static getNameForLayer(layer)
    {
        let letters = "αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
        let orders = "ψϝϛͱϻϙͳϸ";
        let order = Math.floor(layer / letters.length);
        if(order === 0)
        {
            return letters[layer];
        }
        return "<span>" + letters[letters.length - 1] + (order > 1 ? "<sub>" + orders[order - 2] + "</sub>" : "") + "</span>" + "<sup>" + letters[(layer) % letters.length] + "</sup>";
    }

    static getFullNameForLayer(layer)
    {
        let names = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa", "lambda", "my", "ny", "xi", "omicron",
            "pi", "rho", "sigma", "tau", "ypsilon", "phi", "chi", "psi", "omega"];
        let name = names[layer % names.length];
        if(layer % (names.length * 2) >= names.length)
        {
            name = name[0].toUpperCase() + name.substr(1);
        }
        let order = Math.floor(layer / (names.length * 2));
        let prefix = ["", "Om-", "Psi-", "Di-", "Sti-", "He-", "San-", "Kop-", "Sam-", "Sp-"][order];
        return prefix + name;
    }

    getName(layer)
    {
        return PrestigeLayer.getNameForLayer(layer);
    }

    getResourceName(layer)
    {
        return this.getName(layer);
    }

    getResourceButtonAmount()
    {
        if(this.hasGenerators())
        {
            let bonus = game.layers[this.layer + 1] && game.layers[this.layer + 1].timesReset > 0 ? this.generators[0].getProductionMulti() : new Decimal(0);
            return Decimal.max(1, (this.generators[0].getProductionPS().div(10)).add(bonus).round());
        }
        return new Decimal(1);
    }

    hasGenerators()
    {
        return this.generators !== undefined;
    }

    createGenerators()
    {
        this.generators = [];
        for(let i = 0; i < 8; i++)
        {
            let baseProd = i === 0 ? new Decimal(1) : new Decimal(0.2);
            this.generators.push(new Generator(this, i, i > 0 ? this.generators[i - 1] : null, this.name + "<sub>" + (i + 1) + "</sub>",
                Decimal.pow(10, i + 1 + Math.max(0, i - 3) + Math.max(0, i - 6)), Decimal.pow(10, i + 3 + Math.max(0, i - 2)), baseProd));
        }
    }

    hasUpgrades()
    {
        return this.upgrades !== undefined;
    }

    createUpgrades()
    {
        let rand = new Random(this.layer);
        let upgradeCount = 7 + rand.nextInt(5);
        this.upgrades = [];
        let bpGrowth = 10.5 + rand.nextDouble();
        for(let i = 0; i < upgradeCount; i++)
        {
            let upg;
            let bp = Decimal.pow(bpGrowth, Math.pow(this.layer !== 0 ? 1.5 : 1.75, i + (this.layer === 0 ? 2 : 0)) - 1);
            if(this.layer === 0)
            {
                bp = bp.mul(2.5e8);
            }
            bp = Decimal.round(bp.mul(2 + 6 * rand.nextDouble()));
            let upgTypes = FeatureUnlockManager.getUpgradeTypes(this.layer);
            let type = upgTypes[rand.nextInt(upgTypes.length)];
            //local variable so random isnt called in callback
            let effectGenerator = 1 + 0.15 + rand.nextDouble() * 0.15;
            let effectPowerGenerator = 1 + 0.1 + rand.nextDouble() * 0.15;
            let effectGenMulti = 0.001 + 0.001 * rand.nextDouble();
            let effectPrestigeReward = rand.nextDouble() * 0.4;

            let extraPriceIncrease = this.layer === 0 ? 15 : 0;
            let extraPow = Decimal.pow(22, this.layer);
            let extraPowGenmulti = Decimal.pow(22, this.layer - 1);
            switch (type)
            {
                case UPGRADE_RESOURCE:
                    upg = new LayerUpgrade(this, game.layers[0] || this,
                        level => Utils.createValueDilation(Decimal.pow(3 * i + 7 + extraPriceIncrease, level).mul(bp), 0.01).pow(LayerUpgrade.getPricePower()),
                        level => Decimal.pow(effectGenerator, level).pow(extraPow).pow(LayerUpgrade.getEffectPower()), UPGRADE_RESOURCE);
                    break;
                case UPGRADE_GENERATOR:
                    upg = new LayerUpgrade(this, game.layers[0] || this,
                        level => Utils.createValueDilation(Decimal.pow(3 * i + 8 + extraPriceIncrease, level).mul(bp), 0.01).pow(LayerUpgrade.getPricePower()),
                        level => Decimal.pow(effectGenerator, level).pow(extraPow).pow(0.5 * LayerUpgrade.getEffectPower()), UPGRADE_GENERATOR, {
                            generators: Utils.generateGeneratorList(2, rand).sort()
                        });
                    break;
                case UPGRADE_POWERGENERATOR:
                    let possibleLayers = this.getPowerLayers();
                    let layerToBoost = possibleLayers[rand.nextInt(possibleLayers.length)];
                    let diff = this.layer - layerToBoost.layer;
                    let extraPowerPow = Decimal.pow(22, diff - 1);
                    upg = new LayerUpgrade(this, layerToBoost,
                        level => Utils.createValueDilation(Decimal.pow(3 * i + 10 + extraPriceIncrease, level).mul(bp), 0.01).pow(LayerUpgrade.getPricePower()),
                        level => Decimal.pow(effectPowerGenerator, level).pow(extraPowerPow.mul(LayerUpgrade.getEffectPower())), UPGRADE_POWERGENERATOR, {
                            generators: Utils.generateGeneratorList(2, rand).sort()
                        });
                    break;
                case UPGRADE_GENMULTI:
                    upg = new LayerUpgrade(this, game.layers[0] || this,
                        level => Utils.createValueDilation(Decimal.pow(3 * i + 4 + extraPriceIncrease, level).mul(bp), 0.01).pow(LayerUpgrade.getPricePower()),
                        level => new Decimal(effectGenMulti * level).mul(extraPowGenmulti).mul(LayerUpgrade.getEffectPower()), UPGRADE_GENMULTI, {
                            getEffectDisplay: effectDisplayTemplates.numberStandard(3, "+")
                        });
                    break;
                case UPGRADE_PRESTIGEREWARD:
                    upg = new LayerUpgrade(this, game.layers[rand.nextInt(game.layers.length)] || this,
                        level => Utils.createValueDilation(Decimal.pow(3 * i + 3 + extraPriceIncrease, level.add(2)).mul(bp), 0.01).pow(LayerUpgrade.getPricePower()),
                        level => new Decimal(effectPrestigeReward * level * this.layer).pow(LayerUpgrade.getEffectPower()), UPGRADE_PRESTIGEREWARD, {
                            getEffectDisplay: effectDisplayTemplates.numberStandard(2, "+x")
                        });
                    break;
            }
            this.upgrades.push(upg);
        }
    }

    //Power boosts all alpha Generators
    getPowerBoost()
    {
        let power;
        if(this.powerTargetLayer === game.layers[0])
        {
            power = Decimal.pow(22, this.layer - 1);
        }
        else
        {
            let diff = this.layer - this.powerTargetLayer.layer;
            power = Decimal.pow(22, diff - 1).mul(2);
        }
        let challengePow = game.currentChallenge && game.currentChallenge.type === CHALLENGE_EFFECT_PRICES_POWER ? game.currentChallenge.applyEffect() : 1;
        return this.power.add(1).pow(power.mul(1.38)).pow(challengePow);
    }

    hasPower()
    {
        return this.powerGenerators !== undefined;
    }

    createPowerGenerators()
    {
        this.powerGenerators = [];
        this.powerTargetLayer = game.layers[0];
        this.powerTargetType = TARGET_GENERATORS;
        if(this.layer === 2) //hardcoded
        {
            this.powerTargetLayer = game.layers[1];
            this.powerTargetType = TARGET_POWERGENERATORS;
        }
        for(let i = 0; i < 8; i++)
        {
            let rand = new Random(this.layer * (i + 1));
            let bpMult = 0.2 + 0.6 * rand.nextDouble();
            let baseProd = new Decimal(0.02);
            this.powerGenerators.push(new PowerGenerator(this, i, i > 0 ? this.powerGenerators[i - 1] : null,
                this.name + "<sub>P<sub>" + (i + 1) + "</sub></sub>",
                Decimal.pow(10, Decimal.pow(2, i)).mul(bpMult).floor(), Decimal.pow(10, Decimal.pow(2, i).add(1)), baseProd));
        }
    }

    hasSimpleBoost()
    {
        return this.features.includes(FEATURE_SIMPLEBOOST);
    }

    getSimpleBoost()
    {
        let challengePow = game.currentChallenge && game.currentChallenge.type === CHALLENGE_EFFECT_UPGRADESTRENGTH_SIMPLEBOOST ? game.currentChallenge.applyEffect() : 1;
        return this.hasSimpleBoost() ? this.resource.add(1).pow(2.5 * Math.pow(22, this.layer - 1)).pow(challengePow) : new Decimal(1);
    }

    createChallenges()
    {
        this.challenges = [];
        let rand = new Random(this.layer);
        let challengeCount = 3 + rand.nextInt(3);
        for(let i = 0; i < challengeCount; i++)
        {
            let name = this.getName(this.layer) + "-" + (i + 1).toString().padStart(2, "0");
            let effectTypes = FeatureUnlockManager.getChallengeEffectTypes(this.layer);
            let rewardTypes = FeatureUnlockManager.getChallengeRewardTypes(this.layer);
            let type_effect = effectTypes[rand.nextInt(effectTypes.length)];
            let type_reward = rewardTypes[rand.nextInt(rewardTypes.length)];

            let formula_effect;
            let formula_reward;

            switch(type_effect)
            {
                case CHALLENGE_EFFECT_PRICES_POWER:
                    let factorPrice = 0.6 + rand.nextDouble() * 0.3;
                    formula_effect = function(level)
                    {
                        return new Decimal(1 + (level + 1) * factorPrice);
                    }
                    break;
                case CHALLENGE_EFFECT_UPGRADESTRENGTH_SIMPLEBOOST:
                    let factorStrength = 0.4 + 0.05 * rand.nextDouble();
                    formula_effect = function(level)
                    {
                        return Decimal.pow(factorStrength, level + 1);
                    }
                    break;
                case CHALLENGE_EFFECT_GENMULTI:
                    let factorGen = 0.4 + 0.05 * rand.nextDouble();
                    formula_effect = function(level)
                    {
                        return Decimal.pow(factorGen, level + 1);
                    }
                    break;
                case CHALLENGE_EFFECT_PRESTIGEREWARD:
                    let factorPrestige = 0.82 + 0.05 * rand.nextDouble();
                    formula_effect = function(level)
                    {
                        return Decimal.pow(factorPrestige, Math.sqrt(level + 1));
                    }
                    break;
                default:
                    return;
            }

            switch(type_reward)
            {
                case CHALLENGE_REWARD_POWERGENERATORS:
                    let factorPowerGenerators = 1 + rand.nextDouble();
                    formula_reward = function(level)
                    {
                        return Decimal.pow(1.1, factorPowerGenerators * level);
                    }
                    break;
                case CHALLENGE_REWARD_GENMULTI:
                    let factorMulti = (0.1 + rand.nextDouble() * 0.05) * this.layer;
                    let extraPower = Decimal.pow(22, this.layer - 2);
                    formula_reward = function(level)
                    {
                        return new Decimal(factorMulti).mul(extraPower);
                    }
                    break;
                case CHALLENGE_REWARD_PRESTIGEREWARD:
                    let factorPrestige = (1 + rand.nextDouble()) * this.layer;
                    formula_reward = function(level)
                    {
                        return new Decimal(factorPrestige * level);
                    }
                    break;
                default:
                    return;
            }

            let challenge = new Challenge(this, name, formula_effect, formula_reward, type_effect, type_reward, game.layers[this.layer - 1], Decimal.pow(10, 50 + 75 * rand.nextDouble()), 7 + rand.nextInt(8));
            this.challenges.push(challenge);
        }
    }

    hasChallenges()
    {
        return this.challenges !== undefined;
    }

    createUpgradeTree()
    {
        this.treeUpgrades = [];
        let upgs = []; //this is still undefined, so local var is used
        let rand = new Random(this.layer);
        let rows = 4 + rand.nextInt(2);
        let amnt = 1;
        let amntBefore = 1;

        let requiredUpgrade = function(row, col)
        {
            if(upgs.length === 0) return [];
            return [upgs[row - 1][Math.floor(col / amnt * amntBefore)]];
        }

        for(let r = 0; r < rows; r++)
        {
            let row = [];
            for(let c = 0; c < amnt; c++)
            {
                let possibleTypes = FeatureUnlockManager.getUpgradeTreeTypes(this.layer);
                let upgType = possibleTypes[rand.nextInt(possibleTypes.length)];
                let upg;
                let bp = Decimal.pow(4, Decimal.pow(2, Math.pow(r, 1.25))).pow(1 + 0.25 * rand.nextDouble());
                let layerPow = Decimal.pow(22, this.layer);
                let timeFactor = 0.5 + new Random(this.layer * (r + 1) * (c + 1)).nextDouble();
                switch(upgType)
                {
                    case UPGRADE_RESOURCE_TIMELAYER:
                        upg = new TreeUpgrade(this, game.layers[0] || this,
                            level => Utils.createValueDilation(Decimal.pow(2.5 + r, Decimal.pow(level, 1.5)).mul(bp), 0.01),
                            level => new Decimal(1 + Math.pow(this.timeSpent, 0.6) * level * timeFactor * 0.0002).pow(layerPow.mul(2)), upgType, requiredUpgrade(r, c));
                        break;
                    case UPGRADE_GENERATOR_TIMELAYER:
                        upg = new TreeUpgrade(this, game.layers[0] || this,
                            level => Utils.createValueDilation(Decimal.pow(2.75 + r, Decimal.pow(level, 1.5)).mul(bp), 0.01),
                            level => new Decimal(1 + Math.pow(this.timeSpent, 0.6) * level * timeFactor * 0.0002).pow(layerPow.mul(2 / 8)), upgType, requiredUpgrade(r, c));
                        break;
                    case UPGRADE_POWERGENERATOR_TIMELAYER:
                        let powerLayers = this.getPowerLayers();
                        let powerLayer = powerLayers[rand.nextInt(powerLayers.length)];
                        let diff = this.layer - powerLayer.layer;
                        let extraPow = Decimal.pow(22, diff - 1);
                        upg = new TreeUpgrade(this, powerLayer,
                            level => Utils.createValueDilation(Decimal.pow(2.5 + r, Decimal.pow(level, 1.55)).mul(bp), 0.01),
                            level => new Decimal(1 + Math.pow(this.timeSpent, 0.6) * level * timeFactor * 0.001).pow(extraPow.mul(0.8)), upgType, requiredUpgrade(r, c));
                        break;
                }
                row.push(upg);
            }
            amntBefore = amnt;
            if(rand.nextDouble() < 0.5) amnt++;
            upgs.push(row);
        }

        this.treeUpgrades = this.treeUpgrades.concat(upgs);
    }

    hasTreeUpgrades()
    {
        return this.treeUpgrades !== undefined;
    }

    getTreeUpgradesAsArray()
    {
        return this.treeUpgrades.flat();
    }

    getAllUpgrades()
    {
        if(!this.hasTreeUpgrades() && !this.hasUpgrades()) return [];
        if(!this.hasUpgrades())
        {
            return this.getTreeUpgradesAsArray();
        }
        if(!this.hasTreeUpgrades())
        {
            return this.upgrades;
        }
        return this.upgrades.concat(this.getTreeUpgradesAsArray());
    }

    //the factor of how much the power on the prestige formula is
    static getPrestigeCarryOverForLayer(layer)
    {
        return 24 * Math.pow(1.1, Math.max(layer - 2, 0)) * Math.pow(1.1, Math.max(layer - 3, 0));
    }

    getPrestigeCarryOver()
    {
        return PrestigeLayer.getPrestigeCarryOverForLayer(this.layer);
    }

    getPrestigeLimit()
    {
        return Decimal.pow(10, this.getPrestigeCarryOver());
    }

    canGenerateNextLayer()
    {
        return this.resource.gt(this.getPrestigeLimit().pow(20 / 24));
    }

    canPrestige()
    {
        return this.resource.gte(this.getPrestigeLimit());
    }

    getPrestigeAmount()
    {
        let lim = new Decimal(this.getPrestigeLimit());
        if(this.resource.lt(lim))
        {
            return new Decimal(0);
        }
        let multi = new Decimal(1);
        for(let l of game.layers)
        {
            for(let upg of l.getAllUpgrades().filter(u => u.type === UPGRADE_PRESTIGEREWARD && u.layerBoost === this))
            {
                multi = multi.add(upg.apply());
            }
            if(l.hasChallenges())
            {
                for(let c of l.challenges.filter(ch => ch.rewardType === CHALLENGE_REWARD_PRESTIGEREWARD))
                {
                    multi = multi.add(c.applyReward());
                }
            }
        }
        if(this.layer === 2) //delta boost
        {
            multi = multi.mul(game.alephLayer.upgrades.deltaBoost.apply());
        }
        if(this.layer === 3) //epsilon boost
        {
            multi = multi.mul(game.alephLayer.upgrades.epsilonBoost.apply());
        }
        let power = game.currentChallenge && game.currentChallenge.effectType === CHALLENGE_EFFECT_PRESTIGEREWARD ? game.currentChallenge.applyEffect() : 1;
        return Decimal.pow(this.resource.div(lim), 1 / this.getPrestigeCarryOver() * power).mul(multi).floor();
    }

    isNonVolatile()
    {
        return game.volatility.layerVolatility.apply().toNumber() >= this.layer;
    }

    isAutoMaxed()
    {
        return game.volatility.autoMaxAll.apply().toNumber() >= this.layer;
    }

    reset()
    {
        if(this.hasGenerators())
        {
            for(let g of this.generators)
            {
                g.bought = new Decimal(0);
                g.amount = new Decimal(0);
            }
        }
        if(this.hasPower())
        {
            this.power = new Decimal(0);
            for(let g of this.powerGenerators)
            {
                g.bought = new Decimal(0);
                g.amount = new Decimal(0);
            }
        }
        if(this.hasUpgrades())
        {
            for(let upg of this.upgrades)
            {
                upg.level = new Decimal(0);
            }
        }
        if(this.hasTreeUpgrades())
        {
            for(let r = 0; r < this.treeUpgrades.length; r++)
            {
                for(let c = 0; c < this.treeUpgrades[r].length; c++)
                {
                    this.treeUpgrades[r][c].level = new Decimal(0);
                }
            }
        }
        this.resource = new Decimal(0);
        this.power = new Decimal(0);
        this.timeSpent = 0;
    }

    prestige()
    {
        if(!this.isNonVolatile())
        {
            game.layers[this.layer + 1].resource = game.layers[this.layer + 1].resource.add(this.getPrestigeAmount());
            game.layers[this.layer + 1].timesReset += 1;
            for(let i = 0; i <= this.layer; i++)
            {
                if(!game.layers[i].isNonVolatile())
                {
                    game.layers[i].reset();
                }
            }
        }
    }

    getPowerLayers()
    {
        return game.layers.filter(l => l.hasPower() && l.layer < this.layer);
    }

    maxAll()
    {
        if(!game.settings.disableBuyMaxOnHighestLayer || this.layer < game.layers.length - 1)
        {

            if(this.hasGenerators())
            {
                for(let i = this.generators.length - 1; i >= 0; i--)
                {
                    this.generators[i].buyMax();
                }
            }
            if(this.hasPower())
            {
                for(let i = this.powerGenerators.length - 1; i >= 0; i--)
                {
                    this.powerGenerators[i].buyMax();
                }
            }
            if(this.hasUpgrades())
            {
                for(let i = this.upgrades.length - 1; i >= 0; i--)
                {
                    this.upgrades[i].buyMax();
                }
            }
            if(this.hasTreeUpgrades())
            {
                for(let row = this.treeUpgrades.length - 1; row >= 0; row--)
                {
                    for(let col = 0; col < this.treeUpgrades[row].length; col++)
                    {
                        this.treeUpgrades[row][col].buyMax();
                    }
                }
            }
        }
    }

    addResource(n)
    {
        this.resource = this.resource.add(n);
        this.totalResource = this.totalResource.add(n);
        this.maxResource = Decimal.max(this.maxResource, this.resource);
    }

    getPrestigeAmountPerSecond()
    {
        return this.getPrestigeAmount().mul(game.volatility.prestigePerSecond.apply());
    }

    tick(dt)
    {
        if(this.hasGenerators())
        {
            for(let g of this.generators)
            {
                g.tick(dt);
            }
        }
        if(this.hasPower())
        {
            for(let g of this.powerGenerators)
            {
                g.tick(dt);
            }
        }
        if(this.isNonVolatile() && game.layers[this.layer + 1])
        {
            game.layers[this.layer + 1].addResource(this.getPrestigeAmountPerSecond().mul(dt));
        }
        if(game.settings.autoMaxAll && this.isAutoMaxed())
        {
            this.maxAll();
        }
        if(this.layer === 0 || this.timesReset > 0)
        {
            this.timeSpent += dt;
        }
    }

    loadFromSave(obj)
    {
        this.resource = obj.resource;
        this.totalResource = obj.totalResource;
        this.maxResource = obj.maxResource;
        this.timeSpent = obj.timeSpent;
        this.timesReset = obj.timesReset;
        this.power = obj.power;
        if(this.hasUpgrades() && obj.upgrades)
        {
            for(let i = 0; i < obj.upgrades.length; i++)
            {
                this.upgrades[i].level = obj.upgrades[i].level;
            }
        }
        if(this.hasTreeUpgrades() && obj.treeUpgrades)
        {
            for(let row = 0; row < obj.treeUpgrades.length; row++)
            {
                for(let col = 0; col < obj.treeUpgrades[row].length; col++)
                {
                    this.treeUpgrades[row][col].level = obj.treeUpgrades[row][col].level;
                }
            }
        }
        if(this.hasPower() && obj.powerGenerators)
        {
            for(let i = 0; i < obj.powerGenerators.length; i++)
            {
                this.powerGenerators[i].bought = obj.powerGenerators[i].bought;
                this.powerGenerators[i].amount = obj.powerGenerators[i].amount;
            }
        }
        if(this.hasGenerators() && obj.generators)
        {
            for(let i = 0; i < obj.generators.length; i++)
            {
                this.generators[i].bought = obj.generators[i].bought;
                this.generators[i].amount = obj.generators[i].amount;
            }
        }
        if(this.hasChallenges() && obj.challenges)
        {
            for(let i = 0; i < obj.challenges.length; i++)
            {
                this.challenges[i].level = obj.challenges[i].level;
            }
        }
    }
}