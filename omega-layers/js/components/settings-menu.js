Vue.component("settings-menu", {
    data: function ()
    {
        return {
            settings: game.settings,
            exportString: ""
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
        },
        hardResetGame: () => functions.hardResetGame()
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
    <button @click="save()">Save Game</button>
    <button @click="exportGame()">Export</button>
    <button @click="importGame()">Import</button>
    <button @click="hardResetGame()">Wipe Game</button>
</div>
<div class="settings-row">
    <textarea class="export" v-model="exportString"></textarea>
</div>
</div>`
})