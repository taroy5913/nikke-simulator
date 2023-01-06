import { Box, Checkbox, createTheme, CssBaseline, Divider, FormControl, FormControlLabel, FormGroup, Grid, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, ToggleButton, Typography } from '@mui/material';
import React from 'react';
import { LocalStorageKeys } from './Status';
import { Int } from './Utils';

const sortForWishlist = (nikkes: number[]):number[] => {
  let a = nikkes.filter(x => x < 4);
  a.sort().reverse();
  let b = nikkes.filter(x => x >= 4);
  return a.concat(b);
}

const satisfied = (nikkes: number[], advancedNikkes: number[]):boolean => {
  return (advancedNikkes.filter(x => x >= 4).length + nikkes.filter(x => x >= 4).length) >= 5;
}
const TRIBE_TOWER_INDEX_TETRA = 0;
const TRIBE_TOWER_INDEX_ELYSION = 1;
const TRIBE_TOWER_INDEX_MISSILIS = 2;
const TRIBE_TOWER_INDEX_PILGRIM = 3;

const RewardConfig = {
  eventRewardGems: 300,
  eventRewardVouchers: 20,
  eventRewardAdvancedVouchers: 10,
  eventRewardHighQualityMolds: 10,
  eventRewardMiddleQualityMolds: 50,
  dailyMissionGems: 100,
  dailyMissionMiddleQualityMolds: 5,
  weeklyMissionGems: 300,
  weeklyMissionHighQualityMolds: 10,
  weeklyMissionVouchers: 1,
  subscriptionGems: 100,
  seasonPassMiddleQualityMolds: [10, 2, 2, 2, 10, 2, 2, 2, 2, 10, 2, 2, 2, 2, 10],
  premiumPassHighQualityMolds: [5, 3, 3, 3, 7, 3, 3, 3, 3, 7, 3, 3, 3, 3, 0],
  premiumPassVouchers: [5, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3],
  companyTribeTowers: [
    [TRIBE_TOWER_INDEX_TETRA],
    [TRIBE_TOWER_INDEX_ELYSION],
    [TRIBE_TOWER_INDEX_MISSILIS, TRIBE_TOWER_INDEX_PILGRIM],
    [TRIBE_TOWER_INDEX_TETRA],
    [TRIBE_TOWER_INDEX_ELYSION],
    [TRIBE_TOWER_INDEX_MISSILIS],
    [TRIBE_TOWER_INDEX_TETRA, TRIBE_TOWER_INDEX_ELYSION, TRIBE_TOWER_INDEX_MISSILIS, TRIBE_TOWER_INDEX_PILGRIM]
  ], // 曜日ごとの企業別トライブタワー
}
interface Props {
  duplicates: number[]; // no body, single, duplicate, triplicate
  vouchers: number;
  advancedVouchers: number;
  gems: number;
  otherwiseGemsPerDay: number;
  bodyLabelShopPoints: number;
  middleQualityMolds: number;
  highQualityMolds: number;
  friendPoints: number;
  numFriends: number;
  mileageShopPoints: number;
  advancedMileageShopPoints: number;
  useSubscription: boolean;
  usePremiumPass: boolean;
  useGemsForAdvanced: boolean;
  usePilgrimTower: boolean;
}
interface Sample {
  days: number;
  friendVouchers: number;
  spareBodies: number;
  advancedSpareBodies: number;
  vouchers: number;
  advancedVouchers: number;
  highQualityVouchers: number;
  middleQualityVouchers: number;
  companyVouchers: number;

  playerLevelUpGems: number;
  tribeTowerRewardGems: number;

  eventRewardGems: number;
  eventRewardVouchers: number;
  eventRewardAdvancedVouchers: number;
  eventRewardHighQualityMolds: number;
  eventRewardMiddleQualityMolds: number;
  dailyMissionGems: number;
  dailyMissionMiddleQualityMolds: number;
  weeklyMissionGems: number;
  weeklyMissionHighQualityMolds: number;
  weeklyMissionVouchers: number;
  subscriptionGems: number;

  otherwiseGems: number; // キャンペーンやアチーブメント、お知らせなど突発的にもらえるジュエル
  
  seasonPassMiddleQualityMolds: number;
  premiumPassHighQualityMolds: number;
  premiumPassVouchers: number;

  numPilgrims: number; // ピルグリム排出回数
  numAdvanced: number; // 期間限定排出回数
  numOtherwise: number; // (ピルグリムと期間限定を除く)一般SSR排出回数
}
const getDefaultSample = (): Sample => {
  return {
    days: 0,
    friendVouchers: 0,
    spareBodies: 0,
    advancedSpareBodies: 0,
    vouchers: 0,
    advancedVouchers: 0,
    companyVouchers: 0,
    highQualityVouchers: 0,
    middleQualityVouchers: 0,

    playerLevelUpGems: 0,
    tribeTowerRewardGems: 0,

    eventRewardGems: 0,
    eventRewardVouchers: 0,
    eventRewardAdvancedVouchers: 0,
    eventRewardHighQualityMolds: 0,
    eventRewardMiddleQualityMolds: 0,
    dailyMissionGems: 0,
    dailyMissionMiddleQualityMolds: 0,
    weeklyMissionGems: 0,
    weeklyMissionHighQualityMolds: 0,
    weeklyMissionVouchers: 0,
    subscriptionGems: 0,
    otherwiseGems: 0,
    seasonPassMiddleQualityMolds: 0,
    premiumPassHighQualityMolds: 0,
    premiumPassVouchers: 0,
    numOtherwise: 0,
    numPilgrims: 0,
    numAdvanced: 0
  }
}

const simulate = (props: Props): Sample => {
  const duplicates = props.duplicates; 
  let nikkes: number[] = [];
  for (let i = 0; i < duplicates.length; ++i) {
    for (let j = 0; j < duplicates[i]; ++j) {
      nikkes.push(i);
    }
  }
  let advancedNikkes: number[] = new Array(100).fill(0);
  let vouchers = props.vouchers;
  let advancedVouchers = props.advancedVouchers;
  
  let gems = props.gems;
  let bodyLabelShopPoints = props.bodyLabelShopPoints;
  let middleQualityMolds = props.middleQualityMolds;
  let highQualityMolds = props.highQualityMolds;
  
  let companiesMolds = [0, 0, 0, 0]; // TODO: add text field for pilgrim molds

  let friendPoints = props.friendPoints;
  let numFriends = props.numFriends;
  let mileageShopPoints = props.mileageShopPoints;
  let advancedMileageShopPoints = props.advancedMileageShopPoints;
  let res = getDefaultSample();
  for (let t = 0; t < 1000; ++t) {
    nikkes = sortForWishlist(nikkes);

    // daily mission
    const dailyMissionGems = RewardConfig.dailyMissionGems + Math.floor(Math.random() * 30);
    gems += dailyMissionGems; // daily mission + 派遣報酬
    res.dailyMissionGems += dailyMissionGems;
    middleQualityMolds += RewardConfig.dailyMissionMiddleQualityMolds; // daily mission
    res.dailyMissionMiddleQualityMolds += RewardConfig.dailyMissionMiddleQualityMolds;
    
    gems += props.otherwiseGemsPerDay;
    res.otherwiseGems += props.otherwiseGemsPerDay;

    if (props.useSubscription) {
      gems += RewardConfig.subscriptionGems;
      res.subscriptionGems += RewardConfig.subscriptionGems;
    }

    // player level up
    gems += 30;
    res.playerLevelUpGems += 30;

    // tribe tower
    const towerIndices = RewardConfig.companyTribeTowers[t % RewardConfig.companyTribeTowers.length]
    for (let towerIndex of towerIndices) {
      if ((towerIndex === TRIBE_TOWER_INDEX_PILGRIM) && !props.usePilgrimTower) {
        continue;
      }
      for (let dt = 0; dt < 3; ++dt) {
        const nt = t + dt;
        if (nt % 5 === 0) {
          // 5の倍数階ならジュエルx100, 企業別モールドx5
          gems += 100;
          res.tribeTowerRewardGems += 100;
          companiesMolds[towerIndex] += 5;
        } else {
          // 5の倍数階以外ならジュエルx50, 企業別モールドx1
          gems += 50;
          res.tribeTowerRewardGems += 50;
          companiesMolds[towerIndex] += 1;
        }
      }
    }

    // season pass
    if (t % 30 < RewardConfig.seasonPassMiddleQualityMolds.length) {
      middleQualityMolds += RewardConfig.seasonPassMiddleQualityMolds[t % 30];
      res.seasonPassMiddleQualityMolds += RewardConfig.seasonPassMiddleQualityMolds[t % 30];
      if (props.usePremiumPass) {
        highQualityMolds += RewardConfig.premiumPassHighQualityMolds[t % 30];
        vouchers += RewardConfig.premiumPassVouchers[t % 30];
        res.premiumPassHighQualityMolds += RewardConfig.premiumPassHighQualityMolds[t % 30];
        res.premiumPassVouchers += RewardConfig.premiumPassVouchers[t % 30];
      }
    }
    friendPoints += numFriends;
    
    // weekly mission
    if (t % 7 == 6) {
      gems += RewardConfig.weeklyMissionGems;
      highQualityMolds += RewardConfig.weeklyMissionHighQualityMolds;
      vouchers += RewardConfig.weeklyMissionVouchers;

      res.weeklyMissionGems += RewardConfig.weeklyMissionGems;
      res.weeklyMissionHighQualityMolds += RewardConfig.weeklyMissionHighQualityMolds;
      res.weeklyMissionVouchers += RewardConfig.weeklyMissionVouchers;
    }

    // event bonus
    if (t % 15 == 14) {
      gems += RewardConfig.eventRewardGems; // login bonus
      vouchers += RewardConfig.eventRewardVouchers; // login bonus + event mission achievements
      advancedVouchers += RewardConfig.eventRewardAdvancedVouchers;
      highQualityMolds += RewardConfig.eventRewardHighQualityMolds;
      middleQualityMolds += RewardConfig.eventRewardMiddleQualityMolds;

      res.eventRewardGems += RewardConfig.eventRewardGems;
      res.eventRewardVouchers += RewardConfig.eventRewardVouchers;
      res.eventRewardAdvancedVouchers += RewardConfig.eventRewardAdvancedVouchers;
      res.eventRewardHighQualityMolds += RewardConfig.eventRewardHighQualityMolds;
      res.eventRewardMiddleQualityMolds += RewardConfig.eventRewardMiddleQualityMolds;
    }

    // ジュエルを募集チケットに変換
    while (gems >= 300) {
      gems -= 300;
      if (props.useGemsForAdvanced) {
        advancedVouchers += 1;
      } else {
        vouchers += 1;
      }  
    }

    // 一般募集
    while (vouchers > 0) {
      const p = Math.random();
      if (p < 0.035) { // SSR(not pilgrim, 3.5%)
        nikkes[Math.floor(Math.random() * 15)] += 1;
        nikkes = sortForWishlist(nikkes);
        res.numOtherwise += 1;
      } else if (p < 0.005) { // SSR(pilgrim, 0.5%)
        nikkes[15 + Math.floor(Math.random() * (nikkes.length - 15))] += 1;
        res.numPilgrims += 1;
      } else if (p < 0.43 + 0.04) { // SR(43%)
        bodyLabelShopPoints += 200;
      } else {
        bodyLabelShopPoints += 150;  
      }
      vouchers -= 1;
      mileageShopPoints += 1;
      res.vouchers += 1;
    }

    // 特別募集
    while (advancedVouchers > 0) {
      if (advancedNikkes[Math.floor(t / 15)] >= 4) {
        // 2週間ごとに特別募集が更新される想定
        break;
      }
      const p = Math.random();
      if (p < 0.02) { // Advanced SSR
        for (let i = 0; i < advancedNikkes.length; ++i) {
          if (advancedNikkes[i] < 4) {
            advancedNikkes[i] += 1;
            break;
          }
        }
        res.numAdvanced += 1;
      } else if (p < 0.02 + 0.02) { // normal SSR
        nikkes[Math.floor(Math.random() * nikkes.length)] += 1;
        nikkes = sortForWishlist(nikkes);
        if (p < 0.02 + 0.005) {
          res.numPilgrims += 1;
        } else {
          res.numOtherwise += 1;
        }
      } else if (p < 0.43 + 0.04) {
        bodyLabelShopPoints += 200;
      } else {
        bodyLabelShopPoints += 150;
      }
      advancedVouchers -= 1;
      advancedMileageShopPoints += 1;
      res.advancedVouchers += 1;  
    }

    while (bodyLabelShopPoints >= 1200) {
      bodyLabelShopPoints -= 1200;
      highQualityMolds += 5;
    }

    while (highQualityMolds >= 50) {
      if (Math.random() < 0.6) {
        nikkes[Math.floor(Math.random() * nikkes.length)] += 1;
        nikkes = sortForWishlist(nikkes);
        res.numOtherwise += 1;
      } else { // SR(40%)
        bodyLabelShopPoints += 200;
      }
      highQualityMolds -= 50;
      res.highQualityVouchers += 1;
    }

    while (middleQualityMolds >= 50) {
      if (Math.random() < 0.2) {
        nikkes[Math.floor(Math.random() * nikkes.length)] += 1;
        nikkes = sortForWishlist(nikkes);
        res.numOtherwise += 1;
      } else { // SR(80%)
        bodyLabelShopPoints += 200;
      }
      middleQualityMolds -= 50;
      res.middleQualityVouchers += 1;
    }

    // tribe tower for each company
    for (let i = 0; i < companiesMolds.length; ++i) {
      while (companiesMolds[i] >= 50) {
        const p = Math.random();
        if (p < 0.5) { // SSR(50%)
          nikkes[Math.floor(Math.random() * nikkes.length)] += 1;
          nikkes = sortForWishlist(nikkes);
          if (i === TRIBE_TOWER_INDEX_PILGRIM) {
            res.numPilgrims += 1;
          } else {
            res.numOtherwise += 1;  
          }
        } else if (p < 0.5 + 0.3) { // SR(30%)
          bodyLabelShopPoints += 200;
        } else {
          bodyLabelShopPoints += 150;
        }
        res.companyVouchers += 1;
        companiesMolds[i] -= 50;
      }
    }

    while (friendPoints >= 10) {
      const p = Math.random();
      if (p < 0.02) {
        nikkes[Math.floor(Math.random() * nikkes.length)] += 1;
        nikkes = sortForWishlist(nikkes);
        if (p < 0.005) {
          res.numPilgrims += 1;
        } else {
          res.numOtherwise += 1;
        }
      } else if (p < 0.43 + 0.02) { // SR(43%)
        bodyLabelShopPoints += 200;
      } else { // R(55%)
        bodyLabelShopPoints += 150;
      }
      friendPoints -= 10;
      res.friendVouchers += 1;
    }

    while (mileageShopPoints >= 200) {
      mileageShopPoints -= 200;
      nikkes[0] += 1;
      nikkes = sortForWishlist(nikkes);
      res.spareBodies += 1;
    }
    while (advancedMileageShopPoints >= 200) {
      advancedMileageShopPoints -= 200;
      for (let i = 0; i < advancedNikkes.length; ++i) {
        if (advancedNikkes[i] < 4) {
          advancedNikkes[i] += 1;
          break;
        }
      }
      res.advancedSpareBodies += 1;
    }

    if (satisfied(nikkes, advancedNikkes)) {
      res.days = t + 1;
      break;
    }
  }
  return res;
}

interface Result {
  avg: Sample;
  days: {
    lessThan25: number;
    lessThan50: number;
    lessThan75: number;
  }
}
const predict = (params: Props, num:number = 1000): Result => {
  let res = {
    avg: getDefaultSample(),
    days: {
      lessThan25: 0,  // 25%以内
      lessThan50: 0,  // 50%以内
      lessThan75: 0,  // 75%以内
    }
  }
  let daysList: number[] = [];

  for (let k = 0; k < num; ++k) {
    const sample = simulate(params);
    daysList.push(sample.days);
    // 平均
    res.avg.days += sample.days / num;
    res.avg.friendVouchers += sample.friendVouchers / num;
    res.avg.spareBodies += sample.spareBodies / num;
    res.avg.advancedSpareBodies += sample.advancedSpareBodies / num;
    res.avg.vouchers += sample.vouchers / num;
    res.avg.advancedVouchers += sample.advancedVouchers / num;
    res.avg.companyVouchers += sample.companyVouchers / num;
    res.avg.highQualityVouchers += sample.highQualityVouchers / num;
    res.avg.middleQualityVouchers += sample.middleQualityVouchers / num;

    res.avg.playerLevelUpGems += sample.playerLevelUpGems / num;
    res.avg.tribeTowerRewardGems += sample.tribeTowerRewardGems / num;

    res.avg.eventRewardGems += sample.eventRewardGems / num;
    res.avg.eventRewardVouchers += sample.eventRewardVouchers / num;
    res.avg.eventRewardAdvancedVouchers += sample.eventRewardAdvancedVouchers / num;
    res.avg.eventRewardHighQualityMolds += sample.eventRewardHighQualityMolds / num;
    res.avg.eventRewardMiddleQualityMolds += sample.eventRewardMiddleQualityMolds / num;
  
    res.avg.dailyMissionGems += sample.dailyMissionGems / num;
    res.avg.dailyMissionMiddleQualityMolds += sample.dailyMissionMiddleQualityMolds / num;
    res.avg.weeklyMissionGems += sample.weeklyMissionGems / num;
    res.avg.weeklyMissionHighQualityMolds += sample.weeklyMissionHighQualityMolds / num;
    res.avg.weeklyMissionVouchers += sample.weeklyMissionVouchers / num;

    res.avg.subscriptionGems += sample.subscriptionGems / num;
    res.avg.otherwiseGems += sample.otherwiseGems / num;

    res.avg.seasonPassMiddleQualityMolds += sample.seasonPassMiddleQualityMolds / num;
    res.avg.premiumPassHighQualityMolds += sample.premiumPassHighQualityMolds / num;
    res.avg.premiumPassVouchers += sample.premiumPassVouchers / num;

    res.avg.numPilgrims += sample.numPilgrims / num;
    res.avg.numAdvanced += sample.numAdvanced / num;
    res.avg.numOtherwise += sample.numOtherwise / num;
  }
  daysList = daysList.sort((a,b) => a-b);
  res.days = {
    lessThan25: daysList[Math.floor(0.25 * daysList.length)],
    lessThan50: daysList[Math.floor(0.50 * daysList.length)],
    lessThan75: daysList[Math.floor(0.75 * daysList.length)]
  }
  return res;
}


const App = () => {
  const [numSSR0, setNumSSR0] = React.useState<string>("");
  const [numSSR1, setNumSSR1] = React.useState<string>("");
  const [numSSR2, setNumSSR2] = React.useState<string>("");
  const [numSSR3, setNumSSR3] = React.useState<string>("");
  const [vouchers, setVouchers] = React.useState<string>("");
  const [advancedVouchers, setAdvancedVouchers] = React.useState<string>("");
  const [gems, setGems] = React.useState<string>("");
  const [verbose, setVerbose] = React.useState<boolean>(false);
  
  const [bodyLabelShopPoints, setBodyLabelShopPoints] = React.useState<string>("");
  const [middleQualityMolds, setMiddleQualityMolds] = React.useState<string>("");
  const [highQualityMolds, setHighQualityMolds] = React.useState<string>("");
  const [friendPoints, setFriendPoints] = React.useState<string>("");
  const [numFriends, setNumFriends] = React.useState<string>("");
  const [mileageShopPoints, setMileageShopPoints] = React.useState<string>("");
  const [advancedMileageShopPoints, setAdvancedMileageShopPoints] = React.useState<string>("");
  
  const [useSubscription, setUseSubscription] = React.useState<boolean>(false);
  const [usePremiumPass, setUsePremiumPass] = React.useState<boolean>(false);
  const [useGemsForAdvanced, setUseGemsForAdvanced] = React.useState<boolean>(false);
  const [usePilgrimTower, setUsePilgrimTower] = React.useState<boolean>(false);

  const totalSSRUnits = 38; // 6体がピルグリム(2022.12.08にヘルム、ラプラスが恒常に追加)
  const otherwiseGemsPerDay = 450; // ジュエル補正量/日

  React.useEffect(() => {
    setNumSSR0(localStorage.getItem(LocalStorageKeys.NUM_SSR0) || "");
    setNumSSR1(localStorage.getItem(LocalStorageKeys.NUM_SSR1) || "");
    setNumSSR2(localStorage.getItem(LocalStorageKeys.NUM_SSR2) || "");
    setNumSSR3(localStorage.getItem(LocalStorageKeys.NUM_SSR3) || "");
    setVouchers(localStorage.getItem(LocalStorageKeys.VOUCHERS) || "");
    setAdvancedVouchers(localStorage.getItem(LocalStorageKeys.ADVANCED_VOUCHERS) || "");
    setGems(localStorage.getItem(LocalStorageKeys.GEMS) || "");
    setBodyLabelShopPoints(localStorage.getItem(LocalStorageKeys.BODY_LABEL_SHOP_POINTS) || "");
    setMiddleQualityMolds(localStorage.getItem(LocalStorageKeys.MIDDLE_QUALITY_MOLDS) || "");
    setHighQualityMolds(localStorage.getItem(LocalStorageKeys.HIGH_QUALITY_MOLDS) || "");
    setFriendPoints(localStorage.getItem(LocalStorageKeys.FRIEND_POINTS) || "0");
    setNumFriends(localStorage.getItem(LocalStorageKeys.NUM_FRIENDS) || "30");
    setBodyLabelShopPoints(localStorage.getItem(LocalStorageKeys.BODY_LABEL_SHOP_POINTS) || "");
    setMileageShopPoints(localStorage.getItem(LocalStorageKeys.MILEAGE_SHOP_POINTS) || "");
    setAdvancedMileageShopPoints(localStorage.getItem(LocalStorageKeys.ADVANCED_MILEAGE_SHOP_POINTS) || "");
    setUseSubscription(localStorage.getItem(LocalStorageKeys.USE_SUBSCRIPTION) === "checked");
    setUsePremiumPass(localStorage.getItem(LocalStorageKeys.USE_PREMIUM_PASS) === "checked");
    setUseGemsForAdvanced(localStorage.getItem(LocalStorageKeys.USE_GEM_FOR_ADVANCED) === "checked");
    setUsePilgrimTower(localStorage.getItem(LocalStorageKeys.USE_PILGRIM_TOWER) === "checked");
  }, []);

  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.NUM_SSR0, numSSR0);
  }, [numSSR0]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.NUM_SSR1, numSSR1);
  }, [numSSR1]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.NUM_SSR2, numSSR2);
  }, [numSSR2]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.NUM_SSR3, numSSR3);
  }, [numSSR3]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.VOUCHERS, vouchers);
  }, [vouchers]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.ADVANCED_VOUCHERS, advancedVouchers);
  }, [advancedVouchers]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.GEMS, gems);
  }, [gems]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.BODY_LABEL_SHOP_POINTS, bodyLabelShopPoints);
  }, [bodyLabelShopPoints]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.MIDDLE_QUALITY_MOLDS, middleQualityMolds);
  }, [middleQualityMolds]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.HIGH_QUALITY_MOLDS, highQualityMolds);
  }, [highQualityMolds]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.FRIEND_POINTS, friendPoints);
  }, [friendPoints]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.BODY_LABEL_SHOP_POINTS, bodyLabelShopPoints);
  }, [bodyLabelShopPoints]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.MILEAGE_SHOP_POINTS, mileageShopPoints);
  }, [mileageShopPoints]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.ADVANCED_MILEAGE_SHOP_POINTS, advancedMileageShopPoints);
  }, [advancedMileageShopPoints]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.USE_SUBSCRIPTION, useSubscription ? "checked" : "");
  }, [useSubscription]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.USE_PREMIUM_PASS, usePremiumPass ? "checked" : "");
  }, [usePremiumPass]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.USE_GEM_FOR_ADVANCED, useGemsForAdvanced ? "checked" : "");
  }, [useGemsForAdvanced]);
  React.useEffect(() => {
    localStorage.setItem(LocalStorageKeys.USE_PILGRIM_TOWER, usePilgrimTower ? "checked" : "");
  }, [usePilgrimTower]);

  const result = predict({
    duplicates: [
      totalSSRUnits-Int(numSSR0)-Int(numSSR1)-Int(numSSR2)-Int(numSSR3),
      Int(numSSR0),
      Int(numSSR1),
      Int(numSSR2),
      Int(numSSR3),
    ],
    vouchers: Int(vouchers),
    advancedVouchers: Int(advancedVouchers),
    gems: Int(gems),
    otherwiseGemsPerDay,
    bodyLabelShopPoints: Int(bodyLabelShopPoints),
    middleQualityMolds: Int(middleQualityMolds),
    highQualityMolds: Int(highQualityMolds),
    friendPoints: Int(friendPoints),
    numFriends: Int(numFriends),
    mileageShopPoints: Int(mileageShopPoints),
    advancedMileageShopPoints: Int(advancedMileageShopPoints),
    useSubscription,
    usePremiumPass,
    useGemsForAdvanced,
    usePilgrimTower
  });
  const totalRewardGems = (
    result.avg.eventRewardGems + 
    result.avg.dailyMissionGems + 
    result.avg.weeklyMissionGems + 
    result.avg.tribeTowerRewardGems +
    result.avg.subscriptionGems + 
    result.avg.otherwiseGems
  );
  return (
    <React.Fragment>
      <Typography variant='subtitle1' sx={{mb: 1}}>
        3凸SSR5体の達成日数とガチャ回数の目安
      </Typography>
      <TableContainer component={Paper} sx={{mb: 2}}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>割合(%)</TableCell>
              <TableCell>日数</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>～25%</TableCell>
              <TableCell>{result.days.lessThan25}日以内</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>～50%</TableCell>
              <TableCell>{result.days.lessThan50}日以内</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>～75%</TableCell>
              <TableCell>{result.days.lessThan75}日以内</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={2} sx={{mb:2}}>
        <Grid item xs={12} sm={2}>恒常SSR</Grid>
        <Grid item xs={6} sm={2.5}>
          <TextField label="無凸" placeholder="10" value={numSSR0} onChange={e => {
            setNumSSR0(e.target.value);
          }} variant="outlined" size="small" fullWidth InputProps={{endAdornment: <InputAdornment position="end">体</InputAdornment>}} />
        </Grid>
        <Grid item xs={6} sm={2.5}>
          <TextField label="1凸" placeholder="5" value={numSSR1} onChange={e => {
            setNumSSR1(e.target.value);
          }} variant="outlined" size="small" fullWidth InputProps={{endAdornment: <InputAdornment position="end">体</InputAdornment>}} />
        </Grid>
        <Grid item xs={6} sm={2.5}>
          <TextField label="2凸" placeholder="2" value={numSSR2} onChange={e => {
            setNumSSR2(e.target.value);
          }} variant="outlined" size="small" fullWidth InputProps={{endAdornment: <InputAdornment position="end">体</InputAdornment>}} />
        </Grid>
        <Grid item xs={6} sm={2.5}>
          <TextField label="3凸～" placeholder="0" value={numSSR3} onChange={e => {
            setNumSSR3(e.target.value);
          }} variant="outlined" size="small" fullWidth InputProps={{endAdornment: <InputAdornment position="end">体</InputAdornment>}} />
        </Grid>
      </Grid>

      <Grid container display={verbose ? "" : "none"} spacing={2} sx={{mb: 2}}>
        <Grid item xs={12} sm={2}>チケット🎫</Grid>
        <Grid item xs={6} sm={5}>
          <TextField label="一般募集" placeholder="30" value={vouchers} onChange={e => {
            setVouchers(e.target.value);
          }} variant="outlined" size="small" fullWidth InputProps={{endAdornment: <InputAdornment position="end">枚</InputAdornment>}} />
        </Grid>
        <Grid item xs={6} sm={5}>
          <TextField label="特別募集" placeholder="10" value={advancedVouchers} onChange={e => {
            setAdvancedVouchers(e.target.value);
          }} variant="outlined" size="small" fullWidth InputProps={{endAdornment: <InputAdornment position="end">枚</InputAdornment>}} />  
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{mb: 2}}>
        <Grid item xs={12} sm={2}>ジュエル💎</Grid>
          <Grid item xs={12} sm={5}>        
            <TextField label="保有ジュエル" placeholder="10000" value={gems} onChange={e => {
              setGems(e.target.value);
            }} variant="outlined" size="small" fullWidth/>
          </Grid>
          <Grid item xs={12} sm={5} />
      </Grid>

      <Grid container display={verbose ? "" : "none"} spacing={2} sx={{mb: 2}}>
        <Grid item xs={12} sm={2}>モールド🔶</Grid>
        <Grid item xs={6} sm={5}>
          <TextField label="ミドルクオリティ" placeholder="30" value={middleQualityMolds} onChange={e => {
            setMiddleQualityMolds(e.target.value);
          }} variant="outlined" size="small" fullWidth/>
        </Grid>
        <Grid item xs={6} sm={5}>
          <TextField label="ハイクオリティ" placeholder="10" value={highQualityMolds} onChange={e => {
            setHighQualityMolds(e.target.value);
          }} variant="outlined" size="small" fullWidth/>
        </Grid>
        
        <Grid item xs={12} sm={2}>フレンド💗</Grid>
        <Grid item xs={6} sm={5}>
          <TextField label="保有Pt" placeholder="100" value={friendPoints} onChange={e => {
            setFriendPoints(e.target.value);
          }} variant="outlined" size="small" fullWidth/>
        </Grid>
        <Grid item xs={6} sm={5}>
          <TextField label="獲得Pt/日" placeholder="30" value={numFriends} onChange={e => {
            setNumFriends(e.target.value);
          }} variant="outlined" size="small" fullWidth/>
        </Grid>

        <Grid item xs={12} sm={2}>ショップ</Grid>
        <Grid item xs={6} sm={3}>
          <TextField label="シルバーマイレージ" placeholder="200" value={mileageShopPoints} onChange={e => {
            setMileageShopPoints(e.target.value);
          }} variant="outlined" size="small" fullWidth/>
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField label="ゴールドマイレージ" placeholder="100" value={advancedMileageShopPoints} onChange={e => {
            setAdvancedMileageShopPoints(e.target.value);
          }} variant="outlined" size="small" fullWidth />
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField label="ボディラベル" placeholder="50000" value={bodyLabelShopPoints} onChange={e => {
            setBodyLabelShopPoints(e.target.value);
          }} variant="outlined" size="small" fullWidth/>
        </Grid>
      </Grid>

      <Grid container display={verbose ? "" : "none"} sx={{mb: 2}}>
        <Grid item xs={12} sm={6}>
          <FormControlLabel control={<Checkbox color="secondary" size="small" checked={useSubscription} onChange={e => {
            setUseSubscription(e.target.checked);
          }} />} label="30-DAY補給品" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel control={<Checkbox color="secondary" size="small" checked={usePremiumPass} onChange={e => {
            setUsePremiumPass(e.target.checked);
          }} />} label="プレミアムパス" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel control={<Checkbox color="secondary" size="small" checked={useGemsForAdvanced} onChange={e => {
            setUseGemsForAdvanced(e.target.checked);
          }} />} label="ジュエルは特別募集優先" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel control={<Checkbox color="secondary" size="small" checked={usePilgrimTower} onChange={e => {
            setUsePilgrimTower(e.target.checked);
          }} />} label="ピルグリムタワー" />
        </Grid>
      </Grid>

      <ToggleButton
        value="check"
        selected={verbose}
        onChange={() => {setVerbose(!verbose)}}
      >
        <Typography>{verbose ? "簡易" : "詳細"}</Typography>
      </ToggleButton>

      <Box display={verbose ? "": "none"}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>試行結果(1000回)</TableCell>
                <TableCell>平均</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>日数</TableCell>
                <TableCell>{result.avg.days.toPrecision(3)}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>ピルグリム排出回数</TableCell>
                <TableCell>{result.avg.numPilgrims.toPrecision(3)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>特別募集SSR排出回数</TableCell>
                <TableCell>{result.avg.numAdvanced.toPrecision(3)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>その他SSR排出回数</TableCell>
                <TableCell>{result.avg.numOtherwise.toPrecision(3)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>一般募集</TableCell>
                <TableCell>{result.avg.vouchers.toPrecision(3)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>特別募集</TableCell>
                <TableCell>{result.avg.advancedVouchers.toPrecision(3)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ハイクオリティモールドガチャ</TableCell>
                <TableCell>{result.avg.highQualityVouchers.toPrecision(3)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ミドルクオリティモールドガチャ</TableCell>
                <TableCell>{result.avg.middleQualityVouchers.toPrecision(3)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>企業モールドガチャ</TableCell>
                <TableCell>{result.avg.companyVouchers.toPrecision(3)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ソーシャルポイント募集</TableCell>
                <TableCell>{result.avg.friendVouchers.toPrecision(3)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>恒常スペアボディ交換</TableCell>
                <TableCell>{result.avg.spareBodies.toPrecision(3)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>特別スペアボディ交換</TableCell>
                <TableCell>{result.avg.advancedSpareBodies.toPrecision(3)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

      <Typography variant="h6" gutterBottom>累計獲得ジュエル💎</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>平均</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>イベント報酬</TableCell>
              <TableCell>{Math.floor(result.avg.eventRewardGems)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>デイリーミッション達成</TableCell>
              <TableCell>{Math.floor(result.avg.dailyMissionGems)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ウィークリーミッション達成</TableCell>
              <TableCell>{Math.floor(result.avg.weeklyMissionGems)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>企業別トライブタワー</TableCell>
              <TableCell>{Math.floor(result.avg.tribeTowerRewardGems)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>指揮官レベルアップ</TableCell>
              <TableCell>{Math.floor(result.avg.playerLevelUpGems)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>30-DAY補給品</TableCell>
              <TableCell>{Math.floor(result.avg.subscriptionGems)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>その他(キャンペーン、アチーブメントなど）</TableCell>
              <TableCell>{Math.floor(result.avg.otherwiseGems)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>累計獲得ジュエル</TableCell>
              <TableCell>{Math.floor(totalRewardGems)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ジュエル/日</TableCell>
              <TableCell>{Math.floor(totalRewardGems / Math.max(1, result.avg.days))}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant='h6' gutterBottom>累計獲得チケット🎫</Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>一般募集</TableCell>
                <TableCell>特別募集</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>イベント報酬</TableCell>
                <TableCell>{result.avg.eventRewardVouchers.toPrecision(3)}</TableCell>
                <TableCell>{result.avg.eventRewardAdvancedVouchers.toPrecision(3)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ウィークリーミッション</TableCell>
                <TableCell>{result.avg.weeklyMissionVouchers.toPrecision(3)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>プレミアムパス</TableCell>
                <TableCell>{result.avg.premiumPassVouchers.toPrecision(3)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant='h6' gutterBottom>累計獲得モールド🔶</Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>ミドルクオリティ</TableCell>
                <TableCell>ハイクオリティ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>イベント報酬</TableCell>
                <TableCell>{result.avg.eventRewardMiddleQualityMolds.toPrecision(3)}</TableCell>
                <TableCell>{result.avg.eventRewardHighQualityMolds.toPrecision(3)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>デイリーミッション</TableCell>
                <TableCell>{Math.floor(result.avg.dailyMissionMiddleQualityMolds)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ウィークリーミッション</TableCell>
                <TableCell></TableCell>
                <TableCell>{result.avg.weeklyMissionHighQualityMolds.toPrecision(3)}</TableCell>  
              </TableRow>
              <TableRow>
                <TableCell>シーズンパス</TableCell>
                <TableCell>{result.avg.seasonPassMiddleQualityMolds.toPrecision(3)}</TableCell>
                <TableCell>{result.avg.premiumPassHighQualityMolds.toPrecision(3)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </React.Fragment>
  );
}

export default App;
