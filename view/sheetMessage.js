// sheetMessage.js
// message based on google sheet
// ================

//import
const Discord = require("discord.js");

const c = require("../general/constLoader");
const i18n = require('../general/langSupport');
const Spreadsheet = require('edit-google-spreadsheet');

const showItem = (callback) => {
    Spreadsheet.load({
        debug: true,
        spreadsheetName: c.spreadSheetName(),
        worksheetName: c.workSheetName(),
        
        oauth2: {
          client_id: c.googleClientId(),
          client_secret: c.googleClientSecret(),
          refresh_token: c.googleRefreshToken()
        },

      }, function sheetReady(err, spreadsheet) {
          spreadsheet.receive({getValues: true},function(err, rows, info) {
            if(err) throw err;
            
            var players = [];
            var dates = [];
            
            for (let row of Object.keys(rows)) {
                
                let r = rows[row];
                
                if (r["6"] === 'Ø') {
                    dates.push(r["2"]);
                    dates.push(r["3"]);
                    dates.push(r["4"]);
                    dates.push(r["5"]);
                    continue;
                }
                
                var entry = {};
                entry["name"] = r["1"];
                
                var hasNewlyJoined = r["5"] == "-";
                entry["4"] = r["5"];
                
                if (hasNewlyJoined) {
                    entry["3"] = "-";
                } else {
                    hasNewlyJoined = r["4"] == "-";
                    entry["3"] = r["4"];
                }
                
                
                if (hasNewlyJoined) {
                    entry["2"] = "-";
                } else {
                    hasNewlyJoined = r["3"] == "-";
                    entry["2"] = r["3"];
                }
                
                if (hasNewlyJoined) {
                    entry["1"] = "-";
                } else {
                    hasNewlyJoined = r["2"] == "-";
                    entry["1"] = r["2"];
                }
                
                
                entry["avg"] = r["6"];
                
                players.push(entry);
            }


            var content = "";
            
            
            var count = 0;
            
            for (let row of players) {
                content = `${content}${row["name"]}: ${row["1"]} | ${row["2"]} | ${row["3"]} | ${row["4"]}\n`
                
                count = count + 1;
                if (count % 20 == 0) {

                    let embed = new Discord.RichEmbed();
                    embed.addField(`Name | ${dates[0]} | ${dates[1]} | ${dates[2]} | ${dates[3]}`,content);
            
                    callback(embed);
                    content = "";
                }
            
            }
            
            let embed = new Discord.RichEmbed();
            embed.addField(`Name | ${dates[0]} | ${dates[1]} | ${dates[2]} | ${dates[3]}`,content);
            
            callback(embed);
            
          });
      });
}

// export
module.exports = {
    showEPList: showItem
};