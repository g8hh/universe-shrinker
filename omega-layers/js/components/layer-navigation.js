Vue.component("layer-navigation", {
    props: ["layers"],
    methods:
        {
            setCurrentLayer: l => functions.setCurrentLayer(l),
            buttonFontSize: function(layer)
            {
                let id = layer.layer;
                let fntSize = 2.5 / (1 + 0.2 * Math.min(2, Math.floor(id / 48))); //24 greek letters * 2
                return fntSize + "rem";
            },
            isDisplayed: function(layerId)
            {
                if(game.settings.showAllLayers) return true;
                return layerId < game.settings.showMinLayers || layerId >= game.layers.length - game.settings.showMaxLayers;
            }
        },
    template: `<div class="layer-navigation">
<button v-if="isDisplayed(i)" v-for="(l, i) in layers" :key="i" @click="setCurrentLayer(l)" :style="{fontSize: buttonFontSize(l)}"><resource-name :layerid="l.layer"></resource-name></button>
</div>`
});