export default (name: string, token: string, id: number): string => {
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
