Vue.component("challenge", {
    props: ["challenge"],
    methods: {
        formatNumber: (n, prec, prec1000, lim) => functions.formatNumber(n, prec, prec1000, lim),
        isDisabled: function()
        {
            if(this.challenge.layer.resource.eq(0)) return true;
            if(!game.currentChallenge) return false;
            return game.currentChallenge !== this.challenge;
        }
    },
    computed:
    {
        isCompleted: function()
        {
            return this.challenge.level >= this.challenge.maxLevel;
        }
    },
    template: `<button :disabled="isDisabled()" @click="challenge.enter()" :class="{completed: isCompleted}" class="challenge">
    <h4><layer-colored-text :layer="challenge.layer" v-html="challenge.name"></layer-colored-text></h4>
    <p>{{challenge.level}} / {{challenge.maxLevel}}</p>
    <p>{{challenge.getDescription()}}</p>
    <p v-if="challenge.level > 0">Reward: {{challenge.getRewardDescription()}}</p>
    <p>Goal: {{formatNumber(challenge.getResourceGoal(), 2, 2)}} <resource-name :layer="challenge.goalLayer"></resource-name></p>
</button>`
});