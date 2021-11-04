/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'Save': '保存',
    'Export': '导出',
    'Import': '导入',
    'Settings': '设置',
    'Achievements': '成就',
    'Statistics': '统计',
    'Changelog': '更新日志',
    'Hotkeys': '快捷键',
    'ALL': '全部',
    'Default': '默认',
    'AUTO': '自动',
    'default': '默认',
    "points": "点数",
    "Reset for +": "重置得到 + ",
    "Currently": "当前",
    "Effect": "效果",
    "Cost": "成本",
    "Goal:": "目标:",
    "Reward": "奖励",
    "Start": "开始",
    "Exit Early": "提前退出",
    "Finish": "完成",
    "Milestone Gotten!": "获得里程碑！",
    "Milestones": "里程碑",
    "Completed": "已完成",
    "Congratulations, YOU WON!": "恭喜你，你赢了！",
    "Homepage": "主页",
    "Options": "选项",
    "Name": "名称",
    "per Second": "每秒",
    "Production": "生产",
    "Resistance": "电阻",
    "Tabs instead of just One": "标签而不是一个",
    "Universe": "宇宙",
    "The Game saves automatically every 30 seconds, but you can save manually to go really sure.": "游戏每 30 秒自动保存一次，但您可以手动保存以确保安全。",
    "Upgrade": "升级",
    "You Shrunk everything there is, and you caused the Heat Death of every atom, ultimatively leaving you with nothing left.\n        I hope you had fun playing :": "你缩小了一切，你导致了每个原子的热寂，最终让你一无所有。\n希望你玩得开心：",
    "You are currently shrinking a": "您目前正在缩小一个",
    "Shrinkers": "收缩器",
    "Save Game": "保存游戏",
    "Level": "等级",
    "Import (from Text Field": "导入 (从文本框",
    "If you want to play again, you can start over": "如果你想再玩，你可以重新开始",
    "Goal": "目标",
    "Diameter": "直径",
    "Rho Upgrades": "Rho 升级",
    "Rho-Particles (ρ": "Rho-粒子 (ρ",
    "Shrink Power": "收缩力",
    "You beat the Game in {{formatTime(timeSpent)}}. Feel free to compare this with others. Who was the fastest?": "您在 {{formatTime(timeSpent)}} 中击败了游戏。 随意将此与其他人进行比较。 谁是最快的？",
    "This is a submission for the 7 day Incremental Game Jam 2020": "这是 7 天增量游戏Jam 2020 的提交",
    "You get": "你获得了",
    "Universe Layers instead of the current selected": "宇宙层而不是当前选定的层",
    "Theme": "主题",
    "Terminal": "终端",
    "Standard": "标准",
    "Shrinking Expertise": "收缩专业知识",
    "Shrink Synergy": "收缩协同",
    "Shrink Boost": "收缩提升",
    "Scientific": "科学计数法",
    "Rho Synergy": "Rho协同",
    "Rho Boost": "Rho提升",
    "Notation": "符号",
    "Logarithm": "对数",
    "Light": "浅色",
    "Infinity": "无限",
    "High Contrast": "高对比度",
    "Engineering": "工程符号",
    "Dark Blue": "深蓝",
    "Dark (Variation": "深色（变化",
    "Dark": "深色",
    "Cancer": "癌症",
    "Beautiful (truly": "漂亮（真的",
    "All Generators Shrink stronger based on total Generator Levels": "所有发生器根据总发生器等级收缩得更厉害",
    "All Generators Shrink faster": "所有发生器收缩得更快",
    "All Generators produce more Rho-Particles": "所有发生器产生更多的 Rho 粒子",
    "All Generators are stronger based on total Generator Levels": "基于总发生器级别，所有发生器都更强大",
    "All Generators are stronger based on how far you shrunk the Universe": "根据你缩小宇宙的程度，所有发生器都变得更强大",
    "You are shrinking": "你在收缩",
    "You have shrunken": "你收缩了",
    "Passive Shrinking": "被动收缩",
    "per second.": "每秒。",
    "Respec": "重洗",
    "Retain Layering": "保留分层",
    "Current Tab → All Tabs": "当前标签 → 全部标签",
    "from it": "从它",
    "Gain more Theta Energy on Heat Death": "热寂时获得更多 西塔能量",
    "Going small with Power": "用力量变小",
    "Heat Death everything and gain": "热寂一切和获得",
    "in return.": "作为回报。",
    "Max": "最大",
    "Keep your highest Universe reached (don't go back to Universe": "保持你到达的最高宇宙（不回到宇宙",
    "Max all affects all tabs (except Heat Death) instead of the current selected": "最大全部 影响所有选项卡（热寂除外）而不是当前选定的",
    "More Heat, more Theta!": "更多热量，更多西塔！",
    "More Power, more Rho": "更大力量，更多的 Rho",
    "MultiMultiverse Upgrade": "多元宇宙升级",
    "Rho Fortification": "Rho堡垒",
    "Rho Fortification Fortification": "Rho 防御工事",
    "Shrink multiple Verses at once": "一次收缩多宇宙",
    "Shrink Universes lower than you have selected at a reduced rate": "以降低的速度收缩低于您选择的宇宙",
    "Shrinking and Emsmalling": "收缩和变小",
    "Shrinking the Shrinking": "收缩收缩",
    "Unified Maxing": "统一最大",
    "Universe Layers": "宇宙层",
    "Universe Upgrade Power": "宇宙升级力量",
    "Universes": "宇宙",
    "All Generators produce more Rho Particles": "所有发生器产生更多的 Rho 粒子",
    "All Generators produce more Rho-Particles based on total Verses shrunk": "所有生成器会根据减少的总宇宙产生更多的 Rho粒子",
    "All Generators shrink faster based on shrunk Verses you have right now": "根据您现在拥有的缩小的宇宙，所有生成器都会更快地缩小",
    "All Generators Shrink stronger": "所有发生器收缩得更厉害",
    "All Generators shrink stronger": "所有发生器收缩得更厉害",
    "All Shrinking Upgrades of Universe Layers are stronger": "宇宙层的所有收缩升级都更强",
    "Bought": "已购买",
    "Buying Theta Upgrades will increase the Price of several other Theta Upgrades. Choose wisely!": "购买 西塔 升级将提高其他几个 西塔 升级的价格。 做出明智的选择！",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "Teraverses": "Tera宇宙",
    "Teraverse": "Tera宇宙",
    "Multiverse": "多元宇宙",
    "Multiverses": "多元宇宙",
    "Megaverses": "Mega宇宙",
    "Megaverse": "Mega宇宙",
    "Gigaverse": "Giga宇宙",
    "Gigaverses": "Giga宇宙",
    "Exaverse": "Exa宇宙",
    "Exaverses": "Exa宇宙",
    "Petaverses": "Peta宇宙",
    "Petaverse": "Peta宇宙",
    "Omniverses": "欧米伽宇宙",
    "Omniverse": "欧米伽宇宙",
    "Zettaverses": "Zetta宇宙",
    "Zettaverse": "Zetta宇宙",
    "Yottaverses": "Yotta宇宙",
    "Yottaverse": "Yotta宇宙",

    //树游戏
    'Loading...': '加载中...',
    'ALWAYS': '一直',
    'HARD RESET': '硬重置',
    'Export to clipboard': '导出到剪切板',
    'INCOMPLETE': '不完整',
    'HIDDEN': '隐藏',
    'AUTOMATION': '自动',
    'NEVER': '从不',
    'ON': '打开',
    'OFF': '关闭',
    'SHOWN': '显示',
    'Play Again': '再次游戏',
    'Keep Going': '继续',
    'The Modding Tree Discord': '模型树Discord',
    'You have': '你有',
    'It took you {{formatTime(player.timePlayed)}} to beat the game.': '花费了 {{formatTime(player.timePlayed)}} 时间去通关游戏.',
    'Congratulations! You have reached the end and beaten this game, but for now...': '恭喜你！ 您已经结束并通关了本游戏，但就目前而言...',
    'Main Prestige Tree server': '主声望树服务器',
    'Reach {{formatWhole(ENDGAME)}} to beat the game!': '达到 {{formatWhole(ENDGAME)}} 去通关游戏!',
    "Loading... (If this takes too long it means there was a serious error!": "正在加载...（如果这花费的时间太长，则表示存在严重错误！",
    'Loading... (If this takes too long it means there was a serious error!)←': '正在加载...（如果时间太长，则表示存在严重错误！）←',
    'Main\n\t\t\t\tPrestige Tree server': '主\n\t\t\t\t声望树服务器',
    'The Modding Tree\n\t\t\t\t\t\t\tDiscord': '模型树\n\t\t\t\t\t\t\tDiscord',
    'Please check the Discord to see if there are new content updates!': '请检查 Discord 以查看是否有新的内容更新！',
    'aqua': '水色',
    'AUTOMATION, INCOMPLETE': '自动化，不完整',
    'LAST, AUTO, INCOMPLETE': '最后，自动，不完整',
    'NONE': '无',
    'P: Reset for': 'P: 重置获得',
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "(-": "(-",
    "(+": "(+",
    "(": "(",
    "-": "-",
    "+": "+",
    " ": " ",
    ": ": "： ",
    "\n": "",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    //树游戏
    "\t\t\t": "\t\t\t",
    "\n\n\t\t": "\n\n\t\t",
    "\n\t\t": "\n\t\t",
    "Show Milestones: ": "显示里程碑：",
    "Autosave: ": "自动保存: ",
    "Offline Prod: ": "离线生产: ",
    "Completed Challenges: ": "完成的挑战: ",
    "High-Quality Tree: ": "高质量树贴图: ",
    "Offline Time: ": "离线时间: ",
    "Theme: ": "主题: ",
    "Anti-Epilepsy Mode: ": "抗癫痫模式：",
    "In-line Exponent: ": "直列指数：",
    "Single-Tab Mode: ": "单标签模式：",
    "Time Played: ": "已玩时长：",
    "Matter Condenser ": "物质冷凝器",
    "Max All ": "最大全部",
    "Lv.": "等级",
    "Heat Death (": "热寂 (",
    "Heat Death resets all progress you made so far, but you will get ": "热寂会重置你目前取得的所有进度，但你会得到",
    "Messed up? No worries, Respec to get all spent ": "搞砸了？ 不用担心，重洗 花掉所有的钱",
    "Theta Energy (": "西塔能量 (",
    "back, but you do a Heat Death without gaining ": "回来，但你在没有获得的情况下进行了热寂",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀
var cnPostfix = {
    ":": "：",
    "：": "：",
    ": ": "： ",
    "： ": "： ",
    "/s)": "/s)",
    "/s": "/s",
    ")": ")",
    "%": "%",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": " ",
    "\n": "",
    "\n\t\t\t": "\n\t\t\t",
    "\t\t\n\t\t": "\t\t\n\t\t",
    "\t\t\t\t": "\t\t\t\t",
    "\n\t\t": "\n\t\t",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^(\d+)$/,
    /^\s*$/, //纯空格
    /^([\d\.]+)e(\d+)$/,
    /^([\d\.]+)$/,
    /^([\d\.]+)∞$/,
    /^([\d\.]+)∞ ρ$/,
    /^\^([\d\.]+) → \^([\d\.]+)$/,
    /^x([\d\.]+) → x([\d\.]+)$/,
    /^x([\d\.]+)∞ → x([\d\.]+)∞$/,
    /^\÷([\d\.]+)$/,
    /^([\d\.]+) M ρ$/,
    /^([\d\.]+) B ρ$/,
    /^([\d\.]+) Qa ρ$/,
    /^ee([\d\.]+) ρ$/,
    /^([\d\.]+) B Ly$/,
    /^([\d\.]+)s$/,
    /^([\d\.]+)x$/,
    /^x([\d\.]+)$/,
    /^([\d\.,]+)$/,
    /^([\d\.,]+) ρ$/,
    /^([\d\.,]+)∞ θ$/,
    /^([\d\.,]+)x$/,
    /^x([\d\.,]+)$/,
    /^([\d\.]+) \/ ([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+) ρ$/,
    /^x([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)x$/,
    /^[\u4E00-\u9FA5]+$/
];
var cnExcludePostfix = [
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
//换行加空格：\n(.+)
var cnRegReplace = new Map([
    [/^You are gaining (.+) elves per second$/, '你每秒获得 $1 精灵'],
    [/^You have (.+) points$/, '你有 $1 点数'],
    [/^Next at (.+) points$/, '下一个在 $1 点数'],
	[/^([\d\.]+)\/sec$/, '$1\/秒'],
	[/^([\d\.,]+)\/sec$/, '$1\/秒'],
	[/^([\d\.]+)e([\d\.,]+)\/sec$/, '$1e$2\/秒'],
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^([\d\.]+)e([\d\.,]+) points$/, '$1e$2 点数'],
    [/^([\d\.]+)∞ Petaverses$/, '$1∞ Peta宇宙'],
    [/^([\d\.]+) Multiverse$/, '$1 多元宇宙'],
    [/^([\d\.]+) Universe$/, '$1 宇宙'],
    [/^([\d\.,]+) Universes$/, '$1 宇宙'],
    [/^([\d\.]+)e([\d\.,]+) Universes$/, '$1e$2 宇宙'],
    [/^([\d\.]+)∞ Yottaverses$/, '$1∞ Yotta宇宙'],
    [/^([\d\.]+) Zettaverse$/, '$1 Zetta宇宙'],
    [/^([\d\.]+) Megaverse$/, '$1 Mega宇宙'],
    [/^([\d\.]+)e([\d\.,]+) elves$/, '$1e$2 精灵'],
    [/^([\d\.,]+) Yottaverses$/, '$1 Yotta宇宙'],
    [/^([\d\.,]+) Zettaverses$/, '$1 Zetta宇宙'],
    [/^([\d\.,]+) Multiverses$/, '$1 多元宇宙'],
    [/^([\d\.,]+) Megaverses$/, '$1 Mega宇宙'],
    [/^([\d\.,]+) Exaverses$/, '$1 Exa宇宙'],
    [/^([\d\.,]+) Omniverses$/, '$1 欧米伽宇宙'],
    [/^([\d\.,]+).([\d\.]+)∞$/, '$1.$2∞'],
    [/^([\d\.,]+).([\d\.]+)∞ ρ$/, '$1.$2∞ ρ'],
    [/^\*(.+) to electricity gain$/, '\*$1 到电力增益'],
    [/^(.+) Planck Length$/, '$1 普朗克长度'],
    [/^Cost: (.+) points$/, '成本：$1 点数'],
    [/^Req: (.+) \/ (.+) elves$/, '成本：$1 \/ $2 精灵'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);