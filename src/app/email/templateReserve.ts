export default (
  name: string,
  campingName: string,
  emailOwner: string,
  entry: string,
  exit: string,
  nights: number,
  adults: number,
  pricePerAdult: number,
  childs: number,
  pricePerChilds: number,
  trailer: number,
  pricePerTrailer: number,
  total: number
) =>
  `
      <head>
  <style>
    * {
      padding: 0;
      margin: 0;
    }

    #message-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      background-color: rgb(94, 136, 94);
      border-radius: 0 0 5px 5px;
    }

    #header {
      text-align: center;
      min-height: 170px;
      background: linear-gradient(
          90deg,
          rgba(32, 58, 50, 0.7),
          rgba(152, 128, 86, 0.7)
        ),
        url("https://res.cloudinary.com/pfcampy/image/upload/v1670536350/Fotos/SantaCruz.jpg");
      background-size: cover;
    }

    #items-reserve {
      margin: 20px auto;
      text-align: center;
      border-top: 3px solid rgb(42, 42, 42);
    }

    #item {
      padding: 2rem 1rem;
      font-size: large;
    }

    #item-value {
      margin-top: 10px;
    }
  </style>
</head>
<div id="message-container">
  <div id="header">
    <img
      style="height: 30px; width: auto; margin-top: 40px"
      src="https://res.cloudinary.com/pfcampy/image/upload/v1670466096/logo_CAMPY_rjsp9a.png"
      alt="logo-campy"
    />
    <h2 style="color: white; margin-top: 20px">
      ¡Felicidades <strong>${name}</strong>, tu reserva se ha registrado con
      éxito!
    </h2>
  </div>
  <div id="description-reserve">
    <h3
      style="
        color: white;
        font-weight: 500;
        margin: 30px 0 25px 15px;
        text-decoration: underline;
      "
    >
      Aquí están los detalles de tu reserva:
    </h3>
    <div id="items-reserve">
      <p id="item" style="background-color: rgb(177, 211, 180)">
        <em>Nombre del camping</em><br /><br />
        <strong>${campingName}</strong>
      </p>
      <p id="item" style="background-color: rgb(211, 245, 211)">
        <em>Correo del propietario</em><br /><br />
        <strong>${emailOwner}</strong>
      </p>
      <p id="item" style="background-color: rgb(177, 211, 180)">
        <em>Fecha de ingreso</em><br /><br />
        <strong
          >${new Date(entry).toLocaleDateString("en-us", {
            timeZone: "GMT",
          })}</strong
        >
      </p>
      <p id="item" style="background-color: rgb(211, 245, 211)">
        <em>Fecha de egreso</em><br /><br />
        <strong
          >${new Date(exit).toLocaleDateString("en-us", {
            timeZone: "GMT",
          })}</strong
        >
      </p>
      <p id="item" style="background-color: rgb(177, 211, 180)">
        <em>Cantidad de noches </em><br /><br /><strong>${nights}</strong>
      </p>
      <p id="item" style="background-color: rgb(211, 245, 211)">
        <em>Cantidad de mayores - Precio</em><br /><br />
        <strong>${adults} - $ ${pricePerAdult} c/u</strong>
      </p>
      <p id="item" style="background-color: rgb(177, 211, 180)">
        <em>Cantidad de menores - Precio</em><br /><br />
        <strong
          >${
            childs ? `${childs} - $ ${pricePerChilds} c/u` : "No seleccionado"
          }</strong
        >
      </p>
      <p id="item" style="background-color: rgb(211, 245, 211)">
        <em>Cantidad de rodantes - Precio</em><br /><br />
        <strong
          >${
            trailer
              ? `${trailer} - $ ${pricePerTrailer} c/u`
              : "No seleccionado"
          }</strong
        >
      </p>
      <p id="item" style="background-color: rgb(56, 75, 56); color: white">
        <span style="font-size: 1.4rem; letter-spacing: 2px">TOTAL</span
        ><br /><br />
        <strong style="color: white;"
          >Mayores: ${adults} * ${pricePerAdult}<br />
          + <br />
          Menores: ${childs ? `${childs} * ${pricePerChilds}` : 0}<br />
          + <br />
          Rodantes: ${trailer ? `${trailer} * ${pricePerTrailer}` : 0}<br />
          =<br />
          ${total}</strong
        >
      </p>
    </div>
  </div>
</div>
    `;
