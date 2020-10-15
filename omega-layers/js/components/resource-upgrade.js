Vue.component("resource-upgrade", {
    props: ["upgrade", "resourcename"],
    computed: {
        canAfford: function ()
        {
            return this.upgrade.currentPrice().lt(this.upgrade.getResource());
        }
    },
    template: `<button :disabled="!canAfford" @click="upgrade.buy()" class="upgrade">
<p v-html="upgrade.description"></p>
<p v-html="upgrade.getEffectDisplay()"></p>
<p class="price">{{upgrade.getPriceDisplay()}} <span v-html="resourcename"></span></p>
</button>`
});