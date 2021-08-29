"use strict";

require("dotenv/config");

var _getCards = _interopRequireDefault(require("../trello-api/getCards"));

var _express = _interopRequireDefault(require("express"));

var _trelloConfig = _interopRequireDefault(require("../trello-config"));

var _googleapis = require("googleapis");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var app = (0, _express["default"])();
var port = process.env.PORT || 7000;
app.use(_express["default"].json()); // to support JSON-encoded bodies

app.use(_express["default"].urlencoded()); // to support URL-encoded bodies

var spreadsheetId = "1dLzAa8TZHd6LhmzgX99NhHIcTGgwvqop0-3fNpNPtuw";
var devs = ['nikhila', 'riya', 'deepansh', 'kushang'];
app.get("/", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res.send("This is server for automated trello");

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.post("/", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var actionType, listAfterID, translationKey, cardID, memberCreator, auth, client, googleSheets;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            actionType = req.body.action.type;
            listAfterID = req.body.action.data.listAfter ? req.body.action.data.listAfter.id : null;
            translationKey = req.body.action.display.translationKey;
            cardID = req.body.action.data.card.id || null;
            memberCreator = req.body.action.memberCreator.fullName;

            if (!(actionType == "updateCard" && listAfterID && listAfterID == _trelloConfig["default"].donelistID && translationKey == "action_move_card_from_list_to_list" && cardID)) {
              _context2.next = 12;
              break;
            }

            auth = new _googleapis.google.auth.GoogleAuth({
              keyFile: "google-credentials.json",
              scopes: "https://www.googleapis.com/auth/spreadsheets"
            });
            _context2.next = 9;
            return auth.getClient();

          case 9:
            client = _context2.sent;
            googleSheets = _googleapis.google.sheets({
              version: "v4",
              auth: client
            });
            (0, _getCards["default"])(cardID).then(function (data) {
              googleSheets.spreadsheets.values.append({
                auth: auth,
                spreadsheetId: spreadsheetId,
                range: "Sheet1!A:C",
                valueInputOption: "USER_ENTERED",
                resource: {
                  values: [[data.url, memberCreator, devs[Math.floor(Math.random() * devs.length)]]]
                }
              });
            })["catch"](function (e) {
              return console.log(e);
            });

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}()), app.listen(port, function () {
  console.log("app is running at http://localhost:".concat(port));
});
//# sourceMappingURL=index.js.map