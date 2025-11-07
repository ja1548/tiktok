exports.handler = async function(event, context) {
  const params = new URLSearchParams(event.queryStringParameters);
  const code = params.get("code");
  const state = params.get("state");

  const cookieState = event.headers.cookie?.match(/oauth_state=([^;]+)/)?.[1];
  if(!code || !state || cookieState !== state) return { statusCode:400, body:"Invalid OAuth state or code" };

  const bodyParams = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY,
    client_secret: process.env.TIKTOK_CLIENT_SECRET,
    code,
    grant_type:"authorization_code",
    redirect_uri: process.env.SITE_DOMAIN + '/.netlify/functions/callback'
  });

  const tokenRes = await fetch("https://open-api.tiktok.com/oauth/access_token", {
    method:"POST",
    headers:{"Content-Type":"application/x-www-form-urlencoded"},
    body: bodyParams.toString()
  });
  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.data?.access_token || tokenJson.access_token;

  return {
    statusCode:302,
    headers:{
      "Location":"/",
      "Set-Cookie": `jamil_token=${encodeURIComponent(accessToken)}; HttpOnly; Secure; Path=/; Max-Age=3600`
    }
  };
};
