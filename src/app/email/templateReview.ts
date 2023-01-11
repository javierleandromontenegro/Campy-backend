export default (
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
    href="https://campy-frontend.vercel.app/reviews/${campingId}?xlr8=${token}&ultraT=${usuarioId}"
    target="_blank"
    rel="noreferrer"
    >Ir al formulario</a
  >
</div>
  `;
};
