import { datosEmailContact } from "../types/datosEmailContact";

export const getTemplateRegister = (
  name: string,
  token: string,
  id: number
): string => {
  return `
      <head>
        <style>
          #message-container {
            width: 100%;
            min-height: 100px;
            text-align: center;
            justify-content: center;
            align-items: center;
            padding: 30px 0;
            background: linear-gradient(90deg, rgba(54, 63, 55, .5), rgba(30, 53, 55, .7)), url("https://res.cloudinary.com/pfcampy/image/upload/v1670536215/Fotos/Misiones.jpg");
          }

          #greeting {
            color: white;
            font-size: 2rem;
            padding: 0;
            margin: 0;
            margin-top: 10px;
          }

          #description {
            color: white;
            font-size: 20px;
            padding: 0;
            margin: 15px 0;
          }

          #warning {
            width: 80%;
            color: white;
            font-size: 1.15rem;
            font-style: italic;
            padding: 0;
            margin: 15px auto;
          }

          #confirm-link {
            color: white;
            font-size: 1rem;
            font-weight: 600;
            padding: 8px 5px;
            cursor: pointer;
            text-decoration: none;
            border-radius: 5px;
            transition: all 0.5s ease;
            background-color: #5F8F4B;
          }

          #confirm-link:hover {
            color: white;
            background-color: #BDB395;
          }
        </style>
      </head>
      <div id='message-container'>
          <img style='height: 30px; width: auto' src='https://res.cloudinary.com/pfcampy/image/upload/v1670466096/logo_CAMPY_rjsp9a.png' alt='logo-campy' />
          <h2 id='greeting' style="text-shadow: 0 3px black">¡Felicidades ${name}!</h2>
          <p id='description'>Estás a un solo paso de ser un nuevo Campy...</p>
          <p id='warning'>(Si han pasado más de 12hs desde el registro es probable que al apretar el botón 'verificar cuenta' dé un error. Si es así, volvé a registrarte en la página para obtener un nuevo correo de confirmación)</p>
          <a id='confirm-link' href='${
            process.env.HOST || "http://localhost:3001"
          }/api/confirm/${token}?id=${id}' target='_blank'>
            Verificar cuenta
          </a>
      </div>
    `;
};

export const getTemplateReview = (
  campingId: string,
  usuarioId: string,
  token: string,
  name: string
) => {
  return `
    <head>
  <style>
    #message-container {
      width: 100%;
      min-height: 100px;
      text-align: center;
      justify-content: center;
      align-items: center;
      padding: 30px 0;
      background: linear-gradient(
          90deg,
          rgba(54, 63, 55, 0.5),
          rgba(30, 53, 55, 0.7)
        ),
        url("https://res.cloudinary.com/pfcampy/image/upload/v1670536275/Fotos/Jujuy.jpg");
      background-size: cover;
    }

    #greeting {
      color: white;
      font-size: 2rem;
      padding: 0;
      margin: 0;
      margin-top: 10px;
    }

    #description {
      color: white;
      font-size: 20px;
      padding: 0;
      margin: 15px 0;
    }

    #confirm-link {
      color: white;
      font-size: 1rem;
      font-weight: 600;
      padding: 8px 5px;
      cursor: pointer;
      text-decoration: none;
      border-radius: 5px;
      transition: all 0.5s ease;
      background-color: #5f8f4b;
    }

    #confirm-link:hover {
      color: white;
      background-color: #bdb395;
    }
  </style>
</head>
<div id="message-container">
  <img
    style="height: 30px; width: auto"
    src="https://res.cloudinary.com/pfcampy/image/upload/v1670466096/logo_CAMPY_rjsp9a.png"
    alt="logo-campy"
  />
  <h2 id="greeting">¡Cómo estás ${name}!</h2>
  <p id="description">
    Hace poco finalizaron uno de tus viajes de camping. Nos interesa saber tu
    opinión de lo que fue tu estadía.
  </p>
  <p id="description">
    Por favor, le pedimos que llene el formulario de review que se le presentara
    una vez que clickquee el enlace. ¡Muchas gracias!
  </p>
  <a
    id="confirm-link"
    href="${
      process.env.HOST_FRONTEND || "http://localhost:3000"
    }/reviews/${campingId}?xlr8=${token}&ultraT=${usuarioId}"
    target="_blank"
    rel="noreferrer"
    >Ir al formulario</a
  >
</div>
  `;
};

export const getTemplateContactUser = (name: string) => {
  return `
  <head>
  <style>
    * {
      padding: 0;
      margin: 0;
    }

    #message-container {
      width: 100%;
      min-height: 100px;
      padding-bottom: 30px;
      background-color: rgb(240, 239, 239);
    }

    #header {
      text-align: center;
      min-height: 150px;
      background: linear-gradient(
          90deg,
          rgba(138, 155, 140, 0.5),
          rgba(83, 77, 66, 0.7)
        ),
        url("https://res.cloudinary.com/pfcampy/image/upload/v1670536537/Fotos/Corrientes.jpg");
      background-size: cover;
    }

    #description {
      padding: 5px 15px;
      font-size: 1rem;
      color: rgb(17, 17, 17);
      font-weight: bolder;
    }
  </style>
</head>
<div id="message-container">
  <div id="header">
    <img
      style="height: 30px; width: auto; margin: 30px auto"
      src="https://res.cloudinary.com/pfcampy/image/upload/v1670466096/logo_CAMPY_rjsp9a.png"
      alt="logo-campy"
    />
    <h2 style="color: white">¡Muchas gracias ${name} por contactarnos!</h2>
  </div>
  <p style="margin-top: 20px" id="description">
    Recibimos tu contacto con éxito. Próximamente un administrador de Campy se
    contactará contigo.
  </p>
  <p id="description" style="font-size: 0.9rem; margin-top: 20px">¡Saludos!</p>
  <p id="description" style="font-size: 0.9rem">Campy</p>
</div>`;
};

export const getTemplateContactAdmin = ({
  name,
  email,
  subject,
  text,
}: datosEmailContact) =>
  `
  <head>
  <style>
    * {
      padding: 0;
      margin: 0;
    }

    #message-container {
      position: relative;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      justify-content: center;
      align-items: center;
      background-color: rgb(240, 239, 239);
      border: 1px solid rgb(99, 99, 99);
    }

    #title {
      color: white;
      text-align: center;
      padding: 15px;
    }

    #container-data * {
      padding: 20px 15px;
      word-wrap: break-word;
    }

    #logo-campy {
      position: absolute;
      bottom: 5px;
      right: 5px;
    }
  </style>
</head>
<div id="message-container">
  <div
    style="background-color: #537b44; border-bottom: 1px solid rgb(99, 99, 99)"
  >
    <h2 id="title">Recibiste una consulta de: ${name.toLocaleUpperCase()}</h2>
  </div>
  <div id="container-data">
    <p style="background-color: white; box-shadow: 0px 2px 5px black;"><strong>Nombre:</strong> ${name}</p>
    <p><strong>Correo:</strong> ${email}</p>
    <p style="background-color: white; box-shadow: 2px 2px 1px 4px black"><strong>Asunto:</strong> ${subject}</p>
    <p><strong>Texto:</strong> ${text}</p>
  </div>
</div>`;

export const getTemplateReserve = (
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
