class Utils
{
    static determineMaxLevel(resource, buyable)
    {
        if(resource.lt(buyable.currentPrice()))
        {
            return buyable[buyable instanceof AbstractUpgrade ? "level" : "bought"];
        }
        let r = resource.div(1e15);
        let lvl = 512;
        let interval = 256;
        while(interval > 1e-16)
        {
            let price = buyable.getPrice(Decimal.pow(10, lvl));
            let canAfford = r.gte(price);
            lvl += canAfford ? interval : -interval;
            interval /= 2;
        }
        let finalLvl = Decimal.pow(10, lvl).floor();
        return Decimal.max(buyable[buyable instanceof AbstractUpgrade ? "level" : "bought"], finalLvl);
    }

    static generateGeneratorList(amount, rand, length = 8)
    {
        let gen = [];
        for(let i = 0; i < amount; i++)
        {
            let g;
            do
            {
                g = rand.nextInt(length);
            } while(gen.findIndex(num => num === g) !== -1);
            gen.push(g);
        }
        return gen;
    }

    static createValueDilation(value, strength, start = INFINITY)
    {
        let dilation = Decimal.max(0, value.div(start).log10().mul(strength)).add(1);
        return value.pow(dilation);
    }
}