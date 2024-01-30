// Get all TemTems in options
$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "https://temtem-api.mael.tech/api/temtems",
    dataType: "json",
    success: function (data) {
      if (data) {
        data.forEach((element) => {
          $("#emptyOption").after(
            "<option value=" +
              element["number"] +
              ">" +
              element["name"] +
              "</option>"
          );
        });
      }
    },
    error: function () {
      console.error("Error al obtener la información del TemTem.");
    },
  });
});

// Create layout for information
function createTemplate() {
  var data =
    "<div id='photo' class='col-12 col-md-auto ms-lg-0 text-center'>" +
    "<img id='icon' class='me-3 me-lg-0' src='' alt='' />" +
    "</div>" +
    "<div id='info' class='col-12 col-lg-auto align-items-center'>" +
    "<div class='name d-flex'>" +
    "<h2></h2>" +
    "<div class='align-self-center' id='temtemTypes'></div>" +
    "</div>" +
    "<div class='info'>" +
    "<a class='align-self-end' target='_blank'></a>" +
    "<p>Debilidades:</p>" +
    "<div id='debilities' class='row'></div>" +
    "</div>" +
    "</div>";
  $(".row").append(data);
}

// Get information from selected TemTem
$(document).ready(function () {
  $("#temtem").change(function () {
    var selectedValue = $(this).val();
    if (selectedValue) {
      $.ajax({
        type: "GET",
        url: "https://temtem-api.mael.tech/api/temtems/" + selectedValue,
        dataType: "json",
        success: function (data) {
          if (data) {
            console.log(data);
            $("#photo, #info").remove();
            if (!$("#temtemRow").length) {
              createTemplate();
            }
            // Nombre del TemTem
            $(".name h2").text(data["name"]);
            $("#info a").text("Más información...");
            $("#info a").attr("href", data["wikiUrl"]);

            // Tipos del TemTem
            data["types"].forEach((type) => {
              $("#temtemTypes").append(
                "<img class='type' id=" +
                  type +
                  " src='./images/types/" +
                  type +
                  ".png'>"
              );
            });
            // Icono del TemTem
            if (data["icon"]) {
              $("#icon").attr("src", "." + data["icon"]);
            } else {
              $("#icon").attr("src", data["portraitWikiUrl"]);
            }
            weakness(data["types"]);
            changeColor();
          }
        },
        error: function () {
          console.error("Error al obtener la información del TemTem.");
        },
      });
    } else {
      $("#photo, #info").remove();
    }
  });
});

// Get weakness TemTem
function weakness(types) {
  var debilidadesTipo1 = {};
  var debilidadesTipo2 = {};

  $(document).ready(function () {
    $.ajax({
      type: "GET",
      url: "https://temtem-api.mael.tech/api/weaknesses",
      dataType: "json",
      success: function (data) {
        if (data) {
          var wkns = Object.entries(data);

          for (let i = 0; i < types.length; i++) {
            wkns.forEach((weakness) => {
              var debilidad = Object.values(weakness);
              var deb = Object.entries(debilidad[1]);

              for (let j = 0; j < deb.length; j++) {
                if (deb[j][0] == types[i]) {
                  if (i === 0) {
                    debilidadesTipo1[debilidad[0]] = deb[j][1];
                  } else {
                    debilidadesTipo2[debilidad[0]] = deb[j][1];
                  }
                }
              }
            });
          }

          var sumaDebilidades = {};

          function sumarDebilidadesTipo(debilidadesTipo) {
            for (var tipo in debilidadesTipo) {
              if (sumaDebilidades.hasOwnProperty(tipo)) {
                var calculo = sumaDebilidades[tipo] * debilidadesTipo[tipo];
                sumaDebilidades[tipo] = calculo;
              } else {
                sumaDebilidades[tipo] = debilidadesTipo[tipo];
              }
            }
          }

          // Verificar si debilidadesTipo1 está definido y no es nulo
          if (debilidadesTipo1 && typeof debilidadesTipo1 === "object") {
            sumarDebilidadesTipo(debilidadesTipo1);
          }

          // Verificar si debilidadesTipo2 está definido y no es nulo
          if (debilidadesTipo2 && typeof debilidadesTipo2 === "object") {
            sumarDebilidadesTipo(debilidadesTipo2);
          }

          $("#debilities").empty();
          for (var tipo in sumaDebilidades) {
            var img =
              "<div class='col-lg-1 col-2 pt-2 pb-3 pb-lg-0'><img class='type' src='../images/types/" +
              tipo +
              ".png'><p id='calculo'>";
            if (sumaDebilidades[tipo] === 0.25) {
              img += "1⁄4";
            } else if (sumaDebilidades[tipo] === 0.5) {
              img += "1⁄2";
            } else if (sumaDebilidades[tipo] === 1) {
              img += "-";
            } else {
              img += sumaDebilidades[tipo];
            }
            img += "</p></div>";
            $("#debilities").append(img);
          }
        }
      },
      error: function () {
        console.error("Error al obtener la información del TemTem.");
      },
    });
  });
}

// Select2 options
$(document).ready(function () {
  $("#temtem").select2({
    placeholder: "Selecciona un TemTem...",
    tags: true,
  });

  $("#clearSelect2").on("click", function () {
    $("#temtem").val(null).trigger("change");
  });
});

// Change color value weakness
function changeColor() {
  console.log($("#calculo"));
  if ($("p#calculo").text() == 2) {
    $("#calculo").css("text-color", "green");
  }
}
