exports.handler = async function() {
  return {
    statusCode:302,
    headers:{
      "Location":"/",
      "Set-Cookie": `jamil_token=; HttpOnly; Secure; Path=/; Max-Age=0`
    }
  };
};
