import express from 'express';
import { promises } from "fs";

const app = express();
app.use(express.json());

app.get("/", async (_, res) => {
  const timeCampeao = await init();  
  res.send(timeCampeao);
})

app.listen(3000, () => {
  console.log("API Started !");
});


const {readFile, writeFile} = promises;

const times = [];

async function init() {
  try {
    const binaryData = await readFile("2003.json");
    const data = JSON.parse(binaryData);
      data[0].partidas.forEach(partida => {
        times.push({ time: partida.mandante, pontuacao: 0 });
        times.push({ time: partida.visitante, pontuacao: 0});
      });

      data.forEach(rodada => {
        rodada.partidas.forEach( partida => {
          let idxM = times.findIndex(time => time.time === partida.mandante);
          let idxV = times.findIndex(time => time.time === partida.visitante);
          if (partida.placar_mandante > partida.placar_visitante) {            
            times[idxM].pontuacao += 3;
          } else if (partida.placar_mandante < partida.placar_visitante) {
            let idx = times.findIndex(time => time.time === partida.visitante);
            times[idxV].pontuacao += 3;
          } else {
            times[idxM].pontuacao += 1;
            times[idxV].pontuacao += 1;
          }
        }); 
      });
      
      times.sort((a, b) => {
        return b.pontuacao - a.pontuacao;
      });
      
      await writeFile("times.json", JSON.stringify(times));
      // console.log(`o campeão foi ${times[0].time} com ${times[0].pontuacao} pontos`);
      return times[0].time;

  } catch (error) {
    console.error(error);
  }
}

init();
