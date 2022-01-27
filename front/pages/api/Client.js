export default async function Connexion() {
  // Using a fetch here but could be any async operation to an external source
  const x = await fetch(`http://localhost:4001/`, {
    method: "GET",
    headers: {
      "Content-Type": "Application/json",
      "Access-Control-Allow-Origin":"*"
    },

  }).then((res) => {
    return res.json();
  });

  res.status(200).json(x);
}
