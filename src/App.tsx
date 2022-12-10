import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { Container } from '@mui/system';
import React, { useEffect } from 'react';

const sortForWishlist = (nikkes: number[]):number[] => {
  let a = nikkes.filter(x => x < 4);
  a.sort().reverse();
  let b = nikkes.filter(x => x >= 4);
  return a.concat(b);
}

const satisfied = (cnt: number[]):boolean => {
  return cnt.filter(x => x >= 4).length >= 5;
}
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
  premiumPassVouchers: [5, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3]
}
interface Props {
  duplicates: number[]; // no body, single, duplicate, triplicate
  vouchers: number;
  advancedVouchers: number;
  gems: number;
  bodyLabelShopPoints: number;
  middleQualityMolds: number;
  highQualityMolds: number;
  friendPoints: number;
  numFriends: number;
  mileageShopPoints: number;
  advancedMileageShopPoints: number;
  useSubscription: boolean;
  usePremiumPass: boolean;
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
  seasonPassMiddleQualityMolds: number;
  premiumPassHighQualityMolds: number;
  premiumPassVouchers: number;

  
  numPilgrims: number; // ピルグリム排出回数
  numAdvanced: number; // 期間限定排出回数
  numOtherwise: number; // (ピルグリムと期間限定を除く)一般SSR排出回数
}
const getDefaultSample = (defaultValue:number=0): Sample => {
  return {
    days: defaultValue,
    friendVouchers: defaultValue,
    spareBodies: defaultValue,
    advancedSpareBodies: defaultValue,
    vouchers: defaultValue,
    advancedVouchers: defaultValue,
    highQualityVouchers: defaultValue,
    middleQualityVouchers: defaultValue,
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
  let vouchers = props.vouchers;
  let advancedVouchers = props.advancedVouchers;
  let gems = props.gems;
  let bodyLabelShopPoints = props.bodyLabelShopPoints;
  let middleQualityMolds = props.middleQualityMolds;
  let highQualityMolds = props.highQualityMolds;
  let friendPoints = props.friendPoints;
  let numFriends = props.numFriends;
  let mileageShopPoints = props.mileageShopPoints;
  let advancedMileageShopPoints = props.advancedMileageShopPoints;
  let res = getDefaultSample();
  for (let t = 0; t < 1000; ++t) {
    // daily mission
    const dailyMissionGems = RewardConfig.dailyMissionGems + Math.floor(Math.random() * 30);
    gems += dailyMissionGems; // daily mission + 派遣報酬
    res.dailyMissionGems += dailyMissionGems;
    middleQualityMolds += RewardConfig.dailyMissionMiddleQualityMolds; // daily mission
    res.dailyMissionMiddleQualityMolds += RewardConfig.dailyMissionMiddleQualityMolds;
    if (props.useSubscription) {
      gems += RewardConfig.subscriptionGems;
      res.subscriptionGems += RewardConfig.subscriptionGems;
    }

    
    if (t % 30 < RewardConfig.seasonPassMiddleQualityMolds.length) { // season pass
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

    while (gems >= 300) {
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
      gems -= 300;
      mileageShopPoints += 1;
      res.vouchers += 1;
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
      const p = Math.random();
      if (p < 0.02) { // Advanced SSR
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

    if (satisfied(nikkes)) {
      res.days = t + 1;
      break;
    }
  }
  return res;
}

const predict = (params: Props, num:number = 1000): {avg:Sample} => {
  let res = {
    avg: getDefaultSample(0)
  }

  for (let k = 0; k < num; ++k) {
    const sample = simulate(params);
    // 平均
    res.avg.days += sample.days / num;
    res.avg.friendVouchers += sample.friendVouchers / num;
    res.avg.spareBodies += sample.spareBodies / num;
    res.avg.advancedSpareBodies += sample.advancedSpareBodies / num;
    res.avg.vouchers += sample.vouchers / num;
    res.avg.advancedVouchers += sample.advancedVouchers / num;
    res.avg.highQualityVouchers += sample.highQualityVouchers / num;
    res.avg.middleQualityVouchers += sample.middleQualityVouchers / num;

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

    res.avg.seasonPassMiddleQualityMolds += sample.seasonPassMiddleQualityMolds / num;
    res.avg.premiumPassHighQualityMolds += sample.premiumPassHighQualityMolds / num;
    res.avg.premiumPassVouchers += sample.premiumPassVouchers / num;

    res.avg.numPilgrims += sample.numPilgrims / num;
    res.avg.numAdvanced += sample.numAdvanced / num;
    res.avg.numOtherwise += sample.numOtherwise / num;
  }
  return res;
}
const Int = (s:string):number => {
  const t = s.replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
  return parseInt(t) || 0
}
export enum LocalStorageKeys {
  NUM_SSR0 = "NUM_SSR0",
  NUM_SSR1 = "NUM_SSR1",
  NUM_SSR2 = "NUM_SSR2",
  NUM_SSR3 = "NUM_SSR3",
  VOUCHERS = "VOUCHERS",
  ADVANCED_VOUCHERS = "ADVANCED_VOUCHERS",
  GEMS = "GEMS",
  BODY_LABEL_SHOP_POINTS = "BODY_LABEL_SHOP_POINTS",
  MIDDLE_QUALITY_MOLDS = "MIDDLE_QUALITY_MOLDS",
  HIGH_QUALITY_MOLDS = "HIGH_QUALITY_MOLDS",
  FRIEND_POINTS = "FRIEND_POINTS",
  NUM_FRIENDS = "NUM_FRIENDS",
  MILEAGE_SHOP_POINTS = "MILEAGE_SHOP_POINTS",
  ADVANCED_MILEAGE_SHOP_POINTS = "ADVANCED_MILEAGE_SHOP_POINTS",
  USE_SUBSCRIPTION = "USE_SUBSCRIPTION",
  USE_PREMIUM_PASS = "USE_PREMIUM_PASS"
};

const App = () => {
  const [numSSR0, setNumSSR0] = React.useState<string>("");
  const [numSSR1, setNumSSR1] = React.useState<string>("");
  const [numSSR2, setNumSSR2] = React.useState<string>("");
  const [numSSR3, setNumSSR3] = React.useState<string>("");
  const [vouchers, setVouchers] = React.useState<string>("");
  const [advancedVouchers, setAdvancedVouchers] = React.useState<string>("");
  const [gems, setGems] = React.useState<string>("");
  const [bodyLabelShopPoints, setBodyLabelShopPoints] = React.useState<string>("");
  const [middleQualityMolds, setMiddleQualityMolds] = React.useState<string>("");
  const [highQualityMolds, setHighQualityMolds] = React.useState<string>("");
  const [friendPoints, setFriendPoints] = React.useState<string>("");
  const [numFriends, setNumFriends] = React.useState<string>("");
  const [mileageShopPoints, setMileageShopPoints] = React.useState<string>("");
  const [advancedMileageShopPoints, setAdvancedMileageShopPoints] = React.useState<string>("");
  
  const [useSubscription, setUseSubscription] = React.useState<boolean>(false);
  const [usePremiumPass, setUsePremiumPass] = React.useState<boolean>(false);

  const totalSSRUnits = 38; // 6体がピルグリム(2022.12.08にヘルム、ラプラスが恒常に追加)

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
    bodyLabelShopPoints: Int(bodyLabelShopPoints),
    middleQualityMolds: Int(middleQualityMolds),
    highQualityMolds: Int(highQualityMolds),
    friendPoints: Int(friendPoints),
    numFriends: Int(numFriends),
    mileageShopPoints: Int(mileageShopPoints),
    advancedMileageShopPoints: Int(advancedMileageShopPoints),
    useSubscription,
    usePremiumPass
  });
  return (
    <Container maxWidth="sm">
      <h2>メガニケ3凸シミュレーター</h2>
      <div>3凸SSR5体の達成日数とガチャ回数の目安</div>
      <Box sx={{display: "flex", flexWrap: "wrap"}}>
        <div>
          <Box component="form" sx={{"& > :not(style)": {m: 1, width: "25ch"}}}>
            恒常SSR
            <TextField label="無凸" placeholder="10" value={numSSR0} onChange={e => {
              setNumSSR0(e.target.value);
            }} variant="outlined" size="small" InputProps={{endAdornment: <InputAdornment position="end">体</InputAdornment>}} style={{width: 80}} />
            <TextField label="1凸" placeholder="5" value={numSSR1} onChange={e => {
              setNumSSR1(e.target.value);
            }} variant="outlined" size="small" InputProps={{endAdornment: <InputAdornment position="end">体</InputAdornment>}} style={{width: 80}} />
            <TextField label="2凸" placeholder="2" value={numSSR2} onChange={e => {
              setNumSSR2(e.target.value);
            }} variant="outlined" size="small" InputProps={{endAdornment: <InputAdornment position="end">体</InputAdornment>}} style={{width: 80}} />
            <TextField label="3凸～" placeholder="0" value={numSSR3} onChange={e => {
              setNumSSR3(e.target.value);
            }} variant="outlined" size="small" InputProps={{endAdornment: <InputAdornment position="end">体</InputAdornment>}} style={{width: 80}} />
          </Box>
          <Box component="form" sx={{"& > :not(style)": {m: 1, width: "25ch"}}}>
            チケット🎫
            <TextField label="一般募集" placeholder="30" value={vouchers} onChange={e => {
              setVouchers(e.target.value);
            }} variant="outlined" size="small" InputProps={{endAdornment: <InputAdornment position="end">枚</InputAdornment>}} style={{width: 120}} />
            <TextField label="特別募集" placeholder="10" value={advancedVouchers} onChange={e => {
              setAdvancedVouchers(e.target.value);
            }} variant="outlined" size="small" InputProps={{endAdornment: <InputAdornment position="end">枚</InputAdornment>}}  style={{width: 120}} />  
          </Box>
          <Box component="form" sx={{"& > :not(style)": {m: 1, width: "25ch"}}}>
            ジュエル💎
            <TextField label="ジュエル" placeholder="10000" value={gems} onChange={e => {
              setGems(e.target.value);
            }} variant="outlined" size="small" style={{width: 150}} />
          </Box>
          <Box component="form" sx={{"& > :not(style)": {m: 1, width: "25ch"}}}>
            モールド🔶
            <TextField label="ミドルクオリティ" placeholder="30" value={middleQualityMolds} onChange={e => {
              setMiddleQualityMolds(e.target.value);
            }} variant="outlined" size="small" style={{width: 150}} />
            <TextField label="ハイクオリティ" placeholder="10" value={highQualityMolds} onChange={e => {
              setHighQualityMolds(e.target.value);
            }} variant="outlined" size="small" style={{width: 150}} />
          </Box>
          <Box component="form" sx={{"& > :not(style)": {m: 1, width: "25ch"}}}>
            フレンド💗
            <TextField label="保有Pt" placeholder="100" value={friendPoints} onChange={e => {
              setFriendPoints(e.target.value);
            }} variant="outlined" size="small" style={{width: 150}}/>
            <TextField label="獲得Pt/日" placeholder="30" value={numFriends} onChange={e => {
              setNumFriends(e.target.value);
            }} variant="outlined" size="small" style={{width: 150}}/>
          </Box>
          <Box component="form" sx={{"& > :not(style)": {m: 0.5, width: "2ch"}}}>
            ショップ
            <TextField label="ボディラベル" placeholder="50000" value={bodyLabelShopPoints} onChange={e => {
              setBodyLabelShopPoints(e.target.value);
            }} variant="outlined" size="small" style={{width: 150}} />
            <TextField label="シルバーマイレージ" placeholder="200" value={mileageShopPoints} onChange={e => {
              setMileageShopPoints(e.target.value);
            }} variant="outlined" size="small" style={{width: 150}} />
            <TextField label="ゴールドマイレージ" placeholder="100" value={advancedMileageShopPoints} onChange={e => {
              setAdvancedMileageShopPoints(e.target.value);
            }} variant="outlined" size="small" style={{width: 150}} />
          </Box>
          <Box component="form" sx={{"& > :not(style)": {m: 0.5, width: "150ch"}}}>
            <FormControl sx={{m: 3}} component="fieldset" variant='standard'>
              <FormGroup row>
                <FormControlLabel control={<Checkbox size="small" checked={useSubscription} onChange={e => {
                  setUseSubscription(e.target.checked);
                }} />} label="30-DAY補給品" />
                <FormControlLabel control={<Checkbox size="small" checked={usePremiumPass} onChange={e => {
                  setUsePremiumPass(e.target.checked);
                }} />} label="プレミアムパス" />
              </FormGroup>
            </FormControl>
          </Box>
        </div>
      </Box>
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
              <TableCell>ソーシャルポイント募集</TableCell>
              <TableCell>{result.avg.friendVouchers.toPrecision(3)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>スペアボディ</TableCell>
              <TableCell>{result.avg.spareBodies.toPrecision(3)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <h3>累計獲得ジュエル💎</h3>
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
              <TableCell>30-DAY補給品</TableCell>
              <TableCell>{Math.floor(result.avg.subscriptionGems)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <h3>累計獲得チケット🎫</h3>
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
      <h3>累計獲得モールド🔶</h3>
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
    </Container>
  );
}

export default App;
