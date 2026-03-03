window.EXPEDITION_MAP_FEATURES = {
  terrainMasses: [
    {
      id: "A",
      d: "M0 400C210 382 455 360 700 350L700 900C480 896 245 898 0 900Z",
      fill: "#9bbd7a",
    },
    {
      id: "B",
      d: "M700 450C930 436 1162 418 1400 400L1400 950C1164 948 928 950 700 950Z",
      fill: "#7fa25e",
    },
    {
      id: "C",
      d: "M1400 350C1600 348 1800 348 2000 350L2000 900C1820 914 1600 936 1400 950Z",
      fill: "#6d8f52",
    },
    {
      id: "D",
      d: "M0 900C520 882 980 884 1450 900C1670 908 1840 928 2000 952L2000 1200L0 1200Z",
      fill: "#9bbd7a",
    },
  ],

  mountains: [
    { variant: "MountainSymbolA", x: 200, y: 220, scale: 0.98, rotate: -4 },
    { variant: "MountainSymbolB", x: 400, y: 200, scale: 1.04, rotate: 3 },
    { variant: "MountainSymbolC", x: 650, y: 230, scale: 0.94, rotate: -2 },
    { variant: "MountainSymbolA", x: 900, y: 210, scale: 1.02, rotate: 2 },
    { variant: "MountainSymbolB", x: 1150, y: 240, scale: 0.96, rotate: -3 },
    { variant: "MountainSymbolC", x: 1400, y: 220, scale: 1.0, rotate: 2 },
    { variant: "MountainSymbolA", x: 1650, y: 230, scale: 0.94, rotate: -2 },
    { variant: "MountainSymbolB", x: 1850, y: 210, scale: 0.98, rotate: 3 },
  ],

  forests: [
    {
      id: "left-valley",
      centerX: 350,
      centerY: 600,
      radius: 250,
      spacing: 30,
      treeScaleMin: 0.8,
      treeScaleMax: 1.1,
      variants: ["TreeSymbolA", "TreeSymbolB"],
    },
    {
      id: "foothills",
      centerX: 1500,
      centerY: 650,
      radius: 200,
      spacing: 30,
      treeScaleMin: 0.8,
      treeScaleMax: 1.1,
      variants: ["TreeSymbolA", "TreeSymbolB"],
    },
  ],

  riverSystem: {
    main: {
      d: "M0 500C170 518 290 540 400 550C540 562 680 590 800 600C960 614 1080 510 1200 500C1332 490 1494 546 1600 550C1760 556 1890 520 2000 500",
      width: 60,
      bankColor: "#3f6f73",
      fillColor: "#6fa9ad",
    },
    tributaries: [
      {
        d: "M900 600C916 662 914 742 900 800",
        width: 36,
      },
    ],
    highlightWidth: 10,
  },

  landmark: {
    type: "waterfall-cliff",
    x: 1000,
    y: 650,
    cliffHeight: 200,
    poolRx: 100,
    poolRy: 50,
  },

  roads: [
    {
      id: "road-1",
      d: "M200 800Q800 900 1400 850",
      width: 14,
      color: "#c9a86a",
    },
    {
      id: "road-2",
      d: "M300 450Q600 500 900 550",
      width: 14,
      color: "#c9a86a",
    },
  ],

  poi: [
    { type: "PoiCabinSymbol", x: 300, y: 750, scale: 1 },
    { type: "PoiBridgeSymbol", x: 800, y: 600, scale: 1 },
    { type: "PoiDockSymbol", x: 1000, y: 750, scale: 1 },
    { type: "PoiTowerSymbol", x: 1500, y: 500, scale: 1 },
    { type: "PoiCampSymbol", x: 1200, y: 850, scale: 1 },
    { type: "PoiSignSymbol", x: 500, y: 820, scale: 1 },
  ],
};
