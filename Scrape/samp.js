import GameDig from "gamedig";
import axios from "axios";

export default async function handler(req, res) {
  const { ip, port } = req.query;

  if (!ip || !port) {
    return res.status(400).json({
      status: false,
      message: "Masukkan parameter ip dan port"
    });
  }

  try {
    // Query SA-MP
    const state = await GameDig.query({
      type: "samp",
      host: ip,
      port: parseInt(port),
      socketTimeout: 2000
    });

    // Auto detect region
    let region = {};
    try {
      const geo = await axios.get(`http://ip-api.com/json/${ip}`);
      region = {
        country: geo.data.country,
        countryCode: geo.data.countryCode,
        regionName: geo.data.regionName,
        city: geo.data.city,
        isp: geo.data.isp
      };
    } catch {
      region = { message: "Gagal detect region" };
    }

    return res.status(200).json({
      status: true,
      creator: 'DapszNotDev',
      online: true,
      ip,
      port,
      hostname: state.name,
      gamemode: state.raw?.gamemode || null,
      mapname: state.map,
      playersOnline: state.players.length,
      maxPlayers: state.maxplayers,
      passworded: state.password,
      ping: state.ping,
      region,
      playerList: state.players.map(p => ({
        name: p.name,
        ping: p.ping
      }))
    });

  } catch (error) {
    return res.status(200).json({
      status: true,
      online: false,
      ip,
      port,
      message: "Server Offline atau Tidak Merespon"
    });
  }
}
