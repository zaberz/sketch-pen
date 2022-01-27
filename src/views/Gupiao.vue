<!--<template>-->
<!--  <div @drop="dropFileHandler" style="height: 100vh" @dragover="preventDefault">-->
<!--&lt;!&ndash;    <div>印花税：成交金额的1‰ 。2008年9月19日由向双边征收改为向出让方单边征收</div>&ndash;&gt;-->
<!--&lt;!&ndash;    <div>证管费：成交金额的0.002%双向收取</div>&ndash;&gt;-->
<!--&lt;!&ndash;    <div>3.证券交易经手费：A股，按成交金额的0.00487%双向收取；B股，按成交额0.00487%双向收取；基金，上海证券交易所按成交额双边收取0.0045%，深圳证券交易所按成交额0.00487%双向收取；权证，按成交额0.0045%双向收取。&ndash;&gt;-->
<!--&lt;!&ndash;      A股2、3项收费合计称为交易规费，合计收取成交金额的0.00687%，包含在券商交易佣金中。&ndash;&gt;-->
<!--&lt;!&ndash;      4.过户费（从2015年8月1日起已经更改为上海和深圳都进行收取）：这是指股票成交后，更换户名所需支付的费用。根据中国登记结算公司的发文《关于调整A股交易过户费收费标准有关事项的通知 [2]  》，从2015年8月1日起已经更改为上海和深圳都进行收取，此费用按成交金额的0.02‰收取。 [3]&ndash;&gt;-->
<!--&lt;!&ndash;      5.券商交易佣金：最高不超过成交金额的3‰，最低5元起，单笔交易佣金不满5元按5元收取。&ndash;&gt;-->
<!--&lt;!&ndash;      一般情况下，券商对大资金量、交易量的客户会给予降低佣金率的优惠，因此，资金量大、交易频繁的客户可自己去和证券部申请。另外，券商还会依客户是采取电话交易、网上交易等提供不同的佣金率，一般来说，网上交易收取的佣金较低。&ndash;&gt;-->
<!--&lt;!&ndash;      另外，部分地方还收委托费。这笔费用主要用于支付通讯等方面的开支,一般按笔计算（由证券公司营业部决定收不收，证券公司多的地方，相互竞争，大多取消这项，比如大城市，证券公司少的地方，营业部可能收你成交一笔收一元或五元，比如小城镇）</div>&ndash;&gt;-->


<!--&lt;!&ndash;    <div>&ndash;&gt;-->
<!--&lt;!&ndash;      佣金如果按照1‰计的话，买卖一次股票的手续费为 1‰（买进佣金）+1‰（卖出佣金）+0.1‰（卖出印花税）&ndash;&gt;-->

<!--&lt;!&ndash;    </div>&ndash;&gt;-->
<!--    <div>123</div>-->
<!--  </div>-->
<!--</template>-->

<!--<script lang="ts" setup>-->
<!--import XLSX, {WorkBook, WorkSheet} from "xlsx";-->

<!--interface MetaData {-->
<!--  price: number-->
<!--  unit: number-->
<!--}-->
<!--const chichang: MetaData[] = []-->
<!--const history = []-->
<!--let accountBalance:number = 0 // 账户余额-->
<!--let serviceCharge: number = 0 // 总服务费-->

<!--const buyChargeRate = 0.001-->
<!--const sellChargeRate = 0.001-->
<!--const stampTaxRate = 0.0001-->

<!--const buy = (price:number, unit = 100) => {-->
<!--  const data:MetaData = {-->
<!--    price,-->
<!--    unit-->
<!--  }-->
<!--  chichang.push(data)-->
<!--  const charge = getBuyCharge(price * unit)-->
<!--  accountBalance -= price* unit + charge-->
<!--  serviceCharge += charge-->
<!--}-->
<!--const sell = (price:number,  unit = 100) => {-->
<!--  chichang.pop()-->
<!--  const charge = getSellCharge(price * unit)-->
<!--  accountBalance += price * unit  - charge-->
<!--  serviceCharge += charge-->
<!--}-->

<!--const getBuyCharge = (price:number):number => {-->
<!--  return Math.max( price* buyChargeRate, 5)-->
<!--}-->
<!--const getSellCharge = (price:number):number => {-->
<!--  return Math.max(price* sellChargeRate,5) + price * stampTaxRate-->
<!--}-->

<!--const readFile = (file:File) => {-->
<!--  return new Promise((resolve, reject)=> {-->
<!--    const reader = new FileReader()-->
<!--    reader.onload = (event: ProgressEvent<FileReader>) => {-->
<!--      const data = event.target!.result-->
<!--      resolve(data)-->
<!--    }-->
<!--    reader.readAsBinaryString(file)-->
<!--  })-->
<!--}-->

<!--const createInstance = async (file:File) => {-->
<!--  const data = await readFile(file)-->
<!--  const workbook = XLSX.read(data, {type: 'binary'})-->
<!--  return workbook-->
<!--}-->


<!--const dropFileHandler = async (event:InputEvent) => {-->
<!--  event.stopPropagation();-->
<!--  event.preventDefault();-->
<!--  const files = event.dataTransfer!.files;-->
<!--  const file = files[0]-->
<!--  const wb = await createInstance(file)-->
<!--  start(wb)-->
<!--}-->
<!--const preventDefault = (event: Event) => {-->
<!--  event.preventDefault();-->
<!--  event.stopPropagation()-->
<!--}-->

<!--const readLine = (sheet:WorkSheet, lineNo:number) => {-->
<!--  let wordIndex = ['A', 'B', 'C', 'D', 'E', 'F']-->
<!--  // [date, high, no]-->
<!--  return [-->
<!--      sheet[`A${lineNo}`],-->
<!--      sheet[`D${lineNo}`],-->
<!--      sheet[`E${lineNo}`]-->
<!--  ]-->
<!--}-->
<!--const start = (wb:WorkBook) => {-->
<!--  const sheet = wb.Sheets.Sheet1;-->
<!--  initBuy(sheet)-->
<!--  let lineNo = 3;-->
<!--  let lineData = readLine(sheet, lineNo)-->
<!--  while (lineData[0]) {-->
<!--    strategy(lineData[1].v, lineData[2].v)-->
<!--    lineNo++-->
<!--    lineData = readLine(sheet, lineNo)-->
<!--  }-->

<!--  console.log(chichang);-->
<!--  console.log(accountBalance);-->
<!--  console.log(serviceCharge);-->
<!--}-->
<!--const initBuy = (sheet:WorkSheet) => {-->
<!--  let lineData = readLine(sheet, 3)-->
<!--  let high = lineData[1]-->
<!--  buy(high, 100)-->
<!--}-->

<!--const strategy = (high:number, low:number) => {-->
<!--  let myLastChichang = chichang[chichang.length]-->
<!--  let myLastPrice = myLastChichang?.price || 999999-->

<!--  const buyCount = (myLastPrice - low) % 1-->
<!--  const sellCount = (high - myLastPrice) % 1-->

<!--  // 先卖后买-->
<!--  while (myLastPrice+1 < high) {-->
<!--    sell(myLastChichang.price + 1, myLastChichang.unit)-->
<!--    myLastChichang = chichang[chichang.length]-->
<!--    myLastPrice = myLastChichang.price-->
<!--  }-->

<!--  while (myLastPrice -1 > low) {-->
<!--    buy(myLastChichang.price -1 , 100)-->
<!--    myLastChichang = chichang[chichang.length]-->
<!--    myLastPrice = myLastChichang.price-->
<!--  }-->

<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->