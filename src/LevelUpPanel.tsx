import { Grid, TextField } from "@mui/material";
import React from "react";
import { LocalStorageKeys } from "./Status";
import { Int } from "./Utils";
// const characterLevelData = require("./character-level-data.json");
const outpostDefenceData = require("./outpost-defence-data.json");

const toCoreDust = (outpostDefenceLevel: number, num: number, hours: number): number => {
    let level = Math.min(100, outpostDefenceLevel);
    for (let r of outpostDefenceData) {
        if (r.level === level) {
            return Math.floor(r.coreDust * hours * 60 * 1.45) * num;
        }
    }
    return 0;
};

const LevelUpPanel = () => {
    const [outpostDefenceLevel, setOutpostDefenceLevel] = React.useState<string>("");
    const [coreDust, setCoreDust] = React.useState<string>("0");
    const [coreDust1H, setCoreDust1H] = React.useState<string>("0");
    const [coreDust2H, setCoreDust2H] = React.useState<string>("0");
    const [coreDust8H, setCoreDust8H] = React.useState<string>("0");
    const [coreDust12H, setCoreDust12H] = React.useState<string>("0");
    const [coreDust24H, setCoreDust24H] = React.useState<string>("0");

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

    React.useEffect(() => {
        // 基地防御
        setOutpostDefenceLevel(localStorage.getItem(LocalStorageKeys.OUTPOST_DEFENCE_LEVEL) || "50");
        // コアダスト
        coreDustParams.map(p => {
            p.setter(localStorage.getItem(p.localStorageKey) || "");
        });
    }, []);
    React.useEffect(() => {
        localStorage.setItem(LocalStorageKeys.OUTPOST_DEFENCE_LEVEL, outpostDefenceLevel);
    }, [outpostDefenceLevel]);
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

    const totalCoreDust = Int(coreDust) + 
        toCoreDust(Int(outpostDefenceLevel), Int(coreDust1H), 1) +
        toCoreDust(Int(outpostDefenceLevel), Int(coreDust2H), 2) +
        toCoreDust(Int(outpostDefenceLevel), Int(coreDust8H), 8) +
        toCoreDust(Int(outpostDefenceLevel), Int(coreDust12H), 12) +
        toCoreDust(Int(outpostDefenceLevel), Int(coreDust24H), 24);
    
    return (
        <React.Fragment>
            <br/>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12}>
                    <TextField label="基地防御レベル" value={outpostDefenceLevel} onChange={e => {
                        setOutpostDefenceLevel(e.target.value);
                    }} variant="outlined" size="small" fullWidth />
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
                    <TextField label="コアダスト(合計)" value={totalCoreDust} onChange={e => {
                        setOutpostDefenceLevel(e.target.value);
                    }} variant="filled" fullWidth disabled />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}
export default LevelUpPanel;