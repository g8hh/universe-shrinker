class AlephLayer
{
    constructor()
    {
        this.aleph = new Decimal(0);
        this.upgrades = {
            alephGain: new AlephUpgrade("Increase your Aleph gain", level => Decimal.pow(1.215, level).mul(100),
                level => Decimal.pow(1.2, level)),
            alephGainBonus: new AlephUpgrade("Get a Bonus to Aleph gain",
                level => Utils.createValueDilation(Decimal.pow(1000, level).mul(1000), 0.02),
                level => new Decimal(1).add(level.mul(0.1)), {
                    getEffectDisplay: effectDisplayTemplates.percentStandard(3, "", " %", 0)
                }),
            alephBoost: new AlephUpgrade("Gain more Aleph based on the log(ℵ) you have",
                level => new Decimal(1e10).pow(Decimal.pow(2, level)),
                level => new Decimal(1).add(game.alephLayer.aleph.add(1).log10().mul(level).mul(0.05)).pow(2.5), {
                    maxLevel: 3
                }),
            deltaBoost: new AlephUpgrade("Gain more δ",
                level => Decimal.pow(1e9, level).mul(1e3),
                level => Decimal.pow(10, level), {
                    maxLevel: 3
                }),
            powerGenerators: new AlephUpgrade("All Power Generators on every Layer are stronger",
                level => Decimal.pow(1e5, Decimal.pow(level, 1.5)).mul(1e20),
                level => Decimal.pow(1.5, level), {
                    maxLevel: 10
                }),
            epsilonBoost: new AlephUpgrade("Gain more ε",
                level => Decimal.pow(1e12, level).mul(1e40),
                level => Decimal.pow(5, level), {
                    maxLevel: 3
                }),
            alephBoost2: new AlephUpgrade("Gain more Aleph based on the log(log(α)) you have",
                level => Decimal.pow(1e100, level).mul(1e100),
                level => game.layers[0] ? Decimal.pow(new Decimal(1.1).add(level.mul(0.01)), game.layers[0].resource.add(1).log10().add(1).log10()) : new Decimal(1), {
                    maxLevel: 10
                }),
            betterBetaFormula: new AlephUpgrade("The β Prestige Formula is better",
                level => new Decimal(1e100),
                level => new Decimal(1).add(level.mul(0.2)), {
                    maxLevel: 1,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }),
            prestigeRewards: new AlephUpgrade("Increase the Prestige Reward of all Layers",
                level => Decimal.pow(1e50, level).mul(1e150),
                level => Decimal.pow(1.2, level), {
                    maxLevel: 10
                })
        };
    }

    getAlephGain()
    {
        return this.upgrades.alephGain.apply().mul(this.upgrades.alephGainBonus.apply())
            .mul(this.getAlephBoostFromLayer())
            .mul(this.upgrades.alephBoost.apply())
            .mul(this.upgrades.alephBoost2.apply());
    }

    isUnlocked()
    {
        return functions.maxLayerUnlocked() >= 3;
    }

    getAlephBoostFromLayer()
    {
        if(functions.maxLayerUnlocked() < 3) return new Decimal(0);
        if(game.layers[3].timesReset === 0) return new Decimal(0);
        return Decimal.pow(10, Math.max(0, functions.maxLayerUnlocked() - 3));
    }

    maxAll()
    {
        for(let k of Object.getOwnPropertyNames(this.upgrades).filter(key => key !== "__ob__"))
        {
            this.upgrades[k].buyMax();
        }
    }

    tick(dt)
    {
        if(this.isUnlocked())
        {
            this.aleph = this.aleph.add(this.getAlephGain().mul(dt));
        }
    }

    loadFromSave(obj)
    {
        this.aleph = obj.aleph;
        for(let k of Object.getOwnPropertyNames(obj.upgrades))
        {
            this.upgrades[k].level = obj.upgrades[k].level;
        }
    }
}