Vue.component("upgrade", {
    props: ["upgrade"],
    methods: {
        getResourceLayer: function()
        {
            if(this.upgrade instanceof DynamicLayerUpgrade)
            {
                return this.upgrade.getCostLayer(this.upgrade.level.toNumber());
            }
            return this.upgrade.layerCost.layer;
        }
    },
    computed: {
        canAfford: function ()
        {
            if(this.upgrade instanceof DynamicLayerUpgrade)
            {
                if(!this.upgrade.currentCostLayer()) return false;
                return this.upgrade.currentPrice().lt(this.upgrade.currentCostLayer().resource);
            }
            return this.upgrade.currentPrice().lt(this.upgrade.layerCost.resource);
        },
        isUnlocked()
        {
            return !this.upgrade.requires || (this.upgrade.isUnlocked());
        }
    },
    template: `<button :disabled="!canAfford || !isUnlocked" @click="upgrade.buy()" class="upgrade">
<p v-html="upgrade.description"></p>
<p v-html="upgrade.getEffectDisplay()"></p>
<p class="price">{{upgrade.getPriceDisplay()}} <resource-name v-if="upgrade.level < upgrade.maxLevel" :layerid='getResourceLayer()'></resource-name></p>
</button>`
});