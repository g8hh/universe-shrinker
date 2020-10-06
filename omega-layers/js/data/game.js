var game = {
    version: "b1",
    layers: [],
    currentLayer: null,
    currentChallenge: null,
    timeSpent: 0,
    settings:
    {
        tab: "Layers",
        showAllLayers: true,
        showMinLayers: 5,
        showMaxLayers: 5,
        layerTickSpeed: 1,
        buyMaxAlways10: true,
        disableBuyMaxOnHighestLayer: false,
        resourceColors: true,
        resourceGlow: true,
        theme: "dark.css"
    }
};

let initialGame = functions.getSaveString();