const hueColors = [
  '#FFD700', // Dorado brillante
  '#1E90FF', // Azul intenso
  '#32CD32', // Verde lima
  '#FF4500', // Naranja rojizo
  '#8A2BE2', // Azul violeta
  '#FF69B4', // Rosa fuerte
  '#00CED1', // Turquesa oscuro
  '#FF6347', // Tomate
  '#6A5ACD', // Azul pizarra medio
  '#40E0D0' // Turquesa
];

let counterDvd = 0;

const randomY = () => 200 + ~~(Math.random() * (window.innerHeight - 400));
const randomX = () => 200 + ~~(Math.random() * (window.innerWidth - 400));

class dvdScreenSaver extends HTMLElement {
  constructor() {
    super();
    this.x = randomX();
    this.y = randomY();
    this.indexColor = 0;
    this.width = Number(this.getAttribute('width'));
    this.height = Number(this.getAttribute('height'));
    this.movement = this.movement.bind(this);
    this.growX = 5;
    this.growY = 5;
    this.srcImage = this.getAttribute('srcImage');
    this.attachShadow({ mode: 'open' });
  }

  get style() {
    return `
      :host {
        display: block;
        position: absolute;
        aspect-ratio: 320 / 150;
        width: ${this.width}px;
        height: ${this.height}px;
        background-color: ${hueColors[this.indexColor]};
        display: flex;
        flex-wrap: wrap;
        place-content: center;
        transform-origin: 0% 0%;
        transition: filter .5s ease;
        transform: translate(${this.x}px,${this.y}px);
      }

      img {
        width: 150px;
        height: 70px;
      }
    `;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${this.style}</style>
      <img src=${this.srcImage} alt="Image T">
    `;
  }

  upgradeIndexColor() {
    this.indexColor = (this.indexColor + 1) % hueColors.length;
  }

  detectCollision() {
    const { width: htmlWidth, height: htmlHeight } =
      document.documentElement.getBoundingClientRect();

    if (this.x + this.width - 10 > htmlWidth) {
      this.x = randomX();
      this.y = randomY();
    }
    if (this.y + this.height - 10 > htmlHeight) {
      this.x = randomX();
      this.y = randomY();
    }

    const pad = 0;
    const rightBottomPad = 10;
    let leftTopBounce = this.x === pad && this.y === pad;

    let rightTopBounce =
      this.y === pad && this.x === htmlWidth - this.width - pad;

    let leftBottomBounce =
      this.x <= pad && this.y >= htmlHeight - this.height - pad;

    let rightBottomBounce =
      this.x + this.width >= htmlWidth - rightBottomPad &&
      this.y + this.height >= htmlHeight - rightBottomPad;

    if (
      leftTopBounce ||
      rightTopBounce ||
      leftBottomBounce ||
      rightBottomBounce
    ) {
      if (counterDvd < 10) {
        let newDvd = document.createElement('dvd-screensaver');
        newDvd.width = this.width;
        newDvd.height = this.height;
        newDvd.srcImage = this.srcImage;
        document.body.appendChild(newDvd);
      }
      counterDvd++;
    }

    if (this.x > htmlWidth - this.width) {
      this.growX = -this.growX;
      this.upgradeIndexColor();
    }

    if (this.x < 0) {
      this.growX = -this.growX;
      this.upgradeIndexColor();
    }
    if (this.y > htmlHeight - this.height) {
      this.growY = -this.growY;
      this.upgradeIndexColor();
    }

    if (this.y < 0) {
      this.growY = -this.growY;
      this.upgradeIndexColor();
    }
  }

  movement() {
    this.x += this.growX;
    this.y += this.growY;
    this.detectCollision();

    this.render();
    requestAnimationFrame(this.movement);
  }

  connectedCallback() {
    this.render();
    this.movement();
  }
}

customElements.define('dvd-screensaver', dvdScreenSaver);

/* ======================= MEDIA  ======================= */

let w = window;

let currentOrientation = screen.orientation.type;

function handleOrientationChange() {
  const newOrientation = screen.orientation.type;

  if (
    newOrientation.startsWith('portrait') &&
    !currentOrientation.startsWith('portrait')
  ) {
    currentOrientation = newOrientation;
    location.reload();
  } else if (
    newOrientation.startsWith('landscape') &&
    !currentOrientation.startsWith('landscape')
  ) {
    currentOrientation = newOrientation;
    location.reload();
  }
}

screen.orientation.addEventListener('change', handleOrientationChange);

handleOrientationChange();
