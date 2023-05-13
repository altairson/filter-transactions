$(document).ready(function() {
    const myForm = document.getElementById("myForm");
    const csvFile = document.getElementById("csvFile");
    var data = [];
    var links_text = "";
    var table_content = `Transaction_Hash DateTime Total_Amount\n`;

    myForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = csvFile.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        const text = e.target.result;
        data = csvToArray(text);
        arrayToTable();
      };

      reader.readAsText(input);
    });

    function csvToArray(str, delimiter = `","`) {
        const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
        const rows = str.slice(str.indexOf("\n") + 1).split("\n");
        const arr = rows.map(function (row) {
          const values = row.split(delimiter);
          const el = headers.reduce(function (object, header, index) {
            object[header] = values[index] == undefined ? "" : values[index].replaceAll("\"", "");
            return object;
          }, {});
          return el;
        });
        return arr;
      }

    function arrayToTable() {
        let headers = Object.keys(data[0]);
        let hidden_rows = ["Blockno", "UnixTimestamp", "USDValueDayOfTx"];
        let header_row = `<tr><th>Index</th>`;
        for(let k = 0; k < headers.length; k++) {
            header_row += `<th class="${hidden_rows.includes(headers[k]) ? "hidden" : "visible"}">${headers[k]}</th>`;
        }
        header_row += `</tr>`;
        $("#thead").append(header_row);

        for(let i = 0; i < data.length - 1; i++) {
            let tbody_row = `<tr><td>${i}</td>`;
            for(let j = 0; j < headers.length; j++) {
                tbody_row += `<td class="${hidden_rows.includes(headers[j]) ? "hidden" : "visible"}">${data[i][headers[j]]}</td>`;
            }
            tbody_row += `</tr>`;
            $("#tbody").append(tbody_row);
        }
    }

    $("#filter").click(function() {
        filterData();
    })

    $("#closer").click(function() {
        $(".result").toggleClass("hidden");
    });

    $("#copy_t_links").click(function() {
        navigator.clipboard.writeText(links_text);
    });

    $("#copy_t_data").click(function() {
        navigator.clipboard.writeText(table_content);
    });

    

    function filterData() {
        let wallet_from = $("#wallet_from").val();
        let wallet_to = $("#wallet_to").val();
        let contract = $("#contract").val();
        let link_prefix = $("#network").val() == "0" ? "https://bscscan.com/tx/" : "https://etherscan.io/tx/";
        for(let i = 0; i < data.length; i++) {
            if(data[i]["From"] == wallet_from && data[i]["To"] == wallet_to && data[i]["ContractAddress"] == contract) {
                let link = link_prefix + data[i][`"Txhash`];
                links_text += `${link}\n`;
                table_content += `${data[i][`"Txhash`]} ${data[i][`DateTime`]} ${data[i][`TokenValue`]}\n`;
                let row = `<tr>
                    <td><a href="${link}">${data[i][`"Txhash`]}</a></td>
                    <td>${data[i][`DateTime`]}</td>
                    <td>${data[i][`TokenValue`]}</td>
                </tr>`;
                $("#result_tbody").append(row);
            }
        }
        $(".result").toggleClass("hidden");
    }

});