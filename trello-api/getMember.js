import fetch from "node-fetch";

let getMember = async (id) => {

    try {
      const response = await fetch(`https://api.trello.com/1/members/${id}?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`);
      const data = await response.text();
      return data;
    } catch (error) {
      console.log(error);
    }
};

export default getMember