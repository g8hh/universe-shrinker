Vue.component("news-ticker", {
    data: function()
    {
        return {
            messages: [
                "Every Incremental needs a News Ticker",
                "1.79769313e308 / 10 -IGN",
                "Powered by RNG",
                "Maybe there are new News here? Nope, just the old news...",
                "The Number limit is above 10↑↑308, good luck!",
                "Your ad here",
                "ζ is Fake News!",
                "Suggest more messages in the Discord!"
            ],
            currentMessage: ""
        }
    },
    methods: {
        getMessage: function()
        {
            let arr = Array.from(this.messages);
            arr = arr.filter(el => el !== this.currentMessage);
            this.currentMessage = arr[Math.floor(Math.random() * arr.length)];
        },
        getAnimationDuration: function()
        {
            return 20;
        },
        prepareMessageChange: function()
        {
            this.getMessage();
            setTimeout(() => this.prepareMessageChange(), this.getAnimationDuration() * 1000);
        }
    },
    mounted: function()
    {
        this.prepareMessageChange();
    },
    template: `<div class="news-ticker">
    <span :style="{animationDuration: getAnimationDuration() + 's'}">{{currentMessage}}</span>
</div>`
})