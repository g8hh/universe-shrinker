Vue.component("upgrade", {
    props: ["upgrade"],
    computed: {
        canAfford: function ()
        {
            return this.upgrade.currentPrice().lt(this.upgrade.layerCost.resource);
        },
        isUnlocked()
        {
            return !this.upgrade.requires || (this.upgrade.isUnlocked());
        }
    },
    template: `<button :disabled="!canAfford || !isUnlocked" @click="upgrade.buy()" class="upgrade">
<p v-html="upgrade.description"></p>
<p>{{upgrade.getEffectDisplay()}}</p>
<p class="price">{{upgrade.getPriceDisplay()}} <resource-name v-if="upgrade.level < upgrade.maxLevel" :layer='upgrade.layerCost'></resource-name></p>
</button>`
});