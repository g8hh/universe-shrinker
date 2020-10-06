Vue.component("settings-menu", {
    data: function ()
    {
        return {
            settings: game.settings,
            exportString: "The exported Save String will appear here. Keep it somewhere safe." +
                " Click Import to load the save string from the text field.",
            themes: [["Dark", "dark.css"], ["Light", "light.css"], ["Neon", "neon.css"], ["Godot Blue", "darkblue.css"]]
        }
    },
    methods: {
        save: () => functions.saveGame(),
        exportGame: function()
        {
            this.exportString = functions.getSaveString();
        },
        importGame: function()
        {
            functions.loadGame(this.exportString);
            game.settings.tab = "Layers";
        },
        hardResetGame: () => functions.hardResetGame(),
        setTheme: css => functions.setTheme(css)
    },
    template: `<div class="settings">
<div class="settings-row">
    <label>Show all Layers <input type="checkbox" v-model="settings.showAllLayers"/></label>
</div>
<div class="settings-row">
    <label>Show first <input :disabled="settings.showAllLayers" type="number" min="1" max="5" v-model="settings.showMinLayers"/> Layers</label>
    <label>Show last <input :disabled="settings.showAllLayers" type="number" min="1" max="5" v-model="settings.showMaxLayers"/> Layers</label>
</div>
<div class="settings-row">
    <label>Buy Max always buys until 10 <input type="checkbox" v-model="settings.buyMaxAlways10"/></label>
    <label>Disable Buy Max on highest unlocked Layer <input type="checkbox" v-model="settings.disableBuyMaxOnHighestLayer"/></label>
</div>
<div class="settings-row">
    <label>Allow Resource Colors <input type="checkbox" v-model="settings.resourceColors"/></label>
    <label>Allow Resource Glow <input type="checkbox" v-model="settings.resourceGlow"/></label>
</div>
<div class="settings-row">
    <label>Theme <button v-for="t in themes" @click="setTheme(t[1])">{{t[0]}}</button></label>
</div>
<div class="settings-row">
    <button @click="save()">Save Game</button>
    <button @click="exportGame()">Export</button>
    <button @click="importGame()">Import</button>
    <button @click="hardResetGame()">Wipe Game</button>
</div>
<div class="settings-row">
    <textarea class="export" v-model="exportString"></textarea>
</div>
<div class="settings-row">
    <p>Controls: M to Max All on the selected Layer, Left and Right Arrows to change Layers</p>
</div>
</div>`
})