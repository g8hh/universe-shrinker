class AlephLayer
{
    constructor()
    {
        this.aleph = new Decimal(0);
        this.upgrades = {
            alephGain: new AlephUpgrade("Increase your Aleph gain", level => Decimal.pow(1.2, level).mul(100),
                level => Decimal.pow(1.2, level)),
            alephGainBonus: new AlephUpgrade("Get a Bonus to Aleph gain, allowing you to Level up the main Upgrade faster",
                level => Utils.createValueDilation(Decimal.pow(1000, level).mul(1000), 0.02),
                level => new Decimal(1).add(level.mul(0.04)), {
                    getEffectDisplay: effectDisplayTemplates.percentStandard(3, "", " %", 0)
                })
        };
    }

    getAlephGain()
    {
        return this.upgrades.alephGain.apply().mul(this.upgrades.alephGainBonus.apply()).mul(this.getAlephBoostFromLayer());
    }

    isUnlocked()
    {
        return functions.maxLayerUnlocked() >= 3;
    }

    getAlphaPower()
    {
        return new Decimal(1).add(this.aleph.add(1).log10().div(100));
    }

    getAlephBoostFromLayer()
    {
        if(functions.maxLayerUnlocked() < 3) return new Decimal(0);
        if(game.layers[3].timesReset === 0) return new Decimal(0);
        return Decimal.pow(1.25, Math.max(0, functions.maxLayerUnlocked() - 3));
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