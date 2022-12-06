import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';

const sortForWishlist = (nikkes: number[]):number[] => {
  let a = nikkes.filter(x => x < 4);
  a.sort().reverse();
  let b = nikkes.filter(x => x >= 4);
  return a.concat(b);
}

const satisfied = (cnt: number[]):boolean => {
  return cnt.filter(x => x >= 4).length >= 5;
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
  let res = {
    days: 0,
    friendVouchers: 0,
    spareBodies: 0,
    advancedSpareBodies: 0,
    vouchers: 0,
    advancedVouchers: 0,
    highQualityVouchers: 0,
    middleQualityVouchers: 0
  } 
  for (let t = 1; t < 1000; ++t) {
    // daily mission
    gems += 100 + Math.floor(Math.random() * 30); // daily mission + 派遣報酬
    if (props.useSubscription) {
      gems += 100;
    }

    middleQualityMolds += 5; // daily mission
    if (t % 30 < 15) { // season pass
      middleQualityMolds += [10, 2, 2, 2, 10, 2, 2, 2, 2, 10, 2, 2, 2, 2, 10][t % 30];
      if (props.usePremiumPass) {
        highQualityMolds += [5, 3, 3, 3, 7, 3, 3, 3, 3, 7, 3, 3, 3, 3, 0][t % 30];
        vouchers += [5, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3][t % 30];
      }
    }
    friendPoints += numFriends;
    
    // weekly mission
    if (t % 7 == 0) {
      gems += 300;
      highQualityMolds += 10;
      vouchers += 1;
    }

    // event bonus
    if (t % 15 == 0) {
      gems += 300; // login bonus
      vouchers += 20; // login bonus + event mission achievements
      advancedVouchers += 10;
      highQualityMolds += 10;
      middleQualityMolds += 50;
    }

    while (gems >= 300) {
      const p = Math.random();
      if (p < 0.035) { // SSR(not pilgrim, 3.5%)
        nikkes[Math.floor(Math.random() * 15)] += 1;
        nikkes = sortForWishlist(nikkes);
      } else if (p < 0.005) { // SSR(pilgrim, 0.5%)
        nikkes[15 + Math.floor(Math.random() * (nikkes.length - 15))] += 1;
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
      } else if (p < 0.005) { // SSR(pilgrim, 0.5%)
        nikkes[15 + Math.floor(Math.random() * (nikkes.length - 15))] += 1;
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
      if (p < 0.02) {
        nikkes[Math.floor(Math.random() * nikkes.length)] += 1;
        nikkes = sortForWishlist(nikkes);
      } else if (p < 0.43 + 0.02) {
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
      res.days = t;
      break;
    }
  }
  return res;
}
const getDefaultSample = (defaultValue:number): Sample => {
  return {
    days: defaultValue,
    friendVouchers: defaultValue,
    spareBodies: defaultValue,
    advancedSpareBodies: defaultValue,
    vouchers: defaultValue,
    advancedVouchers: defaultValue,
    highQualityVouchers: defaultValue,
    middleQualityVouchers: defaultValue
  }
}
const predict = (params: Props, num:number = 1000): {min:Sample, max:Sample, avg:Sample} => {
  let res = {
    min: getDefaultSample(num),
    max: getDefaultSample(0),
    avg: getDefaultSample(0)
  }

  for (let k = 0; k < num; ++k) {
    const sample = simulate(params);
    // 最短
    res.min.days = Math.min(res.min.days, sample.days);
    res.min.friendVouchers = Math.min(res.min.friendVouchers, sample.friendVouchers);
    res.min.spareBodies = Math.min(res.min.spareBodies, sample.spareBodies);
    res.min.advancedSpareBodies = Math.min(res.min.advancedSpareBodies, sample.advancedSpareBodies);
    res.min.vouchers = Math.min(res.min.vouchers, sample.vouchers);
    res.min.advancedVouchers = Math.min(res.min.advancedVouchers, sample.advancedVouchers);
    res.min.highQualityVouchers = Math.min(res.min.highQualityVouchers, sample.highQualityVouchers);
    res.min.middleQualityVouchers = Math.min(res.min.middleQualityVouchers, sample.middleQualityVouchers);
  
    // 最長
    res.max.days = Math.max(res.max.days, sample.days);
    res.max.friendVouchers = Math.max(res.max.friendVouchers, sample.friendVouchers);
    res.max.spareBodies = Math.max(res.max.spareBodies, sample.spareBodies);
    res.max.advancedSpareBodies = Math.max(res.max.advancedSpareBodies, sample.advancedSpareBodies);
    res.max.vouchers = Math.max(res.max.vouchers, sample.vouchers);
    res.max.advancedVouchers = Math.max(res.max.advancedVouchers, sample.advancedVouchers);
    res.max.highQualityVouchers = Math.max(res.max.highQualityVouchers, sample.highQualityVouchers);
    res.max.middleQualityVouchers = Math.max(res.max.middleQualityVouchers, sample.middleQualityVouchers);

    // 平均
    res.avg.days += sample.days / num;
    res.avg.friendVouchers += sample.friendVouchers / num;
    res.avg.spareBodies += sample.spareBodies / num;
    res.avg.advancedSpareBodies += sample.advancedSpareBodies / num;
    res.avg.vouchers += sample.vouchers / num;
    res.avg.advancedVouchers += sample.advancedVouchers / num;
    res.avg.highQualityVouchers += sample.highQualityVouchers / num;
    res.avg.middleQualityVouchers += sample.middleQualityVouchers / num;
  }
  return res;
}
const Int = (v:string):number => {
  return parseInt(v) || 0
}
const App = () => {
  const [numSSR0, setNumSSR0] = React.useState<string>("0");
  const [numSSR1, setNumSSR1] = React.useState<string>("0");
  const [numSSR2, setNumSSR2] = React.useState<string>("0");
  const [numSSR3, setNumSSR3] = React.useState<string>("0");
  const [vouchers, setVouchers] = React.useState<string>("0");
  const [advancedVouchers, setAdvancedVouchers] = React.useState<string>("0");
  const [gems, setGems] = React.useState<string>("0");
  const [bodyLabelShopPoints, setBodyLabelShopPoints] = React.useState<string>("0");
  const [middleQualityMolds, setMiddleQualityMolds] = React.useState<string>("0");
  const [highQualityMolds, setHighQualityMolds] = React.useState<string>("0");
  const [friendPoints, setFriendPoints] = React.useState<string>("0");
  const [numFriends, setNumFriends] = React.useState<string>("30");
  const [mileageShopPoints, setMileageShopPoints] = React.useState<string>("0");
  const [advancedMileageShopPoints, setAdvancedMileageShopPoints] = React.useState<string>("0");
  
  const [useSubscription, setUseSubscription] = React.useState<boolean>(true);
  const [usePremiumPass, setUsePremiumPass] = React.useState<boolean>(true);

  const totalSSRUnits = 36; // 6体がピルグリム

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
      <div>3凸SSR5体の達成日数とガチャ回数の目安(1000回の試行)</div>
      <Box sx={{display: "flex", flexWrap: "wrap"}}>
        <div>
          <Box component="form" sx={{"& > :not(style)": {m: 1, width: "25ch"}}}>
            SSR
            <TextField label="無凸" value={numSSR0} onChange={e => setNumSSR0(e.target.value)} variant="outlined" size="small" style={{width: 70}} />
            <TextField label="1凸" value={numSSR1} onChange={e => setNumSSR1(e.target.value)} variant="outlined" size="small" style={{width: 70}} />
            <TextField label="2凸" value={numSSR2} onChange={e => setNumSSR2(e.target.value)} variant="outlined" size="small" style={{width: 70}} />
            <TextField label="3凸以上" value={numSSR3} onChange={e => setNumSSR3(e.target.value)} variant="outlined" size="small" style={{width: 70}} />
          </Box>
          <Box component="form" sx={{"& > :not(style)": {m: 1, width: "25ch"}}}>
            チケット
            <TextField label="一般募集" value={vouchers} onChange={e => setVouchers(e.target.value)} variant="outlined" size="small" style={{width: 120}} />
            <TextField label="特別募集" value={advancedVouchers} onChange={e => setAdvancedVouchers(e.target.value)} variant="outlined" size="small" style={{width: 120}} />  
          </Box>
          <Box component="form" sx={{"& > :not(style)": {m: 1, width: "25ch"}}}>
            ジュエル
            <TextField label="ジュエル" value={gems} onChange={e => setGems(e.target.value)} variant="outlined" size="small" style={{width: 120}} />
          </Box>
          <Box component="form" sx={{"& > :not(style)": {m: 1, width: "25ch"}}}>
            モールド
            <TextField label="ミドルクオリティ" value={middleQualityMolds} onChange={e => setMiddleQualityMolds(e.target.value)} variant="outlined" size="small" style={{width: 150}} />
            <TextField label="ハイクオリティ" value={highQualityMolds} onChange={e => setHighQualityMolds(e.target.value)} variant="outlined" size="small" style={{width: 150}} />
          </Box>
          <Box component="form" sx={{"& > :not(style)": {m: 1, width: "25ch"}}}>
            フレンド
            <TextField label="ポイント" value={friendPoints} onChange={e => setFriendPoints(e.target.value)} variant="outlined" size="small" style={{width: 150}} />
            <TextField label="人数" value={numFriends} onChange={e => setNumFriends(e.target.value)} variant="outlined" size="small" style={{width: 150}} />
          </Box>
          <Box component="form" sx={{"& > :not(style)": {m: 0.5, width: "2ch"}}}>
            ショップ
            <TextField label="ボディラベル" value={bodyLabelShopPoints} onChange={e => setBodyLabelShopPoints(e.target.value)} variant="outlined" size="small" style={{width: 150}} />
            <TextField label="シルバーマイレージ" value={mileageShopPoints} onChange={e => setMileageShopPoints(e.target.value)} variant="outlined" size="small" style={{width: 150}} />
            <TextField label="ゴールドマイレージ" value={advancedMileageShopPoints} onChange={e => setAdvancedMileageShopPoints(e.target.value)} variant="outlined" size="small" style={{width: 150}} />
          </Box>
          <Box component="form" sx={{"& > :not(style)": {m: 0.5, width: "150ch"}}}>
            <FormControl sx={{m: 3}} component="fieldset" variant='standard'>
              <FormGroup row>
                <FormControlLabel control={<Checkbox size="small" checked={useSubscription} onChange={e => setUseSubscription(e.target.checked)} />} label="30-DAY補給品" />
                <FormControlLabel control={<Checkbox size="small" checked={usePremiumPass} onChange={e => setUsePremiumPass(e.target.checked)} />} label="プレミアムパス" />
              </FormGroup>
            </FormControl>
          </Box>
        </div>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>平均</TableCell>
              <TableCell>最短</TableCell>
              <TableCell>最長</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>日数</TableCell>
              <TableCell>{result.avg.days.toPrecision(3)}</TableCell>
              <TableCell>{result.min.days}</TableCell>
              <TableCell>{result.max.days}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>一般募集</TableCell>
              <TableCell>{result.avg.vouchers.toPrecision(3)}</TableCell>
              <TableCell>{result.min.vouchers}</TableCell>
              <TableCell>{result.max.vouchers}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>特別募集</TableCell>
              <TableCell>{result.avg.advancedVouchers.toPrecision(3)}</TableCell>
              <TableCell>{result.min.advancedVouchers}</TableCell>
              <TableCell>{result.max.advancedVouchers}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ハイクオリティモールドガチャ</TableCell>
              <TableCell>{result.avg.highQualityVouchers.toPrecision(3)}</TableCell>
              <TableCell>{result.min.highQualityVouchers}</TableCell>
              <TableCell>{result.max.highQualityVouchers}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ミドルクオリティモールドガチャ</TableCell>
              <TableCell>{result.avg.middleQualityVouchers.toPrecision(3)}</TableCell>
              <TableCell>{result.min.middleQualityVouchers}</TableCell>
              <TableCell>{result.max.middleQualityVouchers}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ソーシャルポイント募集</TableCell>
              <TableCell>{result.avg.friendVouchers.toPrecision(3)}</TableCell>
              <TableCell>{result.min.friendVouchers}</TableCell>
              <TableCell>{result.max.friendVouchers}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>スペアボディ</TableCell>
              <TableCell>{result.avg.spareBodies.toPrecision(3)}</TableCell>
              <TableCell>{result.min.spareBodies}</TableCell>
              <TableCell>{result.max.spareBodies}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
