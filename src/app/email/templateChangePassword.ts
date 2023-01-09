export default (name: string, token: string) =>
  `<head>
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
        url("https://res.cloudinary.com/pfcampy/image/upload/v1670535617/Fotos/Tierradelfuego.jpg");
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
    <h2 style="color: white">Ingresa tu nueva contraseña, ${name}</h2>
  </div>
  <p style="margin-top: 20px; font-weight: 400" id="description">
    Una vez que ingreses tu nueva contraseña y presiones 'aceptar' podrás
    iniciar sesión con ella.
  </p>
  <p style="font-size: 0.8rem; font-weight: 600" id="description">
    Solo se tendrá validez por las próximas 12hs.
  </p>
  <form
    action="${
      process.env.HOST || "http://localhost:3001"
    }/api/usuarios/password"
    method="POST"
    style="padding: 15px"
  >
    <input
      style="
        padding: 5px;
        border: none;
        outline: none;
        background-color: rgb(199, 201, 203);
        border-radius: 5px;
      "
      type="password"
      placeholder="Nueva clave"
      name="password"
      pattern="^.{5}.*"
      required
    />
    <input type="hidden" name="token" value="${token}" />
    <input
      style="
        padding: 5px;
        border: none;
        outline: none;
        cursor: pointer;
        color: white;
        border-radius: 5px;
        background-color: rgb(66, 96, 60);
      "
      type="submit"
      value="aceptar"
    />
  </form>
</div>`;
