import fetch from "node-fetch";

let getCards = async (cardID) => {

    try {
      const response = await fetch(`https://api.trello.com/1/cards/${cardID}?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
};

export default getCards