import {} from "dotenv/config";
import getCards from "./trello-api/getCards";
import express from "express";
import trelloConfig from "./trello-config";
import { google } from "googleapis";

const app = express();
const port = process.env.PORT || 7000;
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

const spreadsheetId = "1dLzAa8TZHd6LhmzgX99NhHIcTGgwvqop0-3fNpNPtuw";

const devs = ['nikhila','riya','deepansh','kushang']

app.get("/", async (req, res) => {
  res.send("This is server for automated trello");
});

app.post("/", async(req, res, next) => {
  const actionType = req.body.action.type;
  const listAfterID = req.body.action.data.listAfter ? req.body.action.data.listAfter.id : null;
  const translationKey = req.body.action.display.translationKey;
  const cardID = req.body.action.data.card.id || null;
  const memberCreator = req.body.action.memberCreator.fullName;

  if (
    actionType == "updateCard" && listAfterID && listAfterID == trelloConfig.donelistID &&
    translationKey == "action_move_card_from_list_to_list" && cardID
  ) {
    const auth = new google.auth.GoogleAuth({
        keyFile: "google-credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });
    
      const client = await auth.getClient();

      const googleSheets =  google.sheets({ version: "v4", auth: client });
      getCards(cardID).then(data => {
        googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Sheet1!A:C",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    [data.url, memberCreator, devs[Math.floor(Math.random() * devs.length)]]
                ]
            }
        })
      }).catch(e => console.log(e))
  }
}),
  app.listen(port, () => {
    console.log(`app is running at http://localhost:${port}`);
  });

