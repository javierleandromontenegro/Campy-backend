export default (name: string) => {
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
