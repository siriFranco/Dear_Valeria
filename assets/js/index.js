document.addEventListener('DOMContentLoaded', () => {
  const mailbox = document.querySelector('.mailbox');
  const dialogue = document.querySelector('.dialogue');
  const dialogueText = document.querySelector('.dialogue-text');
  const menu = document.querySelector('.dialogue-menu');

  // 🎵 Sonidos
  const clickSound = new Audio('./assets/sounds/click.mp3');
  const openSound = new Audio('./assets/sounds/85.wav');
  const sadnessMusic = new Audio('./assets/sounds/Sadness_and_Happiness.mp3');
  sadnessMusic.loop = true; // que suene en bucle

  let chunks = [];
  let currentIndex = 0;
  let dialogueVisible = false;

  // Detectar tamaño del dispositivo
  const isMobile = window.innerWidth <= 768;
  const MAX_CHARS = isMobile ? 100 : 222;

  // 🧠 Divide texto en bloques (respetando saltos dobles)
  function splitTextIntoChunks(text, maxLength) {
    const paragraphs = text.split(/\n\s*\n/); // salto doble
    const result = [];

    for (let para of paragraphs) {
      para = para.trim();
      if (!para) continue;

      if (para.length <= maxLength) {
        result.push(para);
      } else {
        const words = para.split(/\s+/);
        let chunk = '';

        for (let word of words) {
          if ((chunk + ' ' + word).trim().length <= maxLength) {
            chunk += (chunk ? ' ' : '') + word;
          } else {
            result.push(chunk);
            chunk = word;
          }
        }
        if (chunk) result.push(chunk);
      }
    }

    return result;
  }

    // 🎯 Muestra siguiente fragmento del texto
    function showNextChunk() {
    // Si ya no hay más chunks, mostrar el menú en el siguiente clic
    if (currentIndex >= chunks.length) {
      // Detener música si era siria.txt
      if (!sadnessMusic.paused) {
        sadnessMusic.loop = false;
        sadnessMusic.pause();
        sadnessMusic.currentTime = 0;
      }

      // Mostrar puntos suspensivos como señal de fin
      dialogueText.textContent += '\n...';
      return;
    }

    // Mostrar siguiente bloque
    const content = chunks[currentIndex] + (currentIndex < chunks.length - 1 ? '\n...' : '');
    dialogueText.textContent = content;
    currentIndex++;

    // Reproducir sonido
    clickSound.currentTime = 0;
    clickSound.play();
  }




  // 📂 Carga un archivo y divide en bloques
  function loadTextFile(filename) {
    fetch(`./assets/data/${filename}`)
      .then(res => res.text())
      .then(text => {
        chunks = splitTextIntoChunks(text.trim(), MAX_CHARS);
        currentIndex = 0;

        showNextChunk();
        menu.classList.add('hidden');
        dialogueText.classList.remove('hidden');

        // 🎵 Control de música por nombre de archivo
        if (filename === 'siria.txt') {
          sadnessMusic.currentTime = 0;
          sadnessMusic.play();
        } else {
          sadnessMusic.pause();
          sadnessMusic.currentTime = 0;
        }
      })
      .catch(err => {
        console.error('Error al cargar el archivo:', err);
      });
  }

  // 🔁 Alterna visibilidad de todos los elementos
  function toggleDialogue() {
    dialogueVisible = !dialogueVisible;

    if (dialogueVisible) {
      openDialogue();
    } else {
      closeDialogue();
    }
  }

  function openDialogue() {
    dialogue.classList.remove('hidden');
    menu.classList.remove('hidden');
    dialogueText.classList.add('hidden');
    dialogueText.textContent = '';
    chunks = [];
    currentIndex = 0;
    openSound.play();
  }

  function closeDialogue() {
    dialogue.classList.add('hidden');
    menu.classList.add('hidden');
    dialogueText.classList.add('hidden');
    dialogueText.textContent = '';
    chunks = [];
    currentIndex = 0;
    openSound.play();

    // Detener música si estaba sonando
    if (!sadnessMusic.paused) {
      sadnessMusic.loop = false;
      sadnessMusic.pause();
      sadnessMusic.currentTime = 0;
    }
  }


  function showMenu() {
    // Detener música si estaba sonando
    if (!sadnessMusic.paused) {
      sadnessMusic.loop = false;
      sadnessMusic.pause();
      sadnessMusic.currentTime = 0;
    }

    dialogueText.classList.add('hidden');
    dialogueText.textContent = '';
    menu.classList.remove('hidden');
    chunks = [];
    currentIndex = 0;
  }


  function hideMenu() {
    menu.classList.add('hidden');
  }

  // 🎯 Listeners
  mailbox.addEventListener('click', toggleDialogue);

  document.querySelectorAll('.dialogue-menu div').forEach(option => {
    option.addEventListener('click', () => {
      const file = option.dataset.file;
      loadTextFile(file);
      clickSound.play();
    });
  });

  dialogueText.addEventListener('click', () => {
    if (currentIndex < chunks.length) {
      showNextChunk();
    } else {
      showMenu(); // ← Solo volver al menú cuando el usuario hace clic después del último fragmento
    }
  });
});
