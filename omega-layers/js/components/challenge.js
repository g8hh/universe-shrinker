Vue.component("challenge", {
    props: ["challenge"],
    methods: {
        formatNumber: (n, prec, prec1000, lim) => functions.formatNumber(n, prec, prec1000, lim),
        isDisabled: function()
        {
            if(this.challenge.level >= this.challenge.maxLevel || this.challenge.layer.resource.eq(0)) return true;
            if(!game.currentChallenge) return false;
            return game.currentChallenge !== this.challenge
        }
    },
    template: `<button :disabled="isDisabled()" @click="challenge.enter()" class="challenge">
    <h4><layer-colored-text :layer="challenge.layer" v-html="challenge.name"></layer-colored-text></h4>
    <p>{{challenge.level}} / {{challenge.maxLevel}}</p>
    <p>{{challenge.getDescription()}}</p>
    <p v-if="challenge.level > 0">Reward: {{challenge.getRewardDescription()}}</p>
    <p>Goal: {{formatNumber(challenge.goalResource)}} <resource-name :layer="challenge.goalLayer"></resource-name></p>
</button>`
});