/*
 * Example JavaScript code for the PLAZA API
 *With reference to: https://bioinformatics.psb.ugent.be/plaza/Documentation/api_example_code
 */

// Set which PLAZA instance's API to use
var plaza_instance =
  "https://bioinformatics.psb.ugent.be/plaza/versions/plaza_v4_monocots/api/v2";
var token_requests_path = plaza_instance + "/token_requests/";

var species_path = plaza_instance + "/species/";
function getSpecies(api_token, args) {
  jQuery.ajax({
    url: species_path,
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + api_token);
    },
    data: args,
    success: function (response) {
      console.log(response);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
    // Synchronously for demonstration purposes. Use async or js promises in real code
    async: false,
  });
}

var genes_path = plaza_instance + "/genes/";
function getGenes(api_token, args) {
  jQuery.ajax({
    url: genes_path,
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + api_token);
    },
    data: args,
    success: function (response) {
      console.log(response);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
    // Synchronously for demonstration purposes. Use async or js promises in real code
    async: false,
  });
}

var ortho_path = plaza_instance + "/genes/orthologs";
function getOrthos(api_token, args) {
  jQuery.ajax({
    url: ortho_path,
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + api_token);
    },
    data: args,
    success: function (response) {
      console.log(response);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
    // Synchronously for demonstration purposes. Use async or js promises in real code
    async: false,
  });
}

console.log("Post token request");
jQuery.post(token_requests_path, {}, function (response) {
  // Get response
  try {
    // data is a JSON object containing the response
    console.log(response);
    //var api_token = response.result.token;
    // This API token is copied from my own browser
    var api_token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2Mjk0ODAwMDcsImp0aSI6Ik9UWTVNalUwT0RRMSIsImlzcyI6ImJpb2luZm9ybWF0aWNzLnBzYi51Z2VudC5iZSIsIm5iZiI6MTYyOTQ4MDAwNywiZXhwIjoxNjI5NDgxMDA3LCJkYXRhIjp7InVzZXIiOjB9fQ.nyIylnoFNw4xWMLL3thp0GX5BEvfjz-3onttwDF8zqYwQm9hjD9Z28B7A5Bk_-8DHkZN7wu7yEansZRP3tTiNg";
  } catch (err) {
    console.error(err);
    return;
  }

  var eplants = {  AT: "AT5G60200",  Barley: "HORVU1Hr1G000010", Maize: "GRMZM5G808402",Porti: "Potri.T085900.2", Potato: "PGSC0003DMG400001913", Rice:"LOC_Os01g01080", Soybean:"Glyma.06G202300", Tomato:"Solyc04g014530",
  Camelina: "Csa01g001040", Eucalyptus: "Eucgr.A00001", Willow: "SapurV1A.0035s0010", Sunflower: "HanXRQChr12g0384141",Cannabis: "AGQN03000001", Wheat: "TraesCS1A01G000100", Sugarcane: "Sh01_g000010"};
  var all_species = ["ath", "ptr", "sma", "osa", "mtr", "sly"];
  // arabidopsis, poplar, soybean, rice, medicago, tomato

  // Testing the API for go terms
  // console.log("Get Genes AT");
  // getGenes(api_token, { ids: "AT5G50870", include: "cds,go_terms" });

  // ------------------------------------

  console.log("Using gene identifiers from ePlant")

  for (const [key, value] of Object.entries(eplants)) {
    for (let i = 0; i < all_species.length; i++) {
      console.log("Gene Tree " + key + ' orthologous species of: ' + all_species[i]);
      getOrthos(api_token, { ids: value, species: all_species[i] });
    }
  }

  var eplants2 = { Barley: "HORVU1Hr1G000010", Porti: "Potri.T085900.2", Potato: "PGSC0003DMG400001249", Soybean:"Glyma.01G001000", Tomato:"Solyc08g029220.1"};
  
  console.log("Using gene identifiers that matches the format of Plaza")
  
  for (const [key, value] of Object.entries(eplants2)) {
    for (let i = 0; i < all_species.length; i++) {
      console.log("Gene Tree " + key + ' orthologous species of: ' + all_species[i]);
      getOrthos(api_token, { ids: value, species: all_species[i] });
    }
  }

});




