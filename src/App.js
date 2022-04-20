import React, { useState } from "react";

import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";

const btnValues = [
  [""],
  ["MC","MR","M-","M+","√"],
  ["+/-",7,8,9,"/"],
  ["▲",4,5,6,"X"],
  ["C",1,2,3,"-"],
  ["AC",0,"00",".","+"],
];

const toLocaleString = (num) => String(num);

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const waitSetting = {
  waitTime: 10000,
  waitWard: "おまちください",
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const App = () => {

  // ステートの宣言
  let [calc, setCalc] = useState({
    // 選択された記号
    sign: "",
    // 入力された値
    num: 0,
    // 計算された値
    res: 0,
    //　待機中か
    isWaitting: false,
    // メモリー
    memory: 0,
  });

  //////////////////////////////////////////////////////////////////
  // 数字ボタン（0〜9）のいずれかが押されたときだけ起動
  //////////////////////////////////////////////////////////////////
  const numClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    if (removeSpaces(calc.num).length < 16) {
      setCalc({
        ...calc,
        num:
          calc.num === 0 && value === "0" ? "0" : removeSpaces(calc.num) % 1 === 0
            ? toLocaleString(Number(removeSpaces(calc.num + value)))
            : toLocaleString(calc.num + value)
            ,
        res: !calc.sign ? 0 : calc.res,
      });
    }
  };

  //////////////////////////////////////////////////////////////////
  // commaClickHandler関数は、小数点(.)が押されたときだけ実行されます。
  //////////////////////////////////////////////////////////////////
  const comaClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
    });
  };

  //////////////////////////////////////////////////////////////////
  // signClickHandler関数は、ユーザーが+、-、*、/のいずれかを押したときに実行されます。
  //////////////////////////////////////////////////////////////////
  const signClickHandler = (e) => {
    setCalc({
      ...calc,
      sign: e.target.innerHTML,
      res: !calc.res && calc.num ? calc.num : calc.res,
      num: 0,
    });
  };

  //////////////////////////////////////////////////////////////////
  // equalsClickHandler関数は、equalsボタン（=）が押されたときの結果を計算する関数です。
  //////////////////////////////////////////////////////////////////
  async function equalsClickHandler(){
    // ちょっとまってから計算結果を出す
    setCalc({
      ...calc,
      isWaitting: true
    })
    await sleep(waitSetting.waitTime);

    if (calc.sign && calc.num) {
      const math = (a, b, sign) =>
        sign === "+"
          ? a + b
          : sign === "-"
          ? a - b
          : sign === "X"
          ? a * b
          : a / b;

      setCalc({
        ...calc,
        res:
          calc.num === "0" && calc.sign === "/"
            ? "0でわれません"
            : toLocaleString(
                math(
                  Number(removeSpaces(calc.res)),
                  Number(removeSpaces(calc.num)),
                  calc.sign
                )
              ),
        sign: "",
        num: 0,
        isWaitting: false,
      });
    } else {
      setCalc({
        ...calc,
        isWaitting: false
      })
    }
  };

  //////////////////////////////////////////////////////////////////
  // invertClickHandler関数は、まず入力された値（num）または計算された値（res）があるかどうかを確認し、
  // -1を掛けて反転させる関数です。
  //////////////////////////////////////////////////////////////////
  const invertClickHandler = () => {
    setCalc({
      ...calc,
      num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
      sign: "",
    });
  };

  //////////////////////////////////////////////////////////////////
  // √のときだけ、起動
  //////////////////////////////////////////////////////////////////
  const rootClickHandler = () =>{
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

    setCalc({
      ...calc,
      num: (Math.sqrt(num)),
      res: (Math.sqrt(res)),
    });
  }
  
  //////////////////////////////////////////////////////////////////
  // ▶のときだけ、一桁目を消す
  //////////////////////////////////////////////////////////////////
  const deleteOneDigitClickHandler = () =>{
    let num = calc.num ? parseFloat(String(calc.num).slice( 0, -1)) : 0;
    setCalc({
      ...calc,
      num: num ,
    });
  }

  //////////////////////////////////////////////////////////////////
  // 00のときだけ、起動
  //////////////////////////////////////////////////////////////////
  const doubleClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

    setCalc({
      ...calc,
      num: num*100,
      res: res*100,
      sign: "",
    });
  }

  //////////////////////////////////////////////////////////////////
  // percentClickHandler関数は、入力された値（num）または計算された値（res）があるかどうかをチェックし、
  // 組み込みのMath.pow関数（底値から指数への累乗を返す）を使ってパーセンテージを計算する関数です。
  //////////////////////////////////////////////////////////////////  
  const percentClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;
    setCalc({
      ...calc,
      num: (num /= Math.pow(100, 1)),
      res: (res /= Math.pow(100, 1)),
      sign: "",
    });
  };

  //////////////////////////////////////////////////////////////////
  // allClearClickHandler関数は、calcのすべての初期値をデフォルトにし、
  // 電卓アプリが最初にレンダリングされたときのcalcの状態を返します。
  ////////////////////////////////////////////////////////////////// 
  const allClearClickHandler = () => {
    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: 0,
      isWaitting: false,
      memory: 0,
    });
  };

  //////////////////////////////////////////////////////////////////
  // Cはメモリ以外のcalcのすべての初期値をデフォルトにする
  ////////////////////////////////////////////////////////////////// 
  const clearClickHandler = () => {
    setCalc({
      ...calc,
      num: 0,
      res: 0,
    });
  };

  //////////////////////////////////////////////////////////////////
  // MR（メモリーリコール）: 直前のメモリー計算の結果「メモリー値」を呼び出すキー
  ////////////////////////////////////////////////////////////////// 
  const memoryRecallClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let memory = calc.memory ? parseFloat(removeSpaces(calc.memory)) : 0;
    setCalc({
      ...calc,
      num: memory
    });
  };

  //////////////////////////////////////////////////////////////////
  // MC（メモリークリア）: 現在の「メモリー値」をクリアするキー
  ////////////////////////////////////////////////////////////////// 
  const memoryClearClickHandler = () => {
    setCalc({
      ...calc,
      num: 0,
      memory: 0,
    });
  };

  //////////////////////////////////////////////////////////////////
  // M+（メモリープラス）: 直前の数値または計算結果を「メモリー値」に足す時に押すキー
  ////////////////////////////////////////////////////////////////// 
  const memoryPulusClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let memory = calc.memory ? parseFloat(removeSpaces(calc.memory)) : 0;
    
    setCalc({
      ...calc,
      // 入力された値
      num: 0,
      memory: memory + num,
    });
  };

  //////////////////////////////////////////////////////////////////
  // M-（メモリーマイナス）: 直前の数値または計算結果を「メモリー値」に足す時に押すキー
  ////////////////////////////////////////////////////////////////// 
  const memoryMinusClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let memory = calc.memory ? parseFloat(removeSpaces(calc.memory)) : 0;

    setCalc({
      ...calc,
      num: 0,
      memory: memory - num,
    });
  };

  return (
    <Wrapper>
      <Screen value={ calc.isWaitting ? waitSetting.waitWard : calc.num ? calc.num : calc.res} />
      <ButtonBox>
        {btnValues.reduce((acc, val) => acc.concat(val), []).map((btn, i) => {
          return (
            <Button
              key={i}
              className={btn === "" ? "equals" : ""}
              value={btn}
              onClick={
                btn === "AC"
                  ? allClearClickHandler
                  : btn === "C"
                  ? clearClickHandler
                  : btn === "+/-"
                  ? invertClickHandler
                  : btn === "√"
                  ? rootClickHandler
                  : btn === "00"
                  ? doubleClickHandler
                  : btn === "▶"
                  ? deleteOneDigitClickHandler
                  : btn === "MR"
                  ? memoryRecallClickHandler
                  : btn === "MC"
                  ? memoryClearClickHandler
                  : btn === "M+"
                  ? memoryPulusClickHandler
                  : btn === "M-"
                  ? memoryMinusClickHandler
                  : btn === "%"
                  ? percentClickHandler
                  : btn === "="
                  ? equalsClickHandler
                  : btn === "/" || btn === "X" || btn === "-" || btn === "+"
                  ? signClickHandler
                  : btn === "."
                  ? comaClickHandler
                  : numClickHandler
              }
            />
          );
        })}
      </ButtonBox>
    </Wrapper>
  );
};

export default App;
