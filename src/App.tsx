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
  mileageShopPoints: number;
  advancedMileageShopPoints: number;
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
    gems += 100 + 100 + Math.floor(Math.random() * 50); // daily mission + subscription and 派遣
    middleQualityMolds += 5; // daily mission
    if (t % 30 < 15) {
      middleQualityMolds += 2; // season pass
    }
    friendPoints += 26 + Math.floor(5 * Math.random());
    
    // weekly mission
    if (t % 7 == 0) {
      gems += 300;
      highQualityMolds += 10;
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
      if (Math.random() < 0.02) {
        nikkes[Math.floor(Math.random() * 15)] += 1;
        nikkes = sortForWishlist(nikkes);
      } else {
        bodyLabelShopPoints += 200;
      }
      advancedVouchers -= 1;
      advancedMileageShopPoints += 1;
      res.advancedVouchers += 1;  
    }

    while (bodyLabelShopPoints >= 12000) {
      bodyLabelShopPoints -= 12000;
      highQualityMolds += 50;
    }

    while (highQualityMolds >= 50) {
      if (Math.random() < 0.6) {
        nikkes[Math.floor(Math.random() * 15)] += 1;
        nikkes = sortForWishlist(nikkes);
      } else { // SR(40%)
        bodyLabelShopPoints += 200;
      }
      highQualityMolds -= 50;
      res.highQualityVouchers += 1;
    }

    while (middleQualityMolds >= 50) {
      if (Math.random() < 0.2) {
        nikkes[Math.floor(Math.random() * 15)] += 1;
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
        nikkes[Math.floor(Math.random() * 15)] += 1;
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
const predict = (params: Props): Sample => {
  let res: Sample = {
    days: 0,
    friendVouchers: 0,
    spareBodies: 0,
    advancedSpareBodies: 0,
    vouchers: 0,
    advancedVouchers: 0,
    highQualityVouchers: 0,
    middleQualityVouchers: 0
  };
  const num = 100;
  for (let k = 0; k < num; ++k) {
    const sample = simulate(params);
    res.days += sample.days / num;
    res.friendVouchers += sample.friendVouchers / num;
    res.spareBodies += sample.spareBodies / num;
    res.advancedSpareBodies += sample.advancedSpareBodies / num;
    res.vouchers += sample.vouchers / num;
    res.advancedVouchers += sample.advancedVouchers / num;
    res.highQualityVouchers += sample.highQualityVouchers / num;
    res.middleQualityVouchers += sample.middleQualityVouchers / num;
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
  const [mileageShopPoints, setMileageShopPoints] = React.useState<string>("0");
  const [advancedMileageShopPoints, setAdvancedMileageShopPoints] = React.useState<string>("0");
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
    mileageShopPoints: Int(mileageShopPoints),
    advancedMileageShopPoints: Int(advancedMileageShopPoints)
  });
  return (
    <div>
      <h1>SSR3凸5体シミュレーター</h1>
      <div>
        <div>SSR無凸<input value={numSSR0} onChange={e => setNumSSR0(e.target.value)} />体</div>
        <div>SSR1凸<input value={numSSR1} onChange={e => setNumSSR1(e.target.value)} />体</div>
        <div>SSR2凸<input value={numSSR2} onChange={e => setNumSSR2(e.target.value)} />体</div>
        <div>SSR3凸以上<input value={numSSR3} onChange={e => setNumSSR3(e.target.value)} />体</div>
        <div>一般募集チケット<input value={vouchers} onChange={e => setVouchers(e.target.value)} />枚</div>
        <div>特別募集チケット<input value={advancedVouchers} onChange={e => setAdvancedVouchers(e.target.value)} />枚</div>
        <div>ジュエル<input value={gems} onChange={e => setGems(e.target.value)} /></div>
        <div>ボディラベル<input value={bodyLabelShopPoints} onChange={e => setBodyLabelShopPoints(e.target.value)} /></div>
        <div>ミドルクオリティモールド<input value={middleQualityMolds} onChange={e => setMiddleQualityMolds(e.target.value)} /></div>
        <div>ハイクオリティモールド<input value={highQualityMolds} onChange={e => setHighQualityMolds(e.target.value)} /></div>
        <div>フレンドポイント<input value={friendPoints} onChange={e => setFriendPoints(e.target.value)} /></div>
        <div>シルバーマイレージチケット<input value={mileageShopPoints} onChange={e => setMileageShopPoints(e.target.value)} /></div>
        <div>ゴールドマイレージチケット<input value={advancedMileageShopPoints} onChange={e => setAdvancedMileageShopPoints(e.target.value)} /></div>   
      </div>
      <hr />
      <div>
        <div>平均日数: {Math.floor(result.days)}日</div>
        <div>一般募集: {Math.floor(result.vouchers)}回</div>
        <div>特別募集: {Math.floor(result.advancedVouchers)}回</div>
        <div>ハイクオリティモールドガチャ: {Math.floor(result.highQualityVouchers)}回</div>
        <div>ミドルクオリティモールドガチャ: {Math.floor(result.middleQualityVouchers)}回</div>
        <div>ソーシャルポイント募集: {Math.floor(result.friendVouchers)}回</div>
        <div>スペアボディ取得: {Math.floor(result.spareBodies)}体</div>
      </div>
    </div>
  );
}

export default App;
