import { datosEmailContact } from "../types/datosEmailContact";

export default ({ name, email, subject, text }: datosEmailContact) =>
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
