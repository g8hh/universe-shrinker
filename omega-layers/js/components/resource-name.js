Vue.component("resource-name", {
    props: ["layer"],
    template: `<layer-colored-text :layer="layer" v-html="layer.name"></layer-colored-text>`
})