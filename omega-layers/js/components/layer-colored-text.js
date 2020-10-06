Vue.component("layer-colored-text", {
    props: ["text", "layer"],
    computed: {
        textColor: function()
        {
            let h = 33 * this.layer.layer;
            if(this.layer.layer >= 96)
            {
                h = new Random(this.layer.layer).nextDouble() * 360;
            }
            let s = Math.min(100, 10 * this.layer.layer);
            return "hsl(" + h + ", " + s + "%, 50%)";
        },
        textGlow: function()
        {
            let thickness = 0.025 * this.layer.layer;
            let t = [Math.min(0.7, thickness), Math.min(0.7, thickness / 2),
                Math.min(0.7, Math.max(0, thickness - 0.3) / 4)];
            let color = "currentcolor";
            return "0px 0px " + t[0] + "em currentcolor"+
                ",0px 0px " + t[1] + "em currentcolor"+
                ",0px 0px " + t[2] + "em currentcolor";
        },
        textAnim: function()
        {
            if(this.layer.layer >= 96)
            {
                let length = 15 / (1 + 0.01 * (this.layer.layer - 96));
                return "resource-hue-spin " + length + "s linear infinite";
            }
            return "none";
        }
    },
    methods:
    {
        getStyle: function()
        {
            let styles = {animation: this.textAnim};
            if(game.settings.resourceColors)
            {
                styles.color = this.textColor;
            }
            if(game.settings.resourceGlow)
            {
                styles.textShadow = this.textGlow;
            }
            return styles;
        }
    },
    template: `<span :style="getStyle()"><slot></slot></span>`
})