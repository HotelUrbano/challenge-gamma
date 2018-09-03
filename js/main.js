//Cria uma função que retorna uma promise se a request tiver sido bem sucedida retorna os dados da resposta da request. Se a request nao for bem  sucedida a Promise sera rejeitada.
function getData(url) {
    return new Promise(function (resolve, reject) {
        let req = new XMLHttpRequest()

        req.open('GET', url)
        req.onload = function () {

            if (req.status === 200) {
                resolve(req.response)
            } else {
                reject(req.status, req.statusText)
            }
        }
        req.onerror = function () {
            reject("erro de conexão")

        }
        req.send()
    })
}

//A bing não liberou a imagem é necessário liberar o 'Access-Control-Allow-Origin'
let catchImage = document.querySelector("body")
let url = getData("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=pt-BR").then(function (response) {
    let jsonResponse = JSON.parse(response)
    catchImage.innerHTML = ""
    for (let url of jsonResponse["url"]) {
        catchImage.innerHTML = catchImage.innerHTML + "<img src='" + url.img_src + "' />"

        console.log(url.img_src)
    }
}, function (error) { console.log(error.code) })

let query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22:city%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"
console.log(query) //Mostra os dados da api

function $(element) {
    return document.querySelector(element);
}
/* Transformar graus fahrenheit em celsius para fazer isso subtraia 32 e divida por 1,8. */
function Celsius(f) {
    return ((f - 32) / 1.8).toFixed(0);
}
/* Transformar Milhas por hora para Milhas por segundo para fazer isso multiplica o resultado por 0.44 e dividi por 1. */
function MilhasSegundo(s) {
    return (s * 0.44 / 1).toFixed(2);
}
/** Transformar Milhas por hora para Km/h para fazer isso multiplica o resultado por 1,6. */
function KmhHora(s) {
    return (s * 1.60934 / 1).toFixed(2);
}
/*Pega o valor da sensação térmica atraves da velocidade e temperatura do vento para fazer isso 33+(10 raiz quadrade de v + 10,45-v)*t-33/22 */
/* v velocidade e t temperatura */
function sensacaoTermica(v, t) {
    return (33 + (10 * (v / v) + 10.45 - v) * (t - 33) / 22).toFixed(2);
}
// função criada para carregar o json e mostrar os dados solicitados
function loadJson(city, callback) {
    let req = new XMLHttpRequest();

    let url = query.replace(":city", encodeURI(city));

    req.onreadystatechange = function () {
        if (this.readyState == 0) { // Request não inicializada

        } else if (this.readyState == 1) { // Conexão estabilizada com o servidor

        } else if (this.readyState == 2) { // Request recebida

        } else if (this.readyState == 3) { // Processando request

        } else if (this.readyState == 4 && this.status == 200) { // Request finalizada

            callback(city, JSON.parse(this.responseText)); // Call back devolve os dados pesquisados
        }
    };

    req.open("GET", url, true);
    req.send();
}

//Função para pegar os resultados das cidades e inprimir no html
let currentWeather;
function renderCity(city, json) {
    if (json.query.results) {
        $("#resultados").style.display = "block";
        // variavel criada para guardar os resultados do json
        let channel = json.query.results.channel;

        // variavel criada para guardar os dados do json referente a localizaçao e mostrar no html
        let location = channel.location;
        $("#localizacao").innerHTML = location.city + ", " + location.region + " - " + location.country;


        // variavel criada para guardar os dados do json referente a condição do tempo e mostrar no html
        let condition = channel.item.condition;
        $("#condicao").innerHTML = Celsius(condition.temp) + "°C " + condition.text;
        currentWeather = Celsius(condition.temp);
        trocar();

        // variavel criada para guardar os dados do json referente a condição do tempo no dia e mostrar no html
        let today = channel.item.forecast[0];
        $("#tempoBaixa").innerHTML = Celsius(today.low) + "Min";
        $("#tempoAlta").innerHTML = Celsius(today.high) + "Max";

        // variavel criada para guardar os dados do json referente a aos ventos e sensação termica no dia mostrar no html
        let wind = channel.wind;
        $("#sensation").innerHTML = sensacaoTermica(MilhasSegundo(wind.speed), Celsius(condition.temp));
        $("#wind").innerHTML = KmhHora(wind.speed);

        // variavel criada para guardar os dados do json referente a umidade no dia e mostrar no html
        let atmosphere = channel.atmosphere;
        $("span#umidade").innerHTML = atmosphere.humidity;

        // Resultado da previsão do tempo.
        let ul = $("ul#forecast");

        // Remove todos os elementos filhos
        while (ul.hasChildNodes()) ul.removeChild(ul.firstChild);

        for (let index = 1; index <= 5; index++) {
            let li = document.createElement("LI");
            let header = document.createElement("HEADER");
            let h4 = document.createElement("H4");
            let p = document.createElement("P");
            let spantempBaixa = document.createElement("SPAN");
            let spantempAlta = document.createElement("SPAN");


            spantempBaixa.setAttribute("class", "celsius");
            spantempAlta.setAttribute("class", "celsius");

            h4.appendChild(document.createTextNode(channel.item.forecast[index].day));
            spantempBaixa.appendChild(document.createTextNode(Celsius(channel.item.forecast[index].low)));
            spantempAlta.appendChild(document.createTextNode(Celsius(channel.item.forecast[index].high)));

            header.appendChild(h4);
            p.appendChild(spantempBaixa);
            p.appendChild(spantempAlta);
            li.appendChild(header);
            li.appendChild(p);
            ul.appendChild(li);
        }
    }
}

function searchCity(city) {
    loadJson(city, renderCity);
}
// Função para adicionar um evento ao input e retornar os dados das cidades pesquisadas
function init() {
    $("#input-city").addEventListener("keypress", function (event) {
        if (event.keyCode == 13) {
            let city = $("#input-city").value.trim();

            if (city != "") {
                searchCity(city);
            }
        }
    });

    $("#result2").addEventListener("click", function (event) {
        $("#resultados").style.display = "none";
    });
}

window.onload = init;
//Função criada para trocar a cor de acordo com a temperatura do local
function trocar() {
    console.log("troca acionado " + currentWeather);
    let cor = document.getElementById('resultados');
    if (currentWeather <= 15) {
        cor.style.background = "rgb(0,255,255,0.6)";

    } else if (currentWeather <= 35) {
        cor.style.background = "rgb(255,140,0,0.7)";

    } else if (currentWeather >= 35) {
        cor.style.background = "rgb((255,0,0,0.6)";

    }
}



