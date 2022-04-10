const url = window.location.href;
const replacedURL = url.replace("#", "&");
const finalURL = new URLSearchParams(replacedURL);
var accessToken = finalURL.get("access_token");
var idToken = finalURL.get("id_token");
console.log(accessToken);
aws_region = "us-east-1";
AWS.config.region = aws_region;



document.querySelectorAll(".search")[0].addEventListener("click", () => {
  var cityName = document.querySelector(".city").value;
  weather(cityName);
});

/*fetch('https://1yteiky3ul.execute-api.us-east-1.amazonaws.com/test/temp',{
   method:GET,
    headers:{
      
    }
}*/


async function weather(cityName) {
  try {
    var results = await fetch(`https://1yteiky3ul.execute-api.us-east-1.amazonaws.com/test/temp?city=${cityName}`,{
      headers:{"authentication":accessToken}
    }).then((r) => r.json());
    //console.log(results);
    // console.log(Object.keys(results).length);
    renderResults(results);
  } catch (err) {
    console.log("No results found in our database", err);
    let html = "";
    let htmlSegment = `<div><h2 style="color :red;text-align :center; font-size:2rem;"> Sorry, No Data Found!! <h2></div>`;
    html += htmlSegment;
    addDiv(html);
  }

  if (results.Temperature >= "20℃" && results.Humidity > "30%") {
    picture("sunny");
  } else if (results.Temperature <= "20℃" && results.Precipitation < "50%") {
    picture("cloudy");
  } else if (results.Precipitation >= "40%" && results.Temperature <= "20℃") {
    picture("rainy");
  }
}

const renderResults = (results) => {
  let html = "";
  var count = Object.keys(results).length;
  if (results && count === 1) {
    //let htmlSegment = `<div><h2 style="color :red;text-align :center; font-size:2rem;">Sorry, No Data found!!<h2></div>`;
    //html += htmlSegment;
    for (const key in results) {
      let htmlSegment = `<div>
                         <img src='' alt='' />
                         <p></p>
                        <h2>${key} ${results[key]} </h2>
                            </div>`;

      html += htmlSegment;
    }
  }

  if (results && count > 1) {
    for (const key in results) {
      let htmlSegment = `<div>
                         <img src='' alt='' />
                         <p></p>
                        <h2>${key} ${results[key]} </h2>
                            </div>`;

      html += htmlSegment;
    }
  }

  addDiv(html);
};

function addDiv(html) {
  var divv = document.querySelectorAll("div")[0];
  divv.classList.add("container");
  let container = document.querySelector(".container");
  container.innerHTML = html;
}

function picture(weatherType) {
  var weatherRn = `Pictures/${weatherType}.png`;
  switch (weatherType) {
    case "sunny":
      document.querySelectorAll("img")[0].setAttribute("src", weatherRn);
      document.querySelector("img").classList.add("img");
      document.querySelector("p").innerHTML = "Sunny";
      break;
    case "cloudy":
      document.querySelectorAll("img")[0].setAttribute("src", weatherRn);
      document.querySelector("img").classList.add("img");
      document.querySelector("p").innerHTML = "Cloudy";
      break;

    case "rainy":
      document.querySelectorAll("img")[0].setAttribute("src", weatherRn);
      document.querySelector("img").classList.add("img");
      document.querySelector("p").innerHTML = "Rainy";
      break;

    default:
      console.log();
  }
}
