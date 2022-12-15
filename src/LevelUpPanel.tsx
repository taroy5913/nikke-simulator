import { Grid, InputAdornment, TextField, Typography } from "@mui/material";
import React from "react";
import { LocalStorageKeys } from "./Status";
import { Int } from "./Utils";
// const characterLevelData = require("./character-level-data.json");
const outpostDefenceData = require("./outpost-defence-data.json");

enum MaterialType {
    CORE_DUST = "CORE_DUST",
    BATTLE_DATA = "BATTLE_DATA",
    CREDITS = "CREDITS"
}
const toMaterials = (
    materialType: MaterialType,
    outpostDefenceLevel: number,
    num: number,
    hours: number
): number => {
    let level = Math.min(100, outpostDefenceLevel);
    if (level < 1) {
        return 0;
    }
    let factor = 1.0;
    let materials = 0;
    let r = outpostDefenceData[level-1];
    if (materialType === MaterialType.CORE_DUST) {
        factor = 1.45;
        materials = r.coreDust;
        return Math.floor(materials * factor * 60) * hours * num;
    } else if (materialType === MaterialType.BATTLE_DATA) {
        factor = 1.45 / 1000;
        materials = r.battleData + 1; // NOTE: 記載の値から+1しないと合わないので、注意
    } else if (materialType === MaterialType.CREDITS) {
        factor = 1.6 / 1000;
        materials = r.credits + 1; // NOTE: 記載の値から+1しないと合わないので、注意
    }
    return Math.floor(materials * factor * 60 * hours * num);
};

const LevelUpPanel = () => {
    // 基地防御レベル
    const [outpostDefenceLevel, setOutpostDefenceLevel] = React.useState<string>("");
    // コアダスト
    const [coreDust, setCoreDust] = React.useState<string>("0");
    const [coreDust1H, setCoreDust1H] = React.useState<string>("0");
    const [coreDust2H, setCoreDust2H] = React.useState<string>("0");
    const [coreDust8H, setCoreDust8H] = React.useState<string>("0");
    const [coreDust12H, setCoreDust12H] = React.useState<string>("0");
    const [coreDust24H, setCoreDust24H] = React.useState<string>("0");
    // バトルデータ
    const [battleData, setBattleData] = React.useState<string>("0");
    const [battleData1H, setBattleData1H] = React.useState<string>("0");
    const [battleData2H, setBattleData2H] = React.useState<string>("0");
    const [battleData8H, setBattleData8H] = React.useState<string>("0");
    const [battleData12H, setBattleData12H] = React.useState<string>("0");
    const [battleData24H, setBattleData24H] = React.useState<string>("0");
    // クレジット
    const [credits, setCredits] = React.useState<string>("0");
    const [credits1H, setCredits1H] = React.useState<string>("0");
    const [credits2H, setCredits2H] = React.useState<string>("0");
    const [credits8H, setCredits8H] = React.useState<string>("0");
    const [credits12H, setCredits12H] = React.useState<string>("0");
    const [credits24H, setCredits24H] = React.useState<string>("0");

    const coreDustParams = [{
        name: "coreDust",
        label: "コアダスト",
        setter: setCoreDust,
        value: coreDust,
        localStorageKey: LocalStorageKeys.CORE_DUST
    }, {
        name: "coreDust1H",
        label: "コアダスト(1時間)",
        setter: setCoreDust1H,
        value: coreDust1H,
        localStorageKey: LocalStorageKeys.CORE_DUST_1H
    }, {
        name: "coreDust2H",
        label: "コアダスト(2時間)",
        setter: setCoreDust2H,
        value: coreDust2H,
        localStorageKey: LocalStorageKeys.CORE_DUST_2H
    }, {
        name: "coreDust8H",
        label: "コアダスト(8時間)",
        setter: setCoreDust8H,
        value: coreDust8H,
        localStorageKey: LocalStorageKeys.CORE_DUST_8H
    }, {
        name: "coreDust12H",
        label: "コアダスト(12時間)",
        setter: setCoreDust12H,
        value: coreDust12H,
        localStorageKey: LocalStorageKeys.CORE_DUST_12H
    }, {
        name: "coreDust24H",
        label: "コアダスト(24時間)",
        setter: setCoreDust24H,
        value: coreDust24H,
        localStorageKey: LocalStorageKeys.CORE_DUST_24H
    }];
    const battleDataParams = [{
        name: "battleData",
        label: "バトルデータ",
        setter: setBattleData,
        value: battleData,
        localStorageKey: LocalStorageKeys.BATTLE_DATA
    }, {
        name: "battleData1H",
        label: "バトルデータ(1時間)",
        setter: setBattleData1H,
        value: battleData1H,
        localStorageKey: LocalStorageKeys.BATTLE_DATA_1H
    }, {
        name: "battleData2H",
        label: "バトルデータ(2時間)",
        setter: setBattleData2H,
        value: battleData2H,
        localStorageKey: LocalStorageKeys.BATTLE_DATA_2H
    }, {
        name: "battleData8H",
        label: "バトルデータ(8時間)",
        setter: setBattleData8H,
        value: battleData8H,
        localStorageKey: LocalStorageKeys.BATTLE_DATA_8H
    }, {
        name: "battleData12H",
        label: "バトルデータ(12時間)",
        setter: setBattleData12H,
        value: battleData12H,
        localStorageKey: LocalStorageKeys.BATTLE_DATA_12H
    }, {
        name: "battleData24H",
        label: "バトルデータ(24時間)",
        setter: setBattleData24H,
        value: battleData24H,
        localStorageKey: LocalStorageKeys.BATTLE_DATA_24H
    }];
    const creditsParams = [{
        name: "credits",
        label: "クレジット",
        setter: setCredits,
        value: credits,
        localStorageKey: LocalStorageKeys.CREDITS
    }, {
        name: "credits1H",
        label: "クレジット(1時間)",
        setter: setCredits1H,
        value: credits1H,
        localStorageKey: LocalStorageKeys.CREDITS_1H
    }, {
        name: "credits2H",
        label: "クレジット(2時間)",
        setter: setCredits2H,
        value: credits2H,
        localStorageKey: LocalStorageKeys.CREDITS_2H
    }, {
        name: "credits8H",
        label: "クレジット(8時間)",
        setter: setCredits8H,
        value: credits8H,
        localStorageKey: LocalStorageKeys.CREDITS_8H
    }, {
        name: "credits12H",
        label: "クレジット(12時間)",
        setter: setCredits12H,
        value: credits12H,
        localStorageKey: LocalStorageKeys.CREDITS_12H
    }, {
        name: "credits24H",
        label: "クレジット(24時間)",
        setter: setCredits24H,
        value: credits24H,
        localStorageKey: LocalStorageKeys.CREDITS_24H
    }];

    React.useEffect(() => {
        // 基地防御
        setOutpostDefenceLevel(localStorage.getItem(LocalStorageKeys.OUTPOST_DEFENCE_LEVEL) || "50");
        // コアダスト
        coreDustParams.map(p => {
            p.setter(localStorage.getItem(p.localStorageKey) || "");
        });
        // バトルデータ
        battleDataParams.map(p => {
            p.setter(localStorage.getItem(p.localStorageKey) || "");
        });
        // クレジット
        creditsParams.map(p => {
            p.setter(localStorage.getItem(p.localStorageKey) || "");
        });
    }, []);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.OUTPOST_DEFENCE_LEVEL, outpostDefenceLevel);
    }, [outpostDefenceLevel]);
    // コアダスト
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.CORE_DUST, coreDust);
    }, [coreDust]);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.CORE_DUST_1H, coreDust1H);
    }, [coreDust1H]);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.CORE_DUST_2H, coreDust2H);
    }, [coreDust2H]);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.CORE_DUST_8H, coreDust8H);
    }, [coreDust8H]);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.CORE_DUST_12H, coreDust12H);
    }, [coreDust12H]);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.CORE_DUST_24H, coreDust24H);
    }, [coreDust24H]);
    // バトルデータ
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.BATTLE_DATA, battleData);
    }, [battleData]);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.BATTLE_DATA_1H, battleData1H);
    }, [battleData1H]);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.BATTLE_DATA_2H, battleData2H);
    }, [battleData2H]);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.BATTLE_DATA_8H, battleData8H);
    }, [battleData8H]);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.BATTLE_DATA_12H, battleData12H);
    }, [battleData12H]);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.BATTLE_DATA_24H, battleData24H);
    }, [battleData24H]);
    // クレジット
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.CREDITS, credits);
    }, [credits]);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.CREDITS_1H, credits1H);
    }, [credits1H]);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.CREDITS_2H, credits2H);
    }, [credits2H]);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.CREDITS_8H, credits8H);
    }, [credits8H]);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.CREDITS_12H, credits12H);
    }, [credits12H]);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.CREDITS_24H, credits24H);
    }, [credits24H]);

    const totalCoreDust = Int(coreDust) + 
        toMaterials(MaterialType.CORE_DUST, Int(outpostDefenceLevel), Int(coreDust1H), 1) +
        toMaterials(MaterialType.CORE_DUST, Int(outpostDefenceLevel), Int(coreDust2H), 2) +
        toMaterials(MaterialType.CORE_DUST, Int(outpostDefenceLevel), Int(coreDust8H), 8) +
        toMaterials(MaterialType.CORE_DUST, Int(outpostDefenceLevel), Int(coreDust12H), 12) +
        toMaterials(MaterialType.CORE_DUST, Int(outpostDefenceLevel), Int(coreDust24H), 24);
    const totalBattleData = Int(battleData) + 
        toMaterials(MaterialType.BATTLE_DATA, Int(outpostDefenceLevel), Int(battleData1H), 1) +
        toMaterials(MaterialType.BATTLE_DATA, Int(outpostDefenceLevel), Int(battleData2H), 2) +
        toMaterials(MaterialType.BATTLE_DATA, Int(outpostDefenceLevel), Int(battleData8H), 8) +
        toMaterials(MaterialType.BATTLE_DATA, Int(outpostDefenceLevel), Int(battleData12H), 12) +
        toMaterials(MaterialType.BATTLE_DATA, Int(outpostDefenceLevel), Int(battleData24H), 24);
    const totalCredits = Int(credits) + 
        toMaterials(MaterialType.CREDITS, Int(outpostDefenceLevel), Int(credits1H), 1) +
        toMaterials(MaterialType.CREDITS, Int(outpostDefenceLevel), Int(credits2H), 2) +
        toMaterials(MaterialType.CREDITS, Int(outpostDefenceLevel), Int(credits8H), 8) +
        toMaterials(MaterialType.CREDITS, Int(outpostDefenceLevel), Int(credits12H), 12) +
        toMaterials(MaterialType.CREDITS, Int(outpostDefenceLevel), Int(credits24H), 24);

    return (
        <React.Fragment>
            <br/>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12}>
                    <Typography>合計</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField label="コアダスト" value={totalCoreDust} 
                        variant="filled" size="small" fullWidth disabled />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField label="バトルデータ" value={totalBattleData + "k"} 
                        variant="filled" size="small" fullWidth disabled />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField label="クレジット" value={totalCredits + "k"}
                        variant="filled" size="small" fullWidth disabled />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField label="基地防御レベル" value={outpostDefenceLevel} onChange={e => {
                        setOutpostDefenceLevel(e.target.value);
                    }} variant="outlined" size="small" fullWidth />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography>コアダスト</Typography>
                </Grid>
                {coreDustParams.map(p => {
                    return (
                        <Grid item xs={6} sm={4}>
                            <TextField label={p.label} value={p.value} onChange={e => {
                                p.setter(e.target.value);
                            }} variant="outlined" size="small" fullWidth />
                        </Grid>
                    );                    
                })}
                <Grid item xs={12} sm={12}>
                    <Typography>バトルデータ</Typography>
                </Grid>
                {battleDataParams.map((p, i) => {
                    return (
                        <Grid item xs={6} sm={4}>
                            <TextField
                                label={p.label}
                                value={p.value}
                                onChange={e => {
                                    p.setter(e.target.value);
                                }}
                                variant="outlined"
                                size="small"
                                fullWidth
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">{i===0?"k":""}</InputAdornment>,
                                }} 
                            />
                        </Grid>
                    );                    
                })}
                <Grid item xs={12} sm={12}>
                    <Typography>クレジット</Typography>
                </Grid>
                {creditsParams.map((p, i) => {
                    return (
                        <Grid item xs={6} sm={4}>
                            <TextField
                                label={p.label}
                                value={p.value}
                                onChange={e => {
                                    p.setter(e.target.value);
                                }}
                                variant="outlined"
                                size="small"
                                fullWidth 
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">{i===0?"k":""}</InputAdornment>,
                                }}
                            />
                        </Grid>
                    );                    
                })}
            </Grid>
            <Typography variant="caption">※タクティクアカデミーは全て終えている前提で計算しています</Typography>
        </React.Fragment>
    )
}
export default LevelUpPanel;