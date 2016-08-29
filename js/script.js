function getInformation(button){
  //URI vers notre ressource
  var uri = button.getAttribute("resource");
  //La requête SPARQL à proprement parler
  var querySPARQL=""+
    'PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> '+
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> '+
    'PREFIX foaf: <http://xmlns.com/foaf/0.1/> '+
    'SELECT ?label ?abstract ?thumbnail ?thumbnailCaption '+
    'WHERE { '+
    '    <'+uri+'> rdfs:label ?label . '+
    '    <'+uri+'> dbpedia-owl:abstract ?abstract .'+
    '    OPTIONAL { '+
    '      <'+uri+'> dbpedia-owl:thumbnail ?thumbnail . '+
    '      <'+uri+'> dbpedia-owl:thumbnailCaption ?thumbnailCaption . '+
    '    } '+
    'FILTER( lang(?label) = "fr" && lang(?abstract) = "fr")'+
    '  }';

  // On prépare l'URL racine (aussi appelé ENDPOINT) pour interroger DBPedia (ici en français)
  var baseURL="http://fr.dbpedia.org/sparql";
  // On construit donc notre requête à partir de cette baseURL
  var queryURL = baseURL + "?" + "query="+ encodeURIComponent(querySPARQL) + "&format=json";

  //On crée notre requête AJAX
  var req = new XMLHttpRequest();
  req.open("GET", queryURL, true);
  req.onreadystatechange = myCode;   // the handler
  req.send(null);

  function myCode()
  {
     if (req.readyState == 4)
     {
        initialisation();

        var doc = JSON.parse(req.responseText);
        var label = doc.results.bindings[0].label.value;
        var abstract =  doc.results.bindings[0].abstract.value;
        var thumbnail =  doc.results.bindings[0].thumbnail.value;
        var thumbnailCaption =  doc.results.bindings[0].thumbnailCaption.value;

        //On crée le titre
        newTitle = document.createElement("h2");
        newTitle.innerHTML = label;

        //On crée le résumé
        newAbstract = document.createElement("div");
        newAbstract.innerHTML = abstract;

        //On crée le conteneur de l'image
        newThumbnail = document.createElement("div");
        newThumbnail.id = "thumbnail";
        var img = new Image();
        img.src = thumbnail;
        img.alt = label;

        //On crée la légende de l'image
        newThumbnailCaption = document.createElement("p");
        newThumbnailCaption.id = "thumbnailCaption";
        newThumbnailCaption.innerHTML = thumbnailCaption;

        document.getElementById("infos").appendChild(newTitle);
        document.getElementById("infos").appendChild(newAbstract);
        document.getElementById("infos").appendChild(newThumbnail);
        document.getElementById("thumbnail").appendChild(img);
        document.getElementById("thumbnail").appendChild(newThumbnailCaption);
     }
  }

  function initialisation() {
    // Removing all children from an element
    var element = document.getElementById("infos");
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}
