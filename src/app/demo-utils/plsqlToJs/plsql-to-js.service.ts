import { Injectable } from '@angular/core';
import { GlobalObjectsService } from '../../services/global-objects.service';

@Injectable({
  providedIn: 'root'
})
export class PlsqlToJsService {
  xyz: any;

  constructor(private globalObject: GlobalObjectsService) { }

  public getConvertedScript(plsqlData: any, flag?) {
    //var map = new Map<string,string>();     
    var map = [];
    var doubMap = [];
    var singMap = [];
    var varMap = [];



    // var data = plsqlData.toUpperCase();
    // // special function logic start 
    // var specialStr = data.match
    // (/^SUM\(([^)]+)\)|COUNT\(([^)]+)\)|SET_ROW_VALUES\(([^)]+)\)|GO_ITEM\(([^)]+)\)|GET_ITEM_VALUE\(([^)]+)\)|SET_ITEM_VALUE\(([^)]+)\)|GET_ROW_VALUES\(([^)]+)\)|GET_PAGE_CONFIG\(([^)]+)\)|SET_PAGE_CONFIG\(([^)]+)\)|SET_ITEM_CONFIG\(([^)]+)\)|GET_FRAME_CONFIG\(([^)]+)\)|GET_FRAME_CONFIG\(([^)]+)\)|SET_FRAME_CONFIG\(([^)]+)\)|SET_ROWS_SOURCE_CONFIG\(([^)]+)\)|MIN\(([^)]+)\)|AVG\(([^)]+)\)/g);
    // // alert(specialStr);
    // if (specialStr && specialStr.length > 0) {
    //   for (let i = 0; i < specialStr.length; i++) {
    //     map.push("@SUM-" + i + "@####" + specialStr[i]);
    //     data = data.replaceAll(specialStr[i], "@SUM-" + i + "@");
    //   }
    // }

    var doubleQuote = plsqlData.match(/"(?:(?:\\"|[^"])*)"/g);

    if (doubleQuote && doubleQuote.length > 0) {

      for (let i = 0; i < doubleQuote.length; i++) {
        doubMap.push("@dob-" + i + "@####" + doubleQuote[i]);
        plsqlData = plsqlData.replace(doubleQuote[i], "@dob-" + i + "@");
      }
    }




    // special function logic start 
    var specialStr = [];
    // var specialStr =plsqlData.match(/^sum\(([^)]+)\)|count\(([^)]+)\)/g);;
    // var specialStr = plsqlData.match(/^sum\(([^)]+)\)|count\(([^)]+)\)|get_current_record\(([^)]+)\)|set_row_values\(([^)]+)\)|go_item\(([^)]+)\)|get_item_value\(([^)]+)\)|get_row_values\(([^)]+)\)|get_page_config\(([^)]+)\)|set_page_config\(([^)]+)\)|set_item_config\(([^)]+)\)|get_frame_config\(([^)]+)\)|get_frame_config\(([^)]+)\)|set_frame_config\(([^)]+)\)|set_rows_source_config\(([^)]+)\)|app_clear_record\(([^)]+)\)|app_clear_frame\(([^)]+)\)|app_clear_object\(([^)]+)\)|app_back_page\(([^)]+)\)|app_back_object\(([^)]+)\)|app_required_record\(([^)]+)\)|item\(([^)]+)\)|app_execute_item\(([^)]+)\)|app_add_para\(([^)]+)\)|app_execute_frame\(([^)]+)\)|min\(([^)]+)\)|avg\(([^)]+)\)|app_last_record\(([^)]+)\)+-AQ|app_first_record\(([^)]+)\)|app_go_record\(([^)]+)\)|app_previous_record\(([^)]+)\)|get_ref_cursor\(([^)]+)\)|app_next_record\(([^)]+)\)|app_selected_record\(([^)]+)\)/g);

    // (`/^sum\(([^)]+)\)|count\(([^)]+)\)|set_row_values\(([^)]+)\)|go_item\(([^)]+)\)|
    // get_item_value\(([^)]+)\)|set_item_value\(([^)]+)\)|get_row_values\(([^)]+)\)|
    // get_page_config\(([^)]+)\)|set_page_config\(([^)]+)\)|set_item_config\(([^)]+)\)|
    // get_frame_config\(([^)]+)\)|get_frame_config\(([^)]+)\)|set_frame_config\(([^)]+)\)|
    // set_rows_source_config\(([^)]+)\)|app_clear_record\(([^)]+)\)|app_clear_frame\(([^)]+)\)|
    // app_clear_object\(([^)]+)\)|app_back_page\(([^)]+)\)|app_back_object\(([^)]+)\)|
    // app_required_record\(([^)]+)\)|min\(([^)]+)\)|avg\(([^)]+)\)/g`);




    // alert(specialStr);
    if (specialStr && specialStr.length > 0) {

      for (let i = 0; i < specialStr.length; i++) {
        map.push("@SUM-" + i + "@####" + specialStr[i]);
        plsqlData = plsqlData.replaceAll(specialStr[i], "@SUM-" + i + "@");
      }
    }

    let quotedStr = plsqlData.match(/'(?:(?:\\'|[^'])*)'/g);

    if (quotedStr && quotedStr.length > 0) {

      for (let i = 0; i < quotedStr.length; i++) {
        singMap.push("@S$I$N$G-" + i + "@####" + quotedStr[i]);
        plsqlData = plsqlData.replace(quotedStr[i], "@S$I$N$G-" + i + "@");
      }
    }


    var data = plsqlData.toUpperCase();

    // special function logic end

    var bindData = "";
    // data = data.replace(/\n+/g, ' ');
    data = data.replace(/\s+/g, ' ');
    data = data.replace(/\s+;/g, ';');
    // alert("data==>"+data);-+

    //  alert(forline);
    var d = "";

    var procVar: any = "";
    if (data.includes("PROCEDURE") || data.includes("FUNCTION")) {
      // data = data.replaceAll("PROCEDURE", "FUNCTION").replaceAll("AS","{ DECLARE");

      if (data.includes("PROCEDURE")) {
        procVar = data.substring(data.indexOf("PROCEDURE"), data.indexOf("AS")).trim() + "{";
      } else if (data.includes("FUNCTION")) {
        procVar = data.substring(data.indexOf("FUNCTION"), data.indexOf("AS")).trim() + "{";
      }
      procVar = procVar.replaceAll("PROCEDURE", "FUNCTION");
      if ((procVar.indexOf("(") > -1) && (procVar.indexOf(")") > -1)) { } else {
        procVar = procVar + "()";
      }
      data = data.split("AS")[1];
      data = "DECLARE " + data;
      //console.log(procVar);
    }

    let varArr = [];
    if (data.includes("DECLARE")) {
      data = data.replaceAll("DECLARE", "");

      var subString = data.substring(data.indexOf("DECLARE"), data.indexOf("BEGIN")).trim();
      // //console.log("subString.." + subString);

      if (subString.includes(";")) {
        var arr1 = subString.split(";");
        //console.log("arr1==" + arr1);
        for (var i = 0; i < arr1.length; i++) {

          if (arr1[i] !== "") {
            ////console.log("i--"+i);
            if (arr1[i].includes(":=")) {
              arr1[i] = arr1[i].replaceAll(":=", " := ");
            }
            var ab = arr1[i].trim().split(" ");
            //  //console.log("ab:="+ab);
            let indexOf = ab.indexOf(":=");

            if (indexOf > -1) {
              let s = "";
              for (let k = indexOf + 1; k < ab.length; k++) {
                s += ab[k];
                // //console.log("log--"+s);
              }
              d = d + "let " + arr1[i].trim().split(" ")[0] + "@assign@" + s + ";\n";
              varArr.push(arr1[i].trim().split(" ")[0]);
              //   //console.log("assd---"+d);
            } else {
              if (arr1[i].toLowerCase().indexOf("varchar") > -1) {
                varArr.push(arr1[i].trim().split(" ")[0]);
                d += "let " + arr1[i].trim().split(" ")[0] + " := ''; \n";
              } else if (arr1[i].toLowerCase().indexOf("number") > -1) {
                varArr.push(arr1[i].trim().split(" ")[0]);
                d += "let " + arr1[i].trim().split(" ")[0] + " := null; \n";
              }
              // d += "var " + arr1[i].trim().split(" ")[0] + "; \n";
              //  //console.log("vard---"+d);
            }
          }
        }

        // //console.log("d.." + d);
      }


    }


    data = d + data.substring(data.indexOf("BEGIN") + 5);
    if (data.includes(":=")) {
      data = data.replaceAll(":=", "@assign@");
    }

    // alert(Var string);
    if (varArr && varArr.length > 0) {

      for (let i = 0; i < varArr.length; i++) {
        varMap.push("@VAR-" + i + "@####" + varArr[i]);
        data = data.replaceAll(varArr[i], "@VAR-" + i + "@");
      }
    }
    varArr = [];

    var forline = data.match(/FOR (.*?) LOOP/g);
    // if (data.includes("<>")) {
    //   data = data.replaceAll("<>", "!=");
    // }

    // if (data.includes("IS NULL")) {
    //   data = data.replaceAll("IS NULL", " == ''");
    // }

    // if (data.includes("IS NOT NULL")) {
    //   data = data.replaceAll("IS NOT NULL", " != ''");
    // } 

    //////////alert("data3(=)==>"+data)
    if (data.includes("THEN")) {
      data = data.replaceAll("THEN", ") {");
    }
    //////////alert("data3(then)==>"+data)
    if (data.includes("END IF")) {
      data = data.replaceAll("END IF;", "}");
    }
    //////////alert("data3(END IF)==>"+data)
    if (data.includes("ELSIF")) {
      data = data.replaceAll("ELSIF", " } else if (");
    }
    //////////alert("data3(ELSEIF)==>"+data)
    if (data.includes(" IF ")) {
      data = data.replaceAll(" IF ", "if (");
    }
    //////////alert("data3(if)==>"+data)
    if (data.includes("ELSE")) {
      data = data.replaceAll("ELSE", "} else {");
    }
    //////////alert("data3(else)==>"+data)
    if (data.includes("dbms_output.put_line".toUpperCase())) {
      data = data.replaceAll("dbms_output.put_line".toUpperCase(), "console.log");
    }
    //////////alert("data3(conso)==>"+data)
    if (data.includes("END LOOP;")) {
      data = data.replaceAll("END LOOP;", "}");
    }
    //////////alert("data3(end loop)==>"+data)

    // if (data.includes("MSGBOX")) {
    //   // data = data.replaceAll("MSGBOX(", "this.lhs_lib.msgbox(event,");
    //   data = data.replaceAll("MSGBOX", "alert");
    // }
    if (data.includes("ALERT")) {
      // data = data.replaceAll("MSGBOX(", "this.lhs_lib.msgbox(event,");
      data = data.replaceAll("ALERT", "msgbox");
    }
    if (data.includes("FOR")) {
      var temp;
      var jsFor = "";
      if (forline != null && forline.length > 0) {
        for (let fl = 0; fl < forline.length; fl++) {
          if (forline[fl].includes("IN")) {
            temp = forline[fl].match(/IN (.*?) LOOP/g);
            if (temp != null && temp.length > 0) {
              temp[0] = temp[0].replaceAll("IN", "").replaceAll("LOOP", "");
              let indexVal = isNaN(temp[0].split("..")[0]) ? " " + temp[0].split("..")[0].trim() + "-1" : (parseInt(temp[0].split("..")[0]) > 0 ? parseInt(temp[0].split("..")[0]) - 1 : 0);
              jsFor = " for (let " + forline[fl].split(" ")[1].replace("(", "") + "@assign@" + indexVal + "; " + forline[fl].split(" ")[1] + "<" + temp[0].split("..")[1] + "; " + forline[fl].split(" ")[1].replace("(", "") + "++){"
              data = data.replaceAll(forline[fl], jsFor);
            }
          }
          else if (forline[fl].includes("REVERSE")) {
            temp = forline[fl].match(/REVERSE (.*?) LOOP/g);
            if (temp != null && temp.length > 0) {
              let indexVal = parseInt(temp[0].split("..")[0]) - 1;
              jsFor = " for (let " + forline[fl].split(" ")[1].replace("(", "") + "@assign@" + temp[0].split("..")[1] + "; " + forline[fl].split(" ")[1] + ">@assign@" + indexVal + "; " + forline[fl].split(" ")[1].replace("(", "") + "++){"
              data = data.replaceAll(forline[fl], jsFor);
            }
          }
        }

      }

    }
    if (data.includes("WHILE")) {
      var whileline = data.match(/WHILE (.*?) LOOP/g);
      // alert(whileline);
      //alert("before while =="+data);
      if (whileline != null && whileline.length > 0) {
        for (var w = 0; w < whileline.length; w++) {
          this.xyz = " WHILE (" + whileline[w].replaceAll("WHILE", "").replaceAll("LOOP", "") + ") {";
          //  alert(this.xyz+"--"+whileline[w]);
          if (this.xyz.includes("==")) {
            this.xyz = this.xyz.replaceAll("==", "@assign@");
            //alert("===")
          }
          // alert(this.xyz+"--"+whileline[w]);
          data = data.replaceAll(whileline[w], this.xyz);
          // alert("after while"+data);
        }
      }
    }


    //////////alert("after for loop==>"+data);
    if (data.includes("LOOP")) {
      data = data.replaceAll("LOOP", "{");
    }
    ////////////alert("data3(end loop)==>"+data)
    if (data.includes("END;")) {
      data = data.replaceAll("END;", "");
    }

    if (data.includes("||")) {
      //   alert("pipe")
      data = data.replaceAll("||", "+");
    }

    if (data.includes(" OR ")) {
      //   alert("pipe")
      data = data.replaceAll(" OR ", " || ");
    }

    if (data.includes(" AND ")) {
      //   alert("pipe")
      data = data.replaceAll(" AND ", " && ");
    }

    if (data.includes("<>")) {
      // data = data.replaceAll(" <> ", " != ");
      data = data.replaceAll("<>", "!=");
    }

    let equalMap = []
    let assing = data.match(/[#$%^&*+\-;:<>!=]=|==/g)

    // let assing=data.match(/[:<>!=]{2}/g)
    if (assing && assing.length > 0) {
      for (let i = 0; i < assing.length; i++) {
        equalMap.push("@a$s$s$i$n$g-" + i + "@####" + assing[i]);
        data = data.replace(assing[i], "@a$s$s$i$n$g-" + i + "@");
      }
    }

    // if (data.includes("==")) {
    //   data = data.replaceAll("==", "=");
    // }
    if (data.includes("=")) {
      data = data.replaceAll("=", "==");
    }



    // data = data.toLowerCase();
    // if (quotedStr != null && quotedStr.length > 0) {
    //   for (var q = 0; q < quotedStr.length; q++) {
    //     // ////////////alert(quotedStr[q]);
    //     if (data.includes(quotedStr[q].toLowerCase())) {
    //       data = data.replaceAll(quotedStr[q].toLowerCase(), quotedStr[q]);
    //     }
    //   }
    // }





    // if (data.includes(":")) {
    //  data = data.replaceAll(":", "");
    // }


    /*Start BETWEEN parsing */
    //  const regex= /([a-zA-Z0-9_\.\"\'\(\)-]+)\s+BETWEEN\s+(\d+)\s+&&\s+(\d+)/g;
    // const regex=/([a-zA-Z0-9_\.\"\'\(\),]+\(.*?\))(?=\s+BETWEEN)/
    // Match the condition using the regular expression
    if (data.includes("BETWEEN")) {

      const betweenParsing = data.match(/([a-zA-Z0-9_\.\-:@$]+)\s+BETWEEN\s+([a-zA-Z0-9_\.\"\'\,\-:@$]+)\s+&&\s+([a-zA-Z0-9_\.\"\'\,\-:@$]+)/g);
      if (betweenParsing && betweenParsing.length > 0) {
        for (let cond of betweenParsing) {
          let betweenData = cond.match(/([a-zA-Z0-9_\.\"\'\-:@$]+)\s+BETWEEN\s+([a-zA-Z0-9_\.\"\'\-:@$]+)\s+&&\s+([a-zA-Z0-9_\.\"\'\-:@$]+)/)
          // Extract the values if the betweenData is successful
          if (betweenData) {
            const value = betweenData[1]; // Value before 'AND'
            const min = betweenData[2];  // Value after 'AND'
            const max = betweenData[3];
            data = data.replace(cond, `utilvar.sqlutilserv.between(${value},${min},${max})`)
          }
        }
      }
    }
    /*End BETWEEN parsing */

    /*Start NOT IN parsing */
    if (data.includes(" NOT IN")) {
      const InParsing = data.match(/([a-zA-Z0-9_\.\-:@]+)\s+NOT IN\s*([a-zA-Z0-9_\.\"\'\(\)-:@$]+)/g);
      if (InParsing && InParsing.length > 0) {
        for (let cond of InParsing) {
          let inData = cond.match(/([a-zA-Z0-9_\.\"\'\(\)-:@]+)\s+NOT IN\s*([a-zA-Z0-9_\.\"\'\(\)-:@$]+)/)
          // Extract the values if the betweenData is successful
          if (inData) {
            const value = inData[1]; // Value before 'NOT IN'
            let comPairData = inData[2];  // Value after 'NOT IN'
            // Replace first character with [ and last with ]
            comPairData = "[" + comPairData.slice(1, -1) + "]";

            data = data.replace(cond, `utilvar.sqlutilserv.not_in(${value},${comPairData})`)
          }
        }
      }
    }
    /*End NOT IN parsing */
    /*Start IN parsing */

    if (data.includes(" IN")) {
      const InParsing = data.match(/([a-zA-Z0-9_\.\-:@]+)\s+(?<=\s)IN\s*\(([^()]*)\)/g);
      // const InParsing = data.match(/(?<![a-zA-Z0-9_])([@a-zA-Z0-9_.:$-]+)\s*IN\s*(\([^()]*\)|[@a-zA-Z0-9_.:$-]+)/g);
      if (InParsing && InParsing.length > 0) {
        for (let cond of InParsing) {
          let inData = cond.match(/([a-zA-Z0-9_\.\"\'\(\)-:@$]+)\s+IN\s*([a-zA-Z0-9_\.\"\'\(\)-:@$]+)/)
          if (inData) {
            const value = inData[1]; // Value before 'IN'
            let comPairData = inData[2];  // Value after 'IN'

            // Replace first character with [ and last with ]
            comPairData = "[" + comPairData.slice(1, -1) + "]";

            data = data.replace(cond, `utilvar.sqlutilserv.in(${value},${comPairData})`)
          }
        }
      }
    }
    /*End IN parsing */
    /*Start set item value */
    // var bindVarLogic = data.match(/\s*:[^;]*@assign@[^;]*;\s*/g);
    var bindVarLogic = data.match(/(:[a-zA-Z0-9_\.\s]+)@assign@[^;]*;\s*/g);
    // var bindVarLogic = data.match(/^\s*:[^;]*@assign@[^;]*;\s*$/g);
    //    alert("logic:  "+bindVarLogic);
    if (bindVarLogic && bindVarLogic.length > 0) {
      for (let cond of bindVarLogic) {
        let betweenData = cond.match(/(:[a-zA-Z0-9_\.\s]+)+@assign@(.+?);/)
        // let betweenData=cond.match(/([a-zA-Z0-9_\.\-:]+)+@assign@([a-zA-Z0-9_\.\"\'\(\)-:@$+]+)/)
        // Extract the values if the betweenData is successful
        if (betweenData) {
          let first = betweenData[1]; // Value before 'AND'
          first = first.replace(":", "").replace(/ /g, "");
          const second = betweenData[2];  // Value after 'AND'
          // const max = betweenData[3];
          let changeString = `set_item_value('${first}','current_record',${second});`
          data = data.replace(cond, changeString)
          //  data=data.replaceAll(cond,`utilvar.sqlutilserv.between(${value},${min},${max})`)
        }
      }
    }
    /*End set item value */

    /*Start is null */
    if (data.includes(" IS NULL ")) {
      var bindVarLogic = data.match(/([a-zA-Z0-9_\.\-:@]+)\s+IS NULL/g);
      // var bindVarLogic = data.match(/^\s*:[^;]*@assign@[^;]*;\s*$/g);
      //    alert("logic:  "+bindVarLogic);
      if (bindVarLogic && bindVarLogic.length > 0) {
        for (let cond of bindVarLogic) {
          let isNullData = cond.match(/([a-zA-Z0-9_\.\-:@]+)\s+IS NULL/)
          // let betweenData=cond.match(/([a-zA-Z0-9_\.\-:]+)+@assign@([a-zA-Z0-9_\.\"\'\(\)-:@$+]+)/)
          // Extract the values if the betweenData is successful
          if (isNullData) {
            let value = isNullData[1]; // Value before 'AND'

            //  let changeString=`set_item_value('${first}',0,${second});`
            //  data=data.replaceAll(cond,changeString)
            data = data.replace(cond, `utilvar.sqlutilserv.isnull(${value})`)
          }
        }
      }
    }
    /*End is null*/

    /*Start is not null */
    if (data.includes(" IS NOT NULL ")) {
      var bindVarLogic = data.match(/([a-zA-Z0-9_\.\-:@]+)\s+IS NOT NULL/g);
      // var bindVarLogic = data.match(/^\s*:[^;]*@assign@[^;]*;\s*$/g);
      //    alert("logic:  "+bindVarLogic);
      if (bindVarLogic && bindVarLogic.length > 0) {
        for (let cond of bindVarLogic) {
          let isNotNullData = cond.match(/([a-zA-Z0-9_\.\-:@]+)\s+IS NOT NULL/)
          if (isNotNullData) {
            let value = isNotNullData[1]; // Value before 'AND'

            //  let changeString=`set_item_value('${first}',0,${second});`
            //  data=data.replaceAll(cond,changeString)
            data = data.replace(cond, `utilvar.sqlutilserv.isnotnull(${value})`)
          }
        }
      }
    }
    /*End is not null*/


    // for (var b = 0; b < bindVarLogic.length; b++) {
    //   let d = bindVarLogic[b].replaceAll('^', "").trim();

    //   if (d && d !== "") {
    //     let bindData = "SET_ITEM_VALUE(\'" + d.replaceAll("@assign@", "").replaceAll(";", "") + "\',0)@assign@";
    //     if (d.includes(".") && d.split(".").length > 2) {
    //       let dtt: any = ""
    //       dtt = d.split(".")[0] + "." + d.split(".")[1] + "";
    //       bindData = "SET_ITEM_VALUE(\'" + dtt.replaceAll("@assign@", "").replaceAll(";", "") + "\'," + d.split(".")[2].replaceAll("@assign@", "") + "-1)@assign@";
    //       bindData = bindData.replace(" ", "");
    //     }

    //     // alert(bindData);
    //     data = data.replaceAll(bindVarLogic[b], bindData);
    //   }
    // }


    /* End set_itm_value */




    // /*start = parsing */
    // if(data.includes(" = ")){
    //   const InParsing = data.match(/(?<=\s)=(?=\s)/g);
    //     if(InParsing && InParsing.length>0){
    //       for (let cond of InParsing) {
    //         data=data.replaceAll(cond,"==")
    //       }
    //     } 
    // }
    // // let matches = str.match(/(?<=\s)abc(?=\s)/);
    //  /*End = parsing */

    //console.log("Data===>" + data);
    // var bindVarLogic = data.match(/:(.*?)[=,*,>,<,+,/,%,-,(,;,},\s]/g);
    // //  alert(bindVarLogic);
    // if (bindVarLogic && bindVarLogic.length > 0) {
    //   for (var b = 0; b < bindVarLogic.length; b++) {
    //     let d = bindVarLogic[b].replaceAll(":", "").trim();
    //     // alert("get befo--->"+d);

    //     //console.log("d--->" + d);
    //     if (d && d !== "") {
    //       // console.log(d.match(/[a-z_]+/gi));
    //       let v = d.match(/[a-z_.0-9_-]+/gi)[0];
    //       // console.log(d.replace("=", "").replaceAll("=", "").replaceAll(";", "").replaceAll(">", "").replaceAll("*", "").replaceAll("+", "").replaceAll("-", "").replaceAll(",", "").replaceAll("<", "") + "\','current_record')");
    //       // bindData = "GET_ITEM_VALUE(\'" + d.replace("=", "").replaceAll("=", "").replaceAll(";", "").replaceAll(">", "").replaceAll("*", "").replaceAll("+", "").replaceAll(",", "").replaceAll("-", "").replaceAll("<", "") + "\','current_record')" + d.substr(d.length - 1);
    //       bindData = d.replace(v, "GET_ITEM_VALUE(\'" + v + "', 'current_record')")

    //       // if (d.includes(".") && d.split(".").length > 2) {
    //       //   bindData = "GET_ITEM_VALUE(\'" + d.replaceAll("=", "").replaceAll(";", "").replaceAll(">", "").replaceAll("*", "").replaceAll("+", "").replaceAll("-", "").replaceAll("<", "") + "\',"
    //       //   bindData = bindData + d.split(".")[2].replaceAll("=", "").replaceAll(";", "").replaceAll(">", "").replaceAll("*", "").replaceAll("+", "").replaceAll("-", "").replaceAll("<", "") + "))" + d.substr(d.length - 1);
    //       //   console.log(bindData);
    //       //   console.log(d.split(".")[2].replace("=", "").replaceAll("=", "").replaceAll(";", "").replaceAll(">", "").replaceAll("*", "").replaceAll("+", "").replaceAll("-", "").replaceAll("<", "") + "-1)");

    //       //   bindData = bindData.replace("." + d.split(".")[2].replace("=", "").replaceAll("=", ""), "");

    //       //   bindData = bindData.replace(" ", "");

    //       // }
    //       data = data.replaceAll(bindVarLogic[b], bindData);
    //       // }
    //     }
    //   }
    // }

    /* start get_item_value */
    var bindVarLogic = data.match(/(:[a-zA-Z0-9_\.]+)/g);

    if (bindVarLogic && bindVarLogic.length > 0) {
      for (let cond of bindVarLogic) {
        let getData = cond.match(/(:[a-zA-Z0-9_\.]+)/)

        if (getData) {
          let first = getData[1]; // Value before 'AND'
          first = first.replace(":", "")
          let changeString;
          if (flag) {
            changeString = `data['${first.toUpperCase()}']`
          } else {
            changeString = `get_item_value('${first}','current_record')`
          }
          data = data.replace(cond, changeString)
        }
      }
    }
    /* End get_item_value */
    quotedStr = ""
    quotedStr = data.match(/'(?:(?:\\'|[^'])*)'/g);

    if (quotedStr && quotedStr.length > 0) {
      let ai = singMap.length;
      for (let i = 0; i < quotedStr.length; i++) {
        singMap.push("@S$I$N$G-" + ai + "@####" + quotedStr[i]);
        data = data.replace(quotedStr[i], "@S$I$N$G-" + ai + "@");
        ai++;
      }
    }


    if (data.includes("ROUND(")) {
      data = data.replaceAll("ROUND(", "utilvar.sqlutilserv.round(");
    }
    if (data.includes("LEAST(")) {
      data = data.replaceAll("LEAST(", "utilvar.sqlutilserv.least(");
    }
    if (data.includes("GREATEST(")) {
      data = data.replaceAll("GREATEST(", "utilvar.sqlutilserv.greatest(");
    }
    if (data.includes("INITCAP(")) {
      data = data.replaceAll("INITCAP(", "utilvar.sqlutilserv.initcap(");
    }
    if (data.includes("DECODE(")) {
      data = data.replaceAll("DECODE(", "utilvar.sqlutilserv.decode(");
    }
    if (data.includes("EXP(")) {
      data = data.replaceAll("EXP(", "utilvar.sqlutilserv.exp(");
    }
    if (data.includes("REMAINDER(")) {
      data = data.replaceAll("REMAINDER(", "utilvar.sqlutilserv.remainder(");
    }
    if (data.includes("MOD(")) {
      data = data.replaceAll("MOD(", "utilvar.sqlutilserv.mod(");
    }
    if (data.includes("RPAD(")) {
      data = data.replaceAll("RPAD(", "utilvar.sqlutilserv.rpad(");
    }
    if (data.includes("LPAD(")) {
      data = data.replaceAll("LPAD(", "utilvar.sqlutilserv.lpad(");
    }
    if (data.includes("LENGTH(")) {
      data = data.replaceAll("LENGTH(", "utilvar.sqlutilserv.length(");
    }
    if (data.includes("SUBSTR(")) {
      data = data.replaceAll("SUBSTR(", "utilvar.sqlutilserv.substr(");
    }
    if (data.includes("TRIM(")) {
      data = data.replaceAll("TRIM(", "utilvar.sqlutilserv.trim(");
    }
    if (data.includes("LTRIM(")) {
      data = data.replaceAll("LTRIM(", "utilvar.sqlutilserv.ltrim(");
    }
    if (data.includes("RTRIM(")) {
      data = data.replaceAll("RTRIM(", "utilvar.sqlutilserv.rtrim(");
    }
    if (data.includes("LOWER(")) {
      data = data.replaceAll("LOWER(", "utilvar.sqlutilserv.lower(");
    }
    if (data.includes("UPPER(")) {
      data = data.replaceAll("UPPER(", "utilvar.sqlutilserv.upper(");
    }
    if (data.includes("CHR(")) {
      data = data.replaceAll("CHR(", "utilvar.sqlutilserv.chr(");
    }
    if (data.includes("ASCII(")) {
      data = data.replaceAll("ASCII(", "utilvar.sqlutilserv.ascii(");
    }
    if (data.includes("NVL(")) {
      data = data.replaceAll("NVL(", "utilvar.sqlutilserv.nvl( ");
    }
    if (data.includes("POWER(")) {
      data = data.replaceAll("POWER(", "utilvar.sqlutilserv.power(");
    }
    if (data.includes("CEIL(")) {
      data = data.replaceAll("CEIL(", "utilvar.sqlutilserv.ceil(");
    }
    if (data.includes("FLOOR(")) {
      data = data.replaceAll("FLOOR(", "utilvar.sqlutilserv.floor(");
    }
    if (data.includes("SQRT(")) {
      data = data.replaceAll("SQRT(", "utilvar.sqlutilserv.sqrt(");
    }
    if (data.includes("ABS(")) {
      data = data.replaceAll("ABS(", "utilvar.sqlutilserv.abs(");
    }
    if (data.includes("INSTR(")) {
      data = data.replaceAll("INSTR(", "utilvar.sqlutilserv.instr(");
    }
    if (data.includes("REPLACE(")) {
      data = data.replaceAll("REPLACE(", "utilvar.sqlutilserv.replace(");
    }
    if (data.includes("FIRSTDAY(")) {
      data = data.replaceAll("FIRSTDAY(", "utilvar.sqlutilserv.firstday(");
    }
    if (data.includes("LASTDAY(")) {
      data = data.replaceAll("LASTDAY(", "utilvar.sqlutilserv.lastday(");
    }

    if (data.includes("DAYSDIFFERENCE(")) {
      data = data.replaceAll("DAYSDIFFERENCE(", "utilvar.sqlutilserv.daysdifference(");
    }

    if (data.includes("TIMEDIFFERENCE(")) {
      data = data.replaceAll("TIMEDIFFERENCE(", "utilvar.sqlutilserv.timedifference(");
    }

    if (data.includes("TO_CHAR(")) {
      data = data.replaceAll("TO_CHAR(", "utilvar.sqlutilserv.tochar(");
    }
    if (data.includes("TRUNC(")) {
      data = data.replaceAll("TRUNC(", "utilvar.sqlutilserv.trunc(");
    }
    if (data.includes("SIN(")) {
      data = data.replaceAll("SIN(", "utilvar.sqlutilserv.sin(");
    }
    if (data.includes("COS(")) {
      data = data.replaceAll("COS(", "utilvar.sqlutilserv.cos(");
    }
    if (data.includes("TAN(")) {
      data = data.replaceAll("TAN(", "utilvar.sqlutilserv.tan(");
    }
    if (data.includes("NEXTDAY(")) {
      data = data.replaceAll("NEXTDAY(", "utilvar.sqlutilserv.nextday(");
    }
    // if (data.includes("BETWEEN")) {
    //   data = data.replaceAll("BETWEEN", "utilvar.sqlutilserv.between");
    //   // /between(:B.VALUE,100,200)
    // }


    let varKey = "";
    for (let i = 0; i < varMap.length; i++) {
      varKey = varMap[i].split("####");
      if (data.includes(varKey[0])) {
        data = data.replaceAll(varKey[0] + "", varKey[1]);
        //  alert("data=gdsfdff=?"+data)
      }
    }



    data = data.toLowerCase();

    // if (doubleQuote != null && doubleQuote.length > 0) {
    //   for (var q = 0; q < doubleQuote.length; q++) {
    //     // ////////////alert(quotedStr[q]);
    //     if (data.includes(doubleQuote[q].toLowerCase())) {
    //       data = data.replaceAll(doubleQuote[q].toLowerCase(), doubleQuote[q]);
    //     }
    //   }
    // }

    // if (quotedStr != null && quotedStr.length > 0) {
    //   for (var q = 0; q < quotedStr.length; q++) {
    //     // ////////////alert(quotedStr[q]);
    //     if (data.includes(quotedStr[q].toLowerCase())) {
    //       data = data.replaceAll(quotedStr[q].toLowerCase(), quotedStr[q]);
    //     }
    //   }
    // }

    // if (quotedStr != null && quotedStr.length > 0) {
    //   for (var q = 0; q < quotedStr.length; q++) {
    //     // ////////////alert(quotedStr[q]);
    //     if (data.includes(quotedStr[q].toLowerCase())) {
    //       data = data.replaceAll(quotedStr[q].toLowerCase(), quotedStr[q]);
    //     }
    //   }
    // }

    //console.log("data====>" + data);
    // var bindVarLogic = data.match(/\^(.*?)@assign@/g);
    // //    alert("logic:  "+bindVarLogic);
    // if (bindVarLogic && bindVarLogic.length > 0) {
    //   for (var b = 0; b < bindVarLogic.length; b++) {
    //     let d = bindVarLogic[b].replaceAll('^', "").trim();

    //     if (d && d !== "") {
    //       let bindData = "SET_ITEM_VALUE(\'" + d.replaceAll("@assign@", "").replaceAll(";", "") + "\',0)@assign@";
    //       if (d.includes(".") && d.split(".").length > 2) {
    //         let dtt: any = ""
    //         dtt = d.split(".")[0] + "." + d.split(".")[1] + "";
    //         bindData = "SET_ITEM_VALUE(\'" + dtt.replaceAll("@assign@", "").replaceAll(";", "") + "\'," + d.split(".")[2].replaceAll("@assign@", "") + "-1)@assign@";
    //         bindData = bindData.replace(" ", "");
    //       }

    //       // alert(bindData);
    //       data = data.replaceAll(bindVarLogic[b], bindData);
    //     }
    //   }

    // }

    if (data.includes("@assign@")) {
      data = data.replaceAll("@assign@", "=");
    }

    if (data.includes("sysdatetime")) {

      let date = this.globalObject.formatDate(new Date(), "dd-MMM-yyyy HH:mm:ss")
      // data = data.replaceAll("sysdate", "'" + date + "'");
      data = data.replaceAll("sysdatetime", "'" + date + "'");
      // data = data.replaceAll("sysdate", "this.today");
    }
    if (data.includes("sysdate")) {

      let date = this.globalObject.formatDate(new Date(), "dd-MMM-yyyy")
      // data = data.replaceAll("sysdate", "'" + date + "'");
      data = data.replaceAll("sysdate", "'" + date + "'");
      // data = data.replaceAll("sysdate", "this.today");
    }
    var setvalue = data.match(/SET_ITEM_VALUE(.*?);/g);

    if (setvalue && setvalue.length > 0) {
      for (var i = 0; i < setvalue.length; i++) {
        if (setvalue[i].includes("=")) {
          let temp = setvalue[i].split("=")[1];
          let temp1 = setvalue[i].split("=")[0].replaceAll(")", "") + "," + temp.replaceAll(";", "") + ");";
          data = data.replaceAll(setvalue[i], temp1);
        }
      }

    }

    //inner loop logic start
    /*
    var ls="@LS@";
    var le="@LE@";
    var endLoop = data.match("/END LOOP;/g");
    if(endLoop && endLoop.length>0){
        for(var a=0;a<endLoop.length;a++){
            var findex = data.indexOf("LOOP");
            data = data.substr(0+findex)+ls+a+data.substr(findex+4,data.length);
            var lindex = data.l
        }
    }*/

    //inner loop logic end
    //  data = data.replace(/ '/g, "'").replace(/' /g, "'");

    // alert(map.length+"====");
    /*for (let [key, value] of map) {
      alert(key+"=="+value);
      //let key1 = ""+key;
       alert(key.toLowerCase()+"=="+value);
      if(data.includes(key.toLowerCase()+"")){
       data = data.replaceAll(key.toLowerCase()+"", value);
       alert("data=gdsfdff=?"+data)
      }
       
     }*/


    let equalKey: any = ""
    for (let i = 0; i < equalMap.length; i++) {
      equalKey = equalMap[i].split("####");
      if (data.includes(equalKey[0].toLowerCase())) {
        data = data.replace(equalKey[0].toLowerCase() + "", equalKey[1]);
      }
    }


    let tempkey = "";
    for (let i = 0; i < map.length; i++) {
      tempkey = map[i].split("####");
      if (data.includes(tempkey[0].toLowerCase())) {
        data = data.replaceAll(tempkey[0].toLowerCase() + "", tempkey[1]);
        //  alert("data=gdsfdff=?"+data)
      }
    }

    tempkey = "";
    for (let i = 0; i < doubMap.length; i++) {
      tempkey = doubMap[i].split("####");
      if (data.includes(tempkey[0].toLowerCase())) {
        data = data.replace(tempkey[0].toLowerCase() + "", tempkey[1]);
        //  alert("data=gdsfdff=?"+data)
      }
    }

    tempkey = "";
    for (let i = 0; i < singMap.length; i++) {
      tempkey = singMap[i].split("####");
      if (data.includes(tempkey[0].toLowerCase())) {
        data = data.replace(tempkey[0].toLowerCase() + "", tempkey[1]);
        //  alert("data=gdsfdff=?"+data)
      }
    }



    if (procVar) {
      data = procVar + data + "}";
    }

    return data;


  }
}
