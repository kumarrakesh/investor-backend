var html_to_pdf = require('html-pdf-node')

let options = { format: 'A4' }

const displayTransaction = (t) => {
  var html = ''
  var total = 0
  for (var i = t.length - 1; i >= 0; i--) {
    var row = t[i]
    total += row.amount
    var data = `
    <TR><TD colspan=2 class="tr0 td101"><P class="p23 ft3"><NOBR>${new Date(
      row.date
    ).toDateString()}</NOBR></P></TD>
       <TD class="tr0 td36"><P class="p4 ft2">&nbsp;</P></TD>
       <TD colspan=2 class="tr0 td102"><P class="p30 ft3"> ${
         row.type == '1' ? 'Invested' : row.type == '3' ? 'Withdraw' : 'yeilded'
       } </P></TD>
       <TD class="tr0 td103"><P class="p4 ft2">&nbsp;</P></TD>
       <TD class="tr0 td42"><P class="p31 ft3">${
         row.type == '2' ? row.amount : ''
       }</P></TD>
       <TD class="tr0 td105"><P class="p4 ft2">&nbsp;</P></TD>
       <TD class="tr0 td42"><P class="p31 ft3">${
         row.type == '1' ? row.amount : ''
       }</P></TD>
       <TD class="tr0 td86"><P class="p4 ft2">&nbsp;</P></TD>
       <TD colspan=4 class="tr0 td106"><P class="p16 ft3">${
         row.type == '3' ? row.amount : ''
       }</P></TD>
       <TD class="tr0 td48"><P class="p32 ft3">${total}</P></TD>
     </TR>`

    html += data
  }
  return html
}

const showTotal = (t) => {
  var total = 0
  for (var i = t.length - 1; i >= 0; i--) {
    total += t[i].amount
  }
  return total
}

exports.transactionReport = async (user, transaction, userFolio) => {
  const template = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
  <HTML>
  <HEAD>
  <META http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <TITLE>Folio Statement</TITLE>
  <META name="generator" content="BCL easyConverter SDK 5.0.252">
  <META name="author" content="Kapil Ahuja">
  <STYLE type="text/css">
  
  body {margin-top: 0px;margin-left: 0px;}
  
  html { -webkit-print-color-adjust: exact; }
  
  #page_1 {position:relative;overflow:hidden;margin-left:20px;margin-top:20px;padding: 0px;border: none;width:auto;}
  
  #page_1 #p1dimg1 {position:absolute;top:0px;left:553px;z-index:-1;width:141px;height:93px;}
  #page_1 #p1dimg1 #p1img1 {width:141px;height:93px;}
  
  .dclr {clear:both;float:none;height:1px;margin:0px;padding:0px;overflow:hidden;}
  
  .ft0{font: bold 15px 'Times New Roman';line-height: 17px;}
  .ft1{font: bold 13px 'Times New Roman';line-height: 15px;}
  .ft2{font: 1px 'Times New Roman';line-height: 1px;}
  .ft3{font: 13px 'Times New Roman';line-height: 15px;}
  .ft4{font: 15px 'Times New Roman';line-height: 16px;}
  .ft5{font: 1px 'Times New Roman';line-height: 12px;}
  .ft6{font: 1px 'Times New Roman';line-height: 9px;}
  .ft7{font: 1px 'Times New Roman';line-height: 6px;}
  .ft8{font: bold 12px 'Times New Roman';line-height: 15px;}
  .ft9{font: 1px 'Times New Roman';line-height: 13px;}
  .ft10{font: 1px 'Times New Roman';line-height: 8px;}
  .ft11{font: bold 13px 'Times New Roman';color: #4472c4;line-height: 15px;}
  .ft12{font: 9px 'Times New Roman';line-height: 12px;position: relative; bottom: 5px;}
  
  .p0{text-align: left;padding-left: 199px;margin-top: 88px;margin-bottom: 0px;}
  .p1{text-align: left;padding-left: 89px;margin-top: 12px;margin-bottom: 0px;}
  .p2{text-align: left;padding-left: 459px;margin-top: 11px;margin-bottom: 0px;}
  .p3{text-align: left;padding-left: 8px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p4{text-align: left;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p5{text-align: left;padding-left: 2px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p6{text-align: left;padding-left: 6px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p7{text-align: left;padding-left: 3px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p8{text-align: left;padding-left: 1px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p9{text-align: left;padding-left: 4px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p10{text-align: center;padding-right: 52px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p11{text-align: center;padding-left: 3px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p12{text-align: center;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p13{text-align: center;padding-right: 8px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p14{text-align: center;padding-left: 4px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p15{text-align: center;padding-left: 10px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p16{text-align: center;padding-right: 1px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p17{text-align: center;padding-left: 27px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p18{text-align: center;padding-left: 26px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p19{text-align: right;padding-right: 16px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p20{text-align: right;padding-right: 39px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p21{text-align: right;padding-right: 49px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p22{text-align: left;padding-left: 69px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p23{text-align: center;padding-left: 2px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p24{text-align: center;padding-right: 10px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p25{text-align: center;padding-left: 7px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p26{text-align: center;padding-right: 2px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p27{text-align: center;padding-right: 19px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p28{text-align: center;padding-right: 11px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p29{text-align: center;padding-right: 18px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p30{text-align: center;padding-right: 7px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p31{text-align: right;padding-right: 14px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p32{text-align: right;padding-right: 29px;margin-top: 0px;margin-bottom: 0px;white-space: nowrap;}
  .p33{text-align: left;padding-left: 58px;margin-top: 30px;margin-bottom: 0px;}
  .p34{text-align: left;margin-top:10px;margin-bottom: 0px;}
  .p35{text-align: left;margin-top: 0px;margin-bottom: 0px;}
  
  .td0{border-left: #000000 1px solid;border-right: #d0cece 1px solid;border-top: #000000 1px solid;border-bottom: #d0cece 1px solid;padding: 0px;margin: 0px;width: 214px;vertical-align: bottom;background: #d0cece;}
  .td1{border-right: #d0cece 1px solid;border-top: #000000 1px solid;border-bottom: #d0cece 1px solid;padding: 0px;margin: 0px;width: 6px;vertical-align: bottom;background: #d0cece;}
  .td2{border-right: #000000 1px solid;border-top: #000000 1px solid;border-bottom: #d0cece 1px solid;padding: 0px;margin: 0px;width: 83px;vertical-align: bottom;background: #d0cece;}
  .td3{border-right: #d0cece 1px solid;border-top: #000000 1px solid;border-bottom: #d0cece 1px solid;padding: 0px;margin: 0px;width: 3px;vertical-align: bottom;background: #d0cece;}
  .td4{border-right: #000000 1px solid;border-top: #000000 1px solid;border-bottom: #d0cece 1px solid;padding: 0px;margin: 0px;width: 202px;vertical-align: bottom;background: #d0cece;}
  .td5{border-right: #000000 1px solid;border-top: #000000 1px solid;border-bottom: #d0cece 1px solid;padding: 0px;margin: 0px;width: 76px;vertical-align: bottom;background: #d0cece;}
  .td6{border-right: #000000 1px solid;border-top: #000000 1px solid;border-bottom: #d0cece 1px solid;padding: 0px;margin: 0px;width: 93px;vertical-align: bottom;background: #d0cece;}
  .td7{border-left: #000000 1px solid;border-top: #000000 1px solid;padding: 0px;margin: 0px;width: 105px;vertical-align: bottom;}
  .td8{border-top: #000000 1px solid;padding: 0px;margin: 0px;width: 3px;vertical-align: bottom;}
  .td9{border-top: #000000 1px solid;padding: 0px;margin: 0px;width: 107px;vertical-align: bottom;}
  .td10{border-top: #000000 1px solid;padding: 0px;margin: 0px;width: 7px;vertical-align: bottom;}
  .td11{border-right: #000000 1px solid;border-top: #000000 1px solid;padding: 0px;margin: 0px;width: 83px;vertical-align: bottom;}
  .td12{border-top: #000000 1px solid;padding: 0px;margin: 0px;width: 4px;vertical-align: bottom;}
  .td13{border-top: #000000 1px solid;padding: 0px;margin: 0px;width: 203px;vertical-align: bottom;}
  .td14{border-top: #000000 1px solid;padding: 0px;margin: 0px;width: 17px;vertical-align: bottom;}
  .td15{border-top: #000000 1px solid;padding: 0px;margin: 0px;width: 12px;vertical-align: bottom;}
  .td16{border-top: #000000 1px solid;padding: 0px;margin: 0px;width: 48px;vertical-align: bottom;}
  .td17{border-right: #000000 1px solid;border-top: #000000 1px solid;padding: 0px;margin: 0px;width: 93px;vertical-align: bottom;}
  .td18{border-left: #000000 1px solid;padding: 0px;margin: 0px;width: 45px;vertical-align: bottom;}
  .td19{padding: 0px;margin: 0px;width: 47px;vertical-align: bottom;}
  .td20{padding: 0px;margin: 0px;width: 13px;vertical-align: bottom;}
  .td21{padding: 0px;margin: 0px;width: 3px;vertical-align: bottom;}
  .td22{padding: 0px;margin: 0px;width: 107px;vertical-align: bottom;}
  .td23{padding: 0px;margin: 0px;width: 7px;vertical-align: bottom;}
  .td24{border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 83px;vertical-align: bottom;}
  .td25{padding: 0px;margin: 0px;width: 4px;vertical-align: bottom;}
  .td26{padding: 0px;margin: 0px;width: 203px;vertical-align: bottom;}
  .td27{padding: 0px;margin: 0px;width: 17px;vertical-align: bottom;}
  .td28{padding: 0px;margin: 0px;width: 12px;vertical-align: bottom;}
  .td29{padding: 0px;margin: 0px;width: 48px;vertical-align: bottom;}
  .td30{border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 93px;vertical-align: bottom;}
  .td31{border-left: #000000 1px solid;padding: 0px;margin: 0px;width: 105px;vertical-align: bottom;}
  .td32{padding: 0px;margin: 0px;width: 96px;vertical-align: bottom;}
  .td33{padding: 0px;margin: 0px;width: 10px;vertical-align: bottom;}
  .td34{padding: 0px;margin: 0px;width: 97px;vertical-align: bottom;}
  .td35{border-left: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 92px;vertical-align: bottom;}
  .td36{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 13px;vertical-align: bottom;}
  .td37{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 3px;vertical-align: bottom;}
  .td38{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 107px;vertical-align: bottom;}
  .td39{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 7px;vertical-align: bottom;}
  .td40{border-right: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 83px;vertical-align: bottom;}
  .td41{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 4px;vertical-align: bottom;}
  .td42{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 96px;vertical-align: bottom;}
  .td43{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 10px;vertical-align: bottom;}
  .td44{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 97px;vertical-align: bottom;}
  .td45{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 17px;vertical-align: bottom;}
  .td46{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 12px;vertical-align: bottom;}
  .td47{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 48px;vertical-align: bottom;}
  .td48{border-right: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 93px;vertical-align: bottom;}
  .td49{border-left: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 45px;vertical-align: bottom;}
  .td50{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 47px;vertical-align: bottom;}
  .td51{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 106px;vertical-align: bottom;}
  .td52{border-left: #000000 1px solid;padding: 0px;margin: 0px;width: 45px;vertical-align: bottom;background: #d0cece;}
  .td53{border-right: #d0cece 1px solid;padding: 0px;margin: 0px;width: 46px;vertical-align: bottom;background: #d0cece;}
  .td54{padding: 0px;margin: 0px;width: 13px;vertical-align: bottom;background: #d0cece;}
  .td55{border-right: #d0cece 1px solid;padding: 0px;margin: 0px;width: 2px;vertical-align: bottom;background: #d0cece;}
  .td56{border-right: #d0cece 1px solid;padding: 0px;margin: 0px;width: 106px;vertical-align: bottom;background: #d0cece;}
  .td57{border-right: #d0cece 1px solid;padding: 0px;margin: 0px;width: 6px;vertical-align: bottom;background: #d0cece;}
  .td58{border-right: #d0cece 1px solid;padding: 0px;margin: 0px;width: 290px;vertical-align: bottom;background: #d0cece;}
  .td59{padding: 0px;margin: 0px;width: 17px;vertical-align: bottom;background: #d0cece;}
  .td60{border-right: #d0cece 1px solid;padding: 0px;margin: 0px;width: 11px;vertical-align: bottom;background: #d0cece;}
  .td61{border-right: #d0cece 1px solid;padding: 0px;margin: 0px;width: 47px;vertical-align: bottom;background: #d0cece;}
  .td62{border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 93px;vertical-align: bottom;background: #d0cece;}
  .td63{border-left: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 45px;vertical-align: bottom;background: #d0cece;}
  .td64{border-right: #d0cece 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 46px;vertical-align: bottom;background: #d0cece;}
  .td65{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 13px;vertical-align: bottom;background: #d0cece;}
  .td66{border-right: #d0cece 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 2px;vertical-align: bottom;background: #d0cece;}
  .td67{border-right: #d0cece 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 106px;vertical-align: bottom;background: #d0cece;}
  .td68{border-right: #d0cece 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 6px;vertical-align: bottom;background: #d0cece;}
  .td69{border-right: #d0cece 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 83px;vertical-align: bottom;background: #d0cece;}
  .td70{border-right: #d0cece 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 3px;vertical-align: bottom;background: #d0cece;}
  .td71{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 96px;vertical-align: bottom;background: #d0cece;}
  .td72{border-right: #d0cece 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 9px;vertical-align: bottom;background: #d0cece;}
  .td73{border-right: #d0cece 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 96px;vertical-align: bottom;background: #d0cece;}
  .td74{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 17px;vertical-align: bottom;background: #d0cece;}
  .td75{border-right: #d0cece 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 11px;vertical-align: bottom;background: #d0cece;}
  .td76{border-right: #d0cece 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 47px;vertical-align: bottom;background: #d0cece;}
  .td77{border-right: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 93px;vertical-align: bottom;background: #d0cece;}
  .td78{border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 2px;vertical-align: bottom;}
  .td79{border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 106px;vertical-align: bottom;}
  .td80{border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 9px;vertical-align: bottom;}
  .td81{padding: 0px;margin: 0px;width: 114px;vertical-align: bottom;}
  .td82{border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 11px;vertical-align: bottom;}
  .td83{border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 141px;vertical-align: bottom;}
  .td84{border-right: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 2px;vertical-align: bottom;}
  .td85{border-right: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 106px;vertical-align: bottom;}
  .td86{border-right: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 9px;vertical-align: bottom;}
  .td87{border-right: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 11px;vertical-align: bottom;}
  .td88{border-left: #000000 1px solid;padding: 0px;margin: 0px;width: 92px;vertical-align: bottom;}
  .td89{border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 90px;vertical-align: bottom;}
  .td90{padding: 0px;margin: 0px;width: 100px;vertical-align: bottom;}
  .td91{border-right: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 105px;vertical-align: bottom;}
  .td92{border-right: #d0cece 1px solid;padding: 0px;margin: 0px;width: 404px;vertical-align: bottom;background: #d0cece;}
  .td93{border-left: #000000 1px solid;border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 91px;vertical-align: bottom;}
  .td94{border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 6px;vertical-align: bottom;}
  .td95{padding: 0px;margin: 0px;width: 84px;vertical-align: bottom;}
  .td96{border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 3px;vertical-align: bottom;}
  .td97{border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 96px;vertical-align: bottom;}
  .td98{border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 59px;vertical-align: bottom;}
  .td99{border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 46px;vertical-align: bottom;}
  .td100{border-right: #000000 1px solid;padding: 0px;margin: 0px;width: 47px;vertical-align: bottom;}
  .td101{border-left: #000000 1px solid;border-right: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 91px;vertical-align: bottom;}
  .td102{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 110px;vertical-align: bottom;}
  .td103{border-right: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 6px;vertical-align: bottom;}
  .td104{border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 84px;vertical-align: bottom;}
  .td105{border-right: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 3px;vertical-align: bottom;}
  .td106{border-right: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 96px;vertical-align: bottom;}
  .td107{border-right: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 59px;vertical-align: bottom;}
  .td108{border-left: #000000 1px solid;border-bottom: #000000 1px solid;padding: 0px;margin: 0px;width: 215px;vertical-align: bottom;}
  
  .tr0{height: 23px;}
  .tr1{height: 30px;}
  .tr2{height: 16px;}
  .tr3{height: 15px;}
  .tr4{height: 12px;}
  .tr5{height: 9px;}
  .tr6{height: 6px;}
  .tr7{height: 13px;}
  .tr8{height: 22px;}
  .tr9{height: 24px;}
  .tr10{height: 8px;}
  
  .t0{width: 684px;margin-top: 13px;font: bold 13px 'Times New Roman';}
  
  </STYLE>
  </HEAD>
  
  <BODY>
  <DIV id="page_1">
  <DIV id="p1dimg1">
  <IMG src="https://tiwpe.com/image/tiw-logo.png" id="p1img1"></DIV>
  
  <DIV class="dclr"></DIV>
  <P class="p0 ft0">Client Investment Folio Statement</P>
  <P class="p1 ft0">FOCUS INDE GLOBAL FIXED INCOME SERIES 2021 LTD</P>
  <P class="p2 ft1">Statement Date: <NOBR>${new Date().toDateString()}</NOBR></P>
  <TABLE cellpadding=0 cellspacing=0 class="t0">
  <TR>
    <TD colspan=5 class="tr0 td0"><P class="p3 ft1">Personal Information</P></TD>
    <TD class="tr0 td1"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr0 td2"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr0 td3"><P class="p4 ft2">&nbsp;</P></TD>
    <TD colspan=3 class="tr0 td4"><P class="p5 ft1">Folio No.: ${
      userFolio.folioId
    }</P></TD>
    <TD colspan=3 class="tr0 td5"><P class="p6 ft1">Class: NA</P></TD>
    <TD class="tr0 td6"><P class="p6 ft1">Yield:${userFolio.yield}%</P></TD>
  </TR>
  <TR>
    <TD colspan=3 class="tr1 td7"><P class="p3 ft1">${user.name}</P></TD>
    <TD class="tr1 td8"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td9"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td10"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td11"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td12"><P class="p4 ft2">&nbsp;</P></TD>
    <TD colspan=3 class="tr1 td13"><P class="p5 ft1">Bank Account Details:</P></TD>
    <TD class="tr1 td14"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td15"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td16"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td17"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD class="tr2 td18"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td19"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td20"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td21"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td22"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td23"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td24"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td25"><P class="p4 ft2">&nbsp;</P></TD>
    <TD colspan=3 class="tr2 td26"><P class="p5 ft3">Beneficiary Name: ${
      user.name
    }</P></TD>
    <TD class="tr2 td27"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td28"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td29"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td30"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD colspan=3 class="tr3 td31"><P class="p3 ft3">Address Line 1: ${
      user.address || ''
    }</P></TD>
    <TD class="tr3 td21"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td22"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td23"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td24"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td25"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td32"><P class="p5 ft3">Bank Name</P></TD>
    <TD class="tr3 td33"><P class="p7 ft3">: ${userFolio.folioName}</P></TD>
    <TD class="tr3 td34"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td27"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td28"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td29"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td30"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD colspan=3 class="tr3 td31"><P class="p3 ft3">Address Line 2 : ${
      user.city + ',' + user.pincode
    }</P></TD>
    <TD class="tr3 td21"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td22"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td23"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td24"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td25"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td32"><P class="p5 ft3">Branch</P></TD>
    <TD class="tr3 td33"><P class="p8 ft3">: NA</P></TD>
    <TD class="tr3 td34"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td27"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td28"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td29"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td30"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD class="tr2 td18"><P class="p3 ft3">Email</P></TD>
    <TD class="tr2 td19"><P class="p7 ft3">: ${user.email || ''}</P></TD>
    <TD class="tr2 td20"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td21"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td22"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td23"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td24"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td25"><P class="p4 ft2">&nbsp;</P></TD>
    <TD colspan=3 class="tr2 td26"><P class="p5 ft3">Account Number : ${
      userFolio.folioId
    }</P></TD>
    <TD class="tr2 td27"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td28"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td29"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td30"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD class="tr2 td18"><P class="p3 ft3">Ph Off</P></TD>
    <TD class="tr2 td19"><P class="p9 ft3">:- ${user.phoneNo || ''}</P></TD>
    <TD class="tr2 td20"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td21"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td22"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td23"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td24"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td25"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td32"><P class="p5 ft3">Swift Code</P></TD>
    <TD colspan=2 class="tr2 td22"><P class="p7 ft3">: - NA</P></TD>
    <TD class="tr2 td27"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td28"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td29"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td30"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD colspan=3 class="tr2 td31"><P class="p3 ft3">Mobile : ${
      user.mobileNo || ''
    }</P></TD>
    <TD class="tr2 td21"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td22"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td23"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td24"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td25"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td32"><P class="p5 ft3">IBAN</P></TD>
    <TD colspan=2 class="tr2 td22"><P class="p5 ft3">: - NA</P></TD>
    <TD class="tr2 td27"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td28"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td29"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td30"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD colspan=2 class="tr2 td35"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td36"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td37"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td38"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td39"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td40"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td41"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td42"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td43"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td44"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td45"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td46"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td47"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td48"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD colspan=3 class="tr1 td31"><P class="p3 ft1">Joint Holders</P></TD>
    <TD class="tr1 td21"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td22"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td23"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td24"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td25"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td32"><P class="p5 ft1">Nominee Details</P></TD>
    <TD class="tr1 td33"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td34"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td27"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td28"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td29"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td30"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD colspan=2 class="tr4 td35"><P class="p4 ft5">&nbsp;</P></TD>
    <TD class="tr4 td36"><P class="p4 ft5">&nbsp;</P></TD>
    <TD class="tr4 td37"><P class="p4 ft5">&nbsp;</P></TD>
    <TD class="tr4 td38"><P class="p4 ft5">&nbsp;</P></TD>
    <TD class="tr4 td39"><P class="p4 ft5">&nbsp;</P></TD>
    <TD class="tr4 td40"><P class="p4 ft5">&nbsp;</P></TD>
    <TD class="tr4 td41"><P class="p4 ft5">&nbsp;</P></TD>
    <TD class="tr4 td42"><P class="p4 ft5">&nbsp;</P></TD>
    <TD class="tr4 td43"><P class="p4 ft5">&nbsp;</P></TD>
    <TD class="tr4 td44"><P class="p4 ft5">&nbsp;</P></TD>
    <TD class="tr4 td45"><P class="p4 ft5">&nbsp;</P></TD>
    <TD class="tr4 td46"><P class="p4 ft5">&nbsp;</P></TD>
    <TD class="tr4 td47"><P class="p4 ft5">&nbsp;</P></TD>
    <TD class="tr4 td48"><P class="p4 ft5">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD colspan=3 class="tr1 td31"><P class="p3 ft3">Joint Holder 1: -</P></TD>
    <TD class="tr1 td21"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td22"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td23"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td24"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td25"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td32"><P class="p5 ft3">Nominee 1: -</P></TD>
    <TD class="tr1 td33"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td34"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td27"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td28"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td29"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td30"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD colspan=3 class="tr2 td31"><P class="p3 ft3">Joint Holder 2: -</P></TD>
    <TD class="tr2 td21"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td22"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td23"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td24"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td25"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td32"><P class="p5 ft3">Nominee 2: -</P></TD>
    <TD class="tr2 td33"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td34"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td27"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td28"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td29"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td30"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD colspan=3 class="tr3 td31"><P class="p3 ft3">Joint Holder 3: -</P></TD>
    <TD class="tr3 td21"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td22"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td23"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td24"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td25"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td32"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td33"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td34"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td27"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td28"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td29"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td30"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD class="tr5 td49"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td50"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td36"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td37"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td38"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td39"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td40"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td41"><P class="p4 ft6">&nbsp;</P></TD>
    <TD colspan=2 class="tr5 td51"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td44"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td45"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td46"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td47"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td48"><P class="p4 ft6">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD class="tr3 td52"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td53"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td54"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td55"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td56"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td57"><P class="p4 ft2">&nbsp;</P></TD>
    <TD colspan=5 class="tr3 td58"><P class="p10 ft1">Summary of your Investment</P></TD>
    <TD class="tr3 td59"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td60"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td61"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td62"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD class="tr5 td63"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td64"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td65"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td66"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td67"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td68"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td69"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td70"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td71"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td72"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td73"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td74"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td75"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td76"><P class="p4 ft6">&nbsp;</P></TD>
    <TD class="tr5 td77"><P class="p4 ft6">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD colspan=3 class="tr3 td31"><P class="p11 ft1">Capital</P></TD>
    <TD class="tr3 td78"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td79"><P class="p12 ft1">Capital Called</P></TD>
    <TD class="tr3 td23"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td24"><P class="p13 ft1">Capital Paid</P></TD>
    <TD class="tr3 td25"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td32"><P class="p14 ft1">Adjustment</P></TD>
    <TD class="tr3 td80"><P class="p4 ft2">&nbsp;</P></TD>
    <TD colspan=2 class="tr3 td81"><P class="p15 ft1">Capital Paid after</P></TD>
    <TD class="tr3 td82"><P class="p4 ft2">&nbsp;</P></TD>
    <TD colspan=2 class="tr3 td83"><P class="p16 ft1">Uncalled Capital</P></TD>
  </TR>
  <TR>
    <TD colspan=3 class="tr3 td31"><P class="p11 ft1">Commitment</P></TD>
    <TD class="tr3 td78"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td79"><P class="p12 ft1">(USD)</P></TD>
    <TD class="tr3 td23"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td24"><P class="p13 ft1">(USD)</P></TD>
    <TD class="tr3 td25"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td32"><P class="p14 ft1">(USD)</P></TD>
    <TD class="tr3 td80"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td34"><P class="p17 ft1">adjustment</P></TD>
    <TD class="tr3 td27"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td82"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td29"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td30"><P class="p9 ft1">(USD)</P></TD>
  </TR>
  <TR>
    <TD colspan=3 class="tr2 td31"><P class="p11 ft1">(USD)</P></TD>
    <TD class="tr2 td78"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td79"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td23"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td24"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td25"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td32"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td80"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td34"><P class="p18 ft1">(USD)</P></TD>
    <TD class="tr2 td27"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td82"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td29"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td30"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD colspan=2 class="tr6 td35"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td36"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td84"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td85"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td39"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td40"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td41"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td42"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td86"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td44"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td45"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td87"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td47"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td48"><P class="p4 ft7">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD colspan=2 class="tr3 td88"><P class="p19 ft1">${
      userFolio.commitment
    }</P></TD>
    <TD class="tr3 td20"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td78"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td79"><P class="p16 ft8">NA</P></TD>
    <TD colspan=2 class="tr3 td89"><P class="p16 ft8">${
      userFolio.contribution
    }</P></TD>
    <TD colspan=2 class="tr3 td90"><P class="p20 ft1">10</P></TD>
    <TD class="tr3 td80"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td34"><P class="p17 ft8">NA</P></TD>
    <TD class="tr3 td27"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td82"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td29"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr3 td30"><P class="p21 ft8">NA</P></TD>
  </TR>
  <TR>
    <TD class="tr7 td49"><P class="p4 ft9">&nbsp;</P></TD>
    <TD class="tr7 td50"><P class="p4 ft9">&nbsp;</P></TD>
    <TD class="tr7 td36"><P class="p4 ft9">&nbsp;</P></TD>
    <TD class="tr7 td84"><P class="p4 ft9">&nbsp;</P></TD>
    <TD class="tr7 td85"><P class="p4 ft9">&nbsp;</P></TD>
    <TD class="tr7 td39"><P class="p4 ft9">&nbsp;</P></TD>
    <TD class="tr7 td40"><P class="p4 ft9">&nbsp;</P></TD>
    <TD class="tr7 td41"><P class="p4 ft9">&nbsp;</P></TD>
    <TD colspan=2 class="tr7 td91"><P class="p4 ft9">&nbsp;</P></TD>
    <TD class="tr7 td44"><P class="p4 ft9">&nbsp;</P></TD>
    <TD class="tr7 td45"><P class="p4 ft9">&nbsp;</P></TD>
    <TD class="tr7 td87"><P class="p4 ft9">&nbsp;</P></TD>
    <TD class="tr7 td47"><P class="p4 ft9">&nbsp;</P></TD>
    <TD class="tr7 td48"><P class="p4 ft9">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD class="tr1 td52"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td53"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td54"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td55"><P class="p4 ft2">&nbsp;</P></TD>
    <TD colspan=7 class="tr1 td92"><P class="p22 ft1">FOCUS INDE GLOBAL FIXED INCOME SERIES 2021</P></TD>
    <TD class="tr1 td59"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td60"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td61"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr1 td62"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD class="tr6 td63"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td64"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td65"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td66"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td67"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td68"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td69"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td70"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td71"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td72"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td73"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td74"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td75"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td76"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td77"><P class="p4 ft7">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD colspan=2 class="tr8 td93"><P class="p23 ft1">Date</P></TD>
    <TD class="tr8 td20"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr8 td21"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr8 td22"><P class="p24 ft1">Transaction</P></TD>
    <TD class="tr8 td94"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr8 td95"><P class="p3 ft1">Distribution</P></TD>
    <TD class="tr8 td96"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr8 td32"><P class="p25 ft1">Contribution</P></TD>
    <TD class="tr8 td80"><P class="p4 ft2">&nbsp;</P></TD>
    <TD colspan=4 class="tr8 td97"><P class="p26 ft8">Withdrawal</P></TD>
    
    <TD class="tr8 td30"><P class="p26 ft1">Balance</P></TD>
  </TR>
  <TR>
    <TD class="tr2 td18"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td99"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td20"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td21"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td22"><P class="p28 ft1">Description</P></TD>
    <TD class="tr2 td94"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td95"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td96"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr2 td32"><P class="p25 ft1">Amount (USD)</P></TD>
    <TD class="tr2 td80"><P class="p4 ft2">&nbsp;</P></TD>
    <TD rowspan=2 colspan=4 class="tr9 td97"><P class="p16 ft1">(USD)</P></TD>
  
    <TD class="tr2 td30"><P class="p16 ft8">Shares</P></TD>
  </TR>
  <TR>
    <TD class="tr10 td18"><P class="p4 ft10">&nbsp;</P></TD>
    <TD class="tr10 td99"><P class="p4 ft10">&nbsp;</P></TD>
    <TD class="tr10 td20"><P class="p4 ft10">&nbsp;</P></TD>
    <TD class="tr10 td21"><P class="p4 ft10">&nbsp;</P></TD>
    <TD class="tr10 td22"><P class="p4 ft10">&nbsp;</P></TD>
    <TD class="tr10 td94"><P class="p4 ft10">&nbsp;</P></TD>
    <TD class="tr10 td95"><P class="p4 ft10">&nbsp;</P></TD>
    <TD class="tr10 td96"><P class="p4 ft10">&nbsp;</P></TD>
    <TD class="tr10 td32"><P class="p4 ft10">&nbsp;</P></TD>
    <TD class="tr10 td80"><P class="p4 ft10">&nbsp;</P></TD>
    <TD class="tr10 td30"><P class="p4 ft10">&nbsp;</P></TD>
  </TR>
  <TR>
    <TD colspan=2 class="tr6 td101"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td36"><P class="p4 ft7">&nbsp;</P></TD>
    <TD colspan=2 class="tr6 td102"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td103"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td104"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td105"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td42"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td86"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td106"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td45"><P class="p4 ft7">&nbsp;</P></TD>
    <TD colspan=2 class="tr6 td107"><P class="p4 ft7">&nbsp;</P></TD>
    <TD class="tr6 td48"><P class="p4 ft7">&nbsp;</P></TD>
  </TR>
     ${displayTransaction(transaction)}
  <TR>

<TR>
<TD colspan=2 class="tr0 td101"><P class="p23 ft3"><NOBR>${''}</NOBR></P></TD>
<TD class="tr0 td36"><P class="p4 ft2">&nbsp;</P></TD>
<TD colspan=2 class="tr0 td102"><P class="p30 ft3"> ${''} </P></TD>
<TD class="tr0 td103"><P class="p4 ft2">&nbsp;</P></TD>
<TD class="tr0 td42"><P class="p31 ft3">${''}</P></TD>
<TD class="tr0 td105"><P class="p4 ft2">&nbsp;</P></TD>
<TD class="tr0 td42"><P class="p31 ft3">${''}</P></TD>
<TD class="tr0 td86"><P class="p4 ft2">&nbsp;</P></TD>
<TD colspan=4 class="tr0 td106"><P class="p16 ft3">${''}</P></TD>
<TD class="tr0 td48"><P class="p32 ft3">${''}</P></TD>
</TR>
<TR>
</TR>
    <TD colspan=5 class="tr0 td108"><P class="p3 ft1">Closing Share Balance: ${showTotal(
      transaction
    )}</P></TD>

    <TD class="tr0 td39"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr0 td104"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr0 td41"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr0 td42"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr0 td43"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr0 td44"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr0 td45"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr0 td46"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr0 td47"><P class="p4 ft2">&nbsp;</P></TD>
    <TD class="tr0 td48"><P class="p4 ft2">&nbsp;</P></TD>
  </TR>
  </TABLE>
  <div>
  <P class="p33 ft1">Thank you for investing in FOCUS INDE GLOBAL FIXED INCOME FUND SERIES 2021 LTD.</P>
  <P class="p34 ft11">FOCUS INDE GLOBAL FIXED INCOME SERIES 2021</P>
  <P class="p35 ft3">C/O Apex Fund & Corporate Services (Mauritius) Ltd.</P>
  <P class="p35 ft3">Lot 15 A3, 1<SPAN class="ft12">st </SPAN>Floor, Cybercity, Ebene 72201, Mauritius</P>
  </div>
  </DIV>
  </BODY>
  </HTML>
  `
  let file = {
    content: template,
    name: 'example.pdf',
  }
  const buffer = await html_to_pdf.generatePdf(file, options)

  // pdf.create(template).toBuffer(function (err, buffer) {
  //   res.contentType('application/pdf')
  //   res.send(buffer)
  // })
  return buffer
}
