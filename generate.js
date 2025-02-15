const fs = require("fs");
const studioId = "7cywyk0q";
const studioDataset = "production";

function makeImgUrl(ref) {
  const parts = ref.split("-");
  const id = parts[1];
  const dimentions = parts[2];
  const format = parts[3];
  const optimizedSize = "&w=600";
  return `https://cdn.sanity.io/images/${studioId}/${studioDataset}/${id}-${dimentions}.${format}?fm=webp${optimizedSize}`;
}
const generateHtml = (data) => {
  const brand = data.filter((element) => element._type === "brand")[0];
  const services = data.filter((element) => element._type === "services");
  const excursion = data.filter((element) => element._type === "excursion");
  const gallery = data.filter((element) => element._type === "gallery");

  const logo = makeImgUrl(brand.favicon?.asset?._ref);
  const heroImg = makeImgUrl(brand.hero?.asset?._ref);
  const brandName = brand.title;
  const whatsapp = brand.whatsapp;
  const email = brand.email;
  const logoTransparent = makeImgUrl(brand.logo?.asset?._ref);
  const servicesRendered = services
    .map(
      (service) =>
        `<div class="card${service.service === "Excursiones" ? " card2" : ""}">
        <img
          src=${makeImgUrl(service.image?.asset?._ref)}
          alt="Cataratas del Iguazú Traslados y Turismo"
        />
        <h4>${service.service}</h4>
        ${
          service.service === "Excursiones"
            ? `<div>
            ${excursion
              .map(
                (excursion) =>
                  `<p>${excursion.location}</p>
            <ul>
            ${excursion.list.map((item) => `<li>${item}</li>`).join("")}
            </ul>`
              )
              .join("")}
          </div>`
            : `<ul>${service.list
                .map((item) => `<li>${item}</li>`)
                .join("")}</ul>`
        }
      </div>`
    )
    .join("");
  const galleryRendered = (galleryId) =>
    gallery
      .map((item, index) => {
        if (item.location === galleryId)
          if (item.video) {
            return `<video
            controls
            autoplay
            muted
            loop
            ${index === 0 ? `class="active"` : ""}
            id="${item.title}"
          >
            <source src="${item.video}" type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>`;
          } else
            return `<img
        ${item.title ? `id="${item.title}"` : ""}
        src="${makeImgUrl(item.image.asset._ref)}"
        alt="${item.location}"
        loading="lazy"
        onclick="toggleFullScreen(this)"
        />`;
      })
      .join("");

  const dots = (galleryId) =>
    gallery
      .map((item, index) => {
        if (item.location === galleryId)
          return `<span
          class="dot${index === 0 ? " active" : ""}"
          onclick="setCurrentImage(index)"
          ></span>`;
      })
      .join("");

  const htmlContent = `
  <!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href=${logo} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${brandName}</title>
    <link rel="stylesheet" href="index.css" />
    <link rel="manifest" href="./manifest.json" />
    <link rel="apple-touch-icon" href=${logo} />
    <link rel="icon" type="image/x-icon" href=${logo} />
    <meta
      name="description"
      content="Ofrecemos servicios de traslado y excursiones en las Cataratas del Iguazú. Disfruta de una experiencia inolvidable con transporte seguro y cómodo, explorando las maravillas naturales de la región."
    />
    <link rel="canonical" href="https://lsbturismo.com/" />
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://lsbturismo.com/" />
    <meta property="og:title" content=${brandName} />
    <meta
      property="og:description"
      content="Ofrecemos servicios de traslado y excursiones en las Cataratas del Iguazú. Disfruta de una experiencia inolvidable con transporte seguro y cómodo, explorando las maravillas naturales de la región."
    />
    <meta property="og:image" content="https://lsbturismo.com/img/logo.png" />
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://lsbturismo.com/" />
    <meta name="twitter:title" content=${brandName} />
    <meta
      name="twitter:description"
      content="Ofrecemos servicios de traslado y excursiones en las Cataratas del Iguazú. Disfruta de una experiencia inolvidable con transporte seguro y cómodo, explorando las maravillas naturales de la región."
    />
    <meta name="twitter:image" content=${logo} />
  </head>
  <body>
    <header class="navBar">
      <nav class="nav">
        <a href="/" class="item">Inicio</a>
        <a href="/#servicios" class="item">Servicios</a>
        <a href="/#galería" class="item">Galería</a>
      </nav>
      <nav class="navMobile">
        <input type="checkbox" id="navButton" />
        <ul class="menu">
          <li>
            <a href="/">
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="iconFill"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.3103 1.77586C11.6966 1.40805 12.3034 1.40805 12.6897 1.77586L20.6897 9.39491L23.1897 11.7759C23.5896 12.1567 23.605 12.7897 23.2241 13.1897C22.8433 13.5896 22.2103 13.605 21.8103 13.2241L21 12.4524V20C21 21.1046 20.1046 22 19 22H14H10H5C3.89543 22 3 21.1046 3 20V12.4524L2.18966 13.2241C1.78972 13.605 1.15675 13.5896 0.775862 13.1897C0.394976 12.7897 0.410414 12.1567 0.810345 11.7759L3.31034 9.39491L11.3103 1.77586ZM5 10.5476V20H9V15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15V20H19V10.5476L12 3.88095L5 10.5476ZM13 20V15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15V20H13Z"
                  fill="#black"
                />
              </svg>
              Inicio
            </a>
          </li>
          <li>
            <a href="/#servicios">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="iconStroke"
                  d="M8 5.00005C7.01165 5.00082 6.49359 5.01338 6.09202 5.21799C5.71569 5.40973 5.40973 5.71569 5.21799 6.09202C5 6.51984 5 7.07989 5 8.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.07989 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V8.2C19 7.07989 19 6.51984 18.782 6.09202C18.5903 5.71569 18.2843 5.40973 17.908 5.21799C17.5064 5.01338 16.9884 5.00082 16 5.00005M8 5.00005V7H16V5.00005M8 5.00005V4.70711C8 4.25435 8.17986 3.82014 8.5 3.5C8.82014 3.17986 9.25435 3 9.70711 3H14.2929C14.7456 3 15.1799 3.17986 15.5 3.5C15.8201 3.82014 16 4.25435 16 4.70711V5.00005M12 15H9M15 11H9"
                  stroke="#000000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Servicios
            </a>
          </li>
          <li>
            <a href="/#galería">
              <svg
                fill="#000000"
                width="80px"
                height="80px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="iconFill"
                  d="M7,10A4,4,0,1,0,3,6,4,4,0,0,0,7,10ZM7,4A2,2,0,1,1,5,6,2,2,0,0,1,7,4ZM2,22H22a1,1,0,0,0,.949-1.316l-4-12a1,1,0,0,0-1.708-.335l-5.39,6.289L8.6,12.2a1,1,0,0,0-1.4.2l-6,8A1,1,0,0,0,2,22Zm6.2-7.6,3.2,2.4a1,1,0,0,0,1.359-.149l4.851-5.659,3,9.008H4Z"
                />
              </svg>
              Galería
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://wa.me/${whatsapp}?text=Hola%20Lucas%20Pinto,%20me%20comunico%20contigo%20a%20través%20de%20tu%20página%20web%20(https://lsbturismo.com)%20Me%20gustaría%20tener%20más%20información%20sobre%20tus%20servicios."
            >
              <svg
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="iconFill"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.50002 12C3.50002 7.30558 7.3056 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C10.3278 20.5 8.77127 20.0182 7.45798 19.1861C7.21357 19.0313 6.91408 18.9899 6.63684 19.0726L3.75769 19.9319L4.84173 17.3953C4.96986 17.0955 4.94379 16.7521 4.77187 16.4751C3.9657 15.176 3.50002 13.6439 3.50002 12ZM12 1.5C6.20103 1.5 1.50002 6.20101 1.50002 12C1.50002 13.8381 1.97316 15.5683 2.80465 17.0727L1.08047 21.107C0.928048 21.4637 0.99561 21.8763 1.25382 22.1657C1.51203 22.4552 1.91432 22.5692 2.28599 22.4582L6.78541 21.1155C8.32245 21.9965 10.1037 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5ZM14.2925 14.1824L12.9783 15.1081C12.3628 14.7575 11.6823 14.2681 10.9997 13.5855C10.2901 12.8759 9.76402 12.1433 9.37612 11.4713L10.2113 10.7624C10.5697 10.4582 10.6678 9.94533 10.447 9.53028L9.38284 7.53028C9.23954 7.26097 8.98116 7.0718 8.68115 7.01654C8.38113 6.96129 8.07231 7.046 7.84247 7.24659L7.52696 7.52195C6.76823 8.18414 6.3195 9.2723 6.69141 10.3741C7.07698 11.5163 7.89983 13.314 9.58552 14.9997C11.3991 16.8133 13.2413 17.5275 14.3186 17.8049C15.1866 18.0283 16.008 17.7288 16.5868 17.2572L17.1783 16.7752C17.4313 16.5691 17.5678 16.2524 17.544 15.9269C17.5201 15.6014 17.3389 15.308 17.0585 15.1409L15.3802 14.1409C15.0412 13.939 14.6152 13.9552 14.2925 14.1824Z"
                  fill="#000000"
                />
              </svg>
              Reserva
            </a>
          </li>
        </ul>
        <label for="navButton" class="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </label>
      </nav>
      <a
        class="contact button"
        href="https://wa.me/${whatsapp}?text=Hola%20Lucas%20Pinto,%20me%20comunico%20contigo%20a%20través%20de%20tu%20página%20web%20(https://lsbturismo.com)%20Me%20gustaría%20tener%20más%20información%20sobre%20tus%20servicios."
        target="_blank"
      >
        Reserva tu viaje
        <svg
          width="1.5rem"
          height="1.5rem"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.50002 12C3.50002 7.30558 7.3056 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C10.3278 20.5 8.77127 20.0182 7.45798 19.1861C7.21357 19.0313 6.91408 18.9899 6.63684 19.0726L3.75769 19.9319L4.84173 17.3953C4.96986 17.0955 4.94379 16.7521 4.77187 16.4751C3.9657 15.176 3.50002 13.6439 3.50002 12ZM12 1.5C6.20103 1.5 1.50002 6.20101 1.50002 12C1.50002 13.8381 1.97316 15.5683 2.80465 17.0727L1.08047 21.107C0.928048 21.4637 0.99561 21.8763 1.25382 22.1657C1.51203 22.4552 1.91432 22.5692 2.28599 22.4582L6.78541 21.1155C8.32245 21.9965 10.1037 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5ZM14.2925 14.1824L12.9783 15.1081C12.3628 14.7575 11.6823 14.2681 10.9997 13.5855C10.2901 12.8759 9.76402 12.1433 9.37612 11.4713L10.2113 10.7624C10.5697 10.4582 10.6678 9.94533 10.447 9.53028L9.38284 7.53028C9.23954 7.26097 8.98116 7.0718 8.68115 7.01654C8.38113 6.96129 8.07231 7.046 7.84247 7.24659L7.52696 7.52195C6.76823 8.18414 6.3195 9.2723 6.69141 10.3741C7.07698 11.5163 7.89983 13.314 9.58552 14.9997C11.3991 16.8133 13.2413 17.5275 14.3186 17.8049C15.1866 18.0283 16.008 17.7288 16.5868 17.2572L17.1783 16.7752C17.4313 16.5691 17.5678 16.2524 17.544 15.9269C17.5201 15.6014 17.3389 15.308 17.0585 15.1409L15.3802 14.1409C15.0412 13.939 14.6152 13.9552 14.2925 14.1824Z"
            fill="#fff"
          />
        </svg>
      </a>
      <img class="logo" src=${logoTransparent} />
    </header>
    <main>
      <div class="hero" style="background-image: url(${heroImg}))"></div>
      <section class="intro">
        <h1 class="title">Descubre la Magia de Iguazú</h1>
        <p class="subtitle">¡Explora los Tres Lados de la Maravilla!</p>
        <p>
          Bienvenidos a ${brandName}, su guía experta en traslados personalizados
          de alta calidad. Nuestro objetivo es brindarle una experiencia
          inolvidable en los puntos turísticos más emblemáticos de la región.
          <br /><br />
          Te ofrecemos una experiencia única para explorar las maravillas de las
          Cataratas del Iguazú y sus alrededores. Nuestro compromiso es
          brindarte un servicio de transporte seguro, cómodo y confiable,
          adaptado a tus necesidades, ya sea que viajes solo, en pareja, o en
          grupo.
        </p>
      </section>
      <section class="services" id="servicios">
        <h2 class="title">Servicios</h2>
        <div class="cards">
          ${servicesRendered}
        </div>
      </section>
      <section id="galería" class="gallery">
        <h2 class="title title-2">Galería</h2>
        <div class="gallery-container">
          ${galleryRendered("Cataratas del Iguazú")}
          <p class="place"></p>
          <div class="controls">
            <button class="arrow prev" onclick="changeImage(-1)">
              &#10094;
            </button>
            <div class="dots">
        ${dots("Cataratas del Iguazú")}
            </div>
            <button class="arrow next" onclick="changeImage(1)">
              &#10095;
            </button>
          </div>
        </div>
        <h2 class="title title-2">Brasil</h2>
        <div class="gallery-container">
        ${galleryRendered("Brasil")}
          <p class="place"></p>
          <div class="controls">
            <button class="arrow prev" onclick="changeImage(-1)">
              &#10094;
            </button>
            <div class="dots">
              ${dots("Brasil")}
            </div>
            <button class="arrow next" onclick="changeImage(1)">
              &#10095;
            </button>
          </div>
        </div>
        <h2 class="title title-2">Argentina</h2>
        <div class="gallery-container">
           ${galleryRendered("Argentina")}
          <p class="place"></p>
          <div class="controls">
            <button class="arrow prev" onclick="changeImage(-1)">
              &#10094;
            </button>
            <div class="dots">
            ${dots("Argentina")}
            </div>
            <button class="arrow next" onclick="changeImage(1)">
              &#10095;
            </button>
          </div>
        </div>
        <h2 class="title title-2">Paraguay</h2>
        <div class="gallery-container">
           ${galleryRendered("Paraguay")}
          <p class="place"></p>
          <div class="controls">
            <button class="arrow prev" onclick="changeImage(-1)">
              &#10094;
            </button>
            <div class="dots">
            ${dots("Paraguay")}
            </div>
            <button class="arrow next" onclick="changeImage(1)">
              &#10095;
            </button>
          </div>
        </div>
        <h2 class="title title-2">Nuestros Coches</h2>
        <div class="gallery-container">
        ${galleryRendered("Nuestros Coches")}
          <p class="place"></p>
          <div class="controls">
            <button class="arrow prev" onclick="changeImage(-1)">
              &#10094;
            </button>
            <div class="dots">
        ${dots("Nuestros Coches")}
            </div>
            <button class="arrow next" onclick="changeImage(1)">
              &#10095;
            </button>
          </div>
        </div>
      </section>
      <section class="contactSection">
        <h3 class="title">Reservas y Contacto*</h3>
        <br /><br />
        <p>Teléfono:</p>
        <h4>
          <a
            href="https://wa.me/${whatsapp}?text=Hola%20Lucas%20Pinto,%20me%20comunico%20contigo%20a%20través%20de%20tu%20página%20web%20(https://lsbturismo.com)%20Me%20gustaría%20tener%20más%20información%20sobre%20tus%20servicios."
            target="_blank"
            >+${whatsapp}</a
          >
        </h4>
        <p>Correo electrónico:</p>
        <h4>${email}</h4>
        <p>Sitio web:</p>
        <h4>lsbturismo.com</h4>
        <br /><br />
        <h4>¡Ven y Descubre la Magia de Iguazú con ${brandName}!</h4>
      </section>
      <footer>
        <img class="logo" src=${logoTransparent} alt="${brandName}" />
        <p>
          Sitio web creado por
          <a
            class="link"
            href="https://wdiseñoweb.com"
            rel="noopener noreferrer"
            target="_blank"
            >W Diseño Web</a
          >
        </p>
      </footer>
    </main>
    <script src="index.js"></script>
  </body>
</html>

  `;

  fs.writeFileSync(`./index.html`, htmlContent);
};
const fetchData = async () => {
  try {
    const response = await fetch(
      `https://${studioId}.api.sanity.io/v2021-10-21/data/query/${studioDataset}?query=${encodeURIComponent(
        `*[_type == "brand" || _type == "services" || _type == "excursion" || _type == "gallery"] | order(_createdAt asc)`
      )}`
    );
    const data = await response.json();
    generateHtml(data.result);
  } catch (error) {
    console.error("Error fetching data from Sanity:", error);
    return;
  }
};
fetchData();
