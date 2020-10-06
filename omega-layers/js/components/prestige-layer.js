Vue.component("prestige-layer", {
    props: ["layer"],
    data: function()
    {
        return {
            TAB_GENERATORS: 0,
            TAB_UPGRADES: 1,
            TAB_POWER: 2,
            TAB_SIMPLEBOOST: 3,
            TAB_CHALLENGES: 4,
            TAB_UPGRADE_TREE: 5,
            tab: 0
        };
    },
    methods: {
        formatNumber: (n, prec, prec1000, lim) => functions.formatNumber(n, prec, prec1000, lim),
        setTab: function(tab)
        {
            this.tab = tab;
            tabMap[this.layer.layer] = tab;
        },
        selectPossibleTab: function()
        {
            if(tabMap[this.layer.layer] !== undefined)
            {
                this.tab = tabMap[this.layer.layer];
            }
            else
            {
                this.tab = this.TAB_GENERATORS;
                if(!this.layer.hasGenerators())
                {
                    this.tab = this.TAB_POWER;
                    if(!this.layer.hasPower())
                    {
                        this.tab = this.TAB_SIMPLEBOOST;
                        if(!this.layer.hasSimpleBoost())
                        {
                            this.tab = this.TAB_UPGRADES;
                            if(!this.layer.hasUpgrades())
                            {
                                this.tab = this.TAB_UPGRADE_TREE;
                                if(!this.layer.hasTreeUpgrades())
                                {
                                    this.tab = this.TAB_CHALLENGES;
                                }
                            }
                        }
                    }
                }
            }
        },
        isInChallenge: function()
        {
            return game.currentChallenge !== null;
        },
        isHighestLayer: function()
        {
            return this.layer.layer === game.layers.length - 1;
        }
    },
    computed:{
        powerName: function()
        {
            if(this.layer.hasPower())
            {
                if(this.layer.powerTargetType === TARGET_GENERATORS)
                {
                    return this.layer.powerTargetLayer.name;
                }
                return this.layer.powerTargetLayer.name + "<sub>P</sub>";
            }
            return null;
        },
        nextLayer: function()
        {
            return game.layers[this.layer.layer + 1];
        },
        disableBuyMax: function()
        {
            return this.isHighestLayer() && game.settings.disableBuyMaxOnHighestLayer;
        }
    },
    mounted: function()
    {
        this.selectPossibleTab();
    },
    watch:
        {
            "layer": function()
            {
                this.selectPossibleTab();
            }
        },
    template: `<div class="prestige-layer">
<resource-display :layer="layer"></resource-display>
<div class="resource-button" v-if="layer.hasResourceButton"><button @click="layer.addResource(layer.getResourceButtonAmount())">+{{formatNumber(layer.getResourceButtonAmount(), 2, 0, 1e9)}} <resource-name :layer="layer"></resource-name></button></div>
<button v-if="nextLayer && (layer.canGenerateNextLayer() || nextLayer.timesReset > 0)" :disabled="!layer.canPrestige()" class="prestige" @click="layer.prestige()">
    <span v-if="layer.canPrestige()">Prestige to go <resource-name :layer="nextLayer"></resource-name><br/>Get +{{formatNumber(layer.getPrestigeAmount(), 2, 0)}} <resource-name :layer="nextLayer"></resource-name></span>
    <span v-else>Reach {{formatNumber(layer.getPrestigeLimit(), 2, 0)}} <resource-name :layer="layer"></resource-name></span>
</button>
<div class="tabs">
    <button v-if="layer.hasGenerators()" @click="setTab(TAB_GENERATORS)">Generators</button>
    <button v-if="layer.hasSimpleBoost()" @click="setTab(TAB_SIMPLEBOOST)">Simple Boost</button>
    <button v-if="layer.hasUpgrades()" @click="setTab(TAB_UPGRADES)">Upgrades</button>
    <button v-if="layer.hasPower()" @click="setTab(TAB_POWER)">Power</button>
    <button v-if="layer.hasChallenges()" @click="setTab(TAB_CHALLENGES)">Challenges</button>
    <button v-if="layer.hasTreeUpgrades()" @click="setTab(TAB_UPGRADE_TREE)">Upgrade Tree</button>
    <button @click="layer.maxAll()" :disabled="disableBuyMax">Max All (M)</button>
</div>
<div v-if="layer.hasGenerators() && tab === TAB_GENERATORS">
    <generator-table :generators="layer.generators"></generator-table>
</div>
<div v-if="layer.hasUpgrades() && tab === TAB_UPGRADES">
    <upgrade-container :upgrades="layer.upgrades"></upgrade-container>
</div>
<div v-if="layer.hasPower() && tab === TAB_POWER">
    <p class="power-text">You have <span class="big-number">{{formatNumber(layer.power, 2, 2)}}</span> <resource-name :layer="layer"></resource-name>-Power, 
    translated to a <span class="big-number">x{{formatNumber(layer.getPowerBoost(), 2, 2)}}</span> Boost on <layer-colored-text :layer="layer.powerTargetLayer" v-html="powerName"></layer-colored-text>-Generators</p>
    <generator-table :generators="layer.powerGenerators"></generator-table>
</div>
<div v-if="layer.hasSimpleBoost() && tab === TAB_SIMPLEBOOST">
    <p class="power-text">You have <span class="big-number">{{formatNumber(layer.resource, 2, 0, 1e9)}}</span> <resource-name :layer="layer"></resource-name>,
    translated to a <span class="big-number">x{{formatNumber(layer.getSimpleBoost(), 2, 2)}}</span> Boost on &alpha; Production</p>
</div>
<div v-if="layer.hasChallenges() && tab === TAB_CHALLENGES">
    <current-challenge v-if="isInChallenge()"></current-challenge>
    <challenge-table :challenges="layer.challenges"></challenge-table>
</div>
<div v-if="layer.hasTreeUpgrades() && tab === TAB_UPGRADE_TREE">
    <upgrade-tree :upgrades="layer.treeUpgrades"></upgrade-tree>
</div>
</div>`
});