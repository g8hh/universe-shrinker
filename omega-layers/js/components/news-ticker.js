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
                "Suggest more messages in the Discord!",
                "The Cell is the Powerhouse of the Mitochondria",
                "\"where is the potato layer ?!\" - some pig dude",
                "\"Imagine quoting your name on your news ticker\" - ???",
                "\"if you hit a wall, keep hitting\" -winston churchill",
                "Die, frickin pie - PewDiePie",
                `<span style="color: hsl(0, 100%, 50%)">R</span>`
                +` <span style="color: hsl(45, 100%, 50%)">A</span>`
                +` <span style="color: hsl(90, 100%, 50%)">I</span>`
                +` <span style="color: hsl(135, 100%, 50%)">N</span>`
                +` <span style="color: hsl(180, 100%, 50%)">B</span>`
                +` <span style="color: hsl(225, 100%, 50%)">O</span>`
                +` <span style="color: hsl(270, 100%, 50%)">W</span>`,
                "This definitly beats Mega Layers! -RΨZΞΠ 9 935ΘX",
                "hey, I bet this isnt a newsticker. Or is it?",
                () => "This Number is randomly generated -> " + Math.pow(10, Math.random() * 3.01).toFixed(2) +
                    ". If it's above 1,000, consider yourself lucky!",
                () => `<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">get Layer ` + PrestigeLayer.getNameForLayer(game.layers.length) + ` now [working 2020]</a>`
            ],
            currentMessage: "",
            messageIndex: -1
        }
    },
    computed: {
        animationDuration: function()
        {
            return 10 + 0.1 * this.currentMessage.replace(/<.*?>/g, "").length;
        }
    },
    methods: {
        getMessage: function()
        {
            let arr = Array.from(this.messages);
            if(this.messageIndex !== -1)
            {
                arr.splice(this.messageIndex, 1);
            }
            //arr = arr.filter(el => el !== this.currentMessage);
            let index = Math.floor(Math.random() * arr.length);
            this.messageIndex = index;
            let element = arr[index];
            this.currentMessage = typeof element === "string" ? element : element();
        }
    },
    mounted: function()
    {
        this.getMessage();
        this.$refs.message.onanimationiteration = e =>
        {
            let anim = this.$refs.message.style.animation.slice();
            this.getMessage();
            this.$refs.message.style.animation = "none";
            void this.$refs.message.offsetWidth; //black magic
            this.$refs.message.style.animation = anim;
            Vue.nextTick(() =>
            {
                if(this.$refs.message.style.animationDuration === "")
                {
                    this.$refs.message.style.animationDuration = this.animationDuration + "s";
                }
            });
        };
    },
    template: `<div class="news-ticker">
    <span ref="message" :style="{'animation-duration': animationDuration + 's'}" v-html="currentMessage"></span>
</div>`
})