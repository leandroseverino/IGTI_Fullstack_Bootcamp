// import express from 'express';
import { promises, readFileSync } from "fs";

// const app = express();
// app.use(express.json());

// app.get("/", async (_, res) => {
//   const timeCampeao = await init();  
//   res.send(timeCampeao);
// })

// app.listen(3000, () => {
//   console.log("API Started !");
// });


const {readFile, writeFile} = promises;

let estados = [];
let ufCities = [];
let cidades = [];
let allCities = [];

async function readFiles() {  

  console.log("Lendo os estados ....");    
  const estadosData = await readFile("estados.json");    
  estados = JSON.parse(estadosData);

  const cidadesData = await readFile("cidades.json");
  cidades = JSON.parse(cidadesData);
}

async function createStateFileWithCities() {
  estados.forEach(estado => {
    
    ufCities.push({ 'uf' : estado.Sigla, 'totalCities': 0});
    
    let cities = [];
    cidades.forEach(cidade => {
      if (cidade.Estado === estado.ID) {
        cities.push(cidade);
      }
    })

    writeFile(`${estado.Sigla}.json`, JSON.stringify(cities));
  });
}

async function readCitiesFromStateFile(uf) {
  const estadoData = await readFile(uf + ".json");
  const citiesFromState = JSON.parse(estadoData);
  let countCities = citiesFromState.length;
  return countCities;
}

async function getTotalCitiesByUF() {
  for (const item of ufCities) {
    let total = await readCitiesFromStateFile(item.uf);
    item.totalCities = total;
  }  
}

async function getCountNumberOfCitiesByUFFirstFivesOrderBy(order) {
  ufCities.sort( (a, b) => {
    if ("bigger" === order) {
      return b.totalCities - a.totalCities;
    } else {
      return a.totalCities - b.totalCities;
    }    
  });

  let lastestFives = ufCities.map( item => {
    return item.uf + " - " + item.totalCities;
  });
  
  console.log(`getCountSizeOfCitiesByUFOrderBy('${order}')`, lastestFives.splice(0, 5));
}

async function getCityNameByUFOrderBy(order) {
  
  let stringSize = order === "bigger" ? "Maior" : "Menor";
  console.log(stringSize + " nome de cidade por UF");

  let cities = [];

  for (const item of ufCities) {
    let citiesUF = [];
    const estadoData = await readFile(item.uf + ".json");
    const citiesFromState = JSON.parse(estadoData);
    for ( const citie of citiesFromState) {
      let citieUF = { 'name': citie.Nome, 'uf': item.uf };
      allCities.push(citieUF);
      citiesUF.push(citieUF);
    }

    citiesUF.sort( (a, b) => {
      if ("bigger" === order) {
        return b.name.length - a.name.length;
      } else {
        return a.name.length - b.name.length;
      }    
    });

    cities.push(citiesUF[0].name + " - " + citiesUF[0].uf);
    
  }

  console.log(cities);
  
}

async function getCityNameInTheUF(order) {
  console.log(`getCityNameInTheUF(${order})`);
  allCities.sort( (a, b) => {
    if ("bigger" === order) {
      return b.name.length - a.name.length;
    } else {
      return a.name.length - b.name.length;
    }    
  });
  console.log("allCities", allCities[0]);
}

async function init() {
  try {

    console.log("Iniciando o programa ....");    
    
    await readFiles();
    await createStateFileWithCities();
    
    let countCities = await readCitiesFromStateFile('ES');
    console.log("Quantidade de municípios para o estado de ES = ", countCities);

    let ret = await getTotalCitiesByUF();
    
    await getCountNumberOfCitiesByUFFirstFivesOrderBy("bigger");
    await getCountNumberOfCitiesByUFFirstFivesOrderBy("smaller");

    await getCityNameByUFOrderBy("bigger");
    await getCityNameByUFOrderBy("smaller");

    await getCityNameInTheUF("bigger");
    await getCityNameInTheUF("smaller");


    console.log("programa finalizado");

  } catch (error) {
    console.error(error);
  }
}

init();

