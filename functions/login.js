exports.handler = async function(event, context) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = process.env.SITE_DOMAIN + '/.netlify/functions/callback';
  const state = crypto.randomUUID();
  const authUrl = `https://www.tiktok.com/auth/authorize?client_key=${clientKey}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=user.info.basic&state=${state}`;
  return {
    statusCode: 302,
    headers: {
      "Location": authUrl,
      "Set-Cookie": `oauth_state=${state}; HttpOnly; Secure; Path=/; Max-Age=600`
    }
  };
};
