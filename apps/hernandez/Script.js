    const worksData = [
      {
        id: 1,
        title: "Mga Ibong Mandaragit",
        image: "Images/Ibon.jpg",
        year: "1969",
        tag: "Nobela",
        fullDesc: "Isinulat habang nakakulong si Hernandez, ang 'Mga Ibong Mandaragit' ay nagsisilbing kasunod ng mga nobela ni José Rizal. Tinatalakay nito ang pakikibaka ng mga magsasaka at manggagawa laban sa mga makapangyarihang may-ari ng lupa at dayuhang impluwensya."
      },
      {
        id: 2,
        title: "Mga Ibong Mandaragit (Penguin Edition)",
        image: "Images/birds.jpg",
        year: "1969 / Classics",
        tag: "Nobela / Salin",
        fullDesc: "Inilabas ng Penguin Classics upang maipakilala ang mahusay na akda ni Hernandez sa pandaigdigang mambabasa, na nagpapakita ng aktibismong panlipunan at pambansang kamalayan."
      },
      {
        id: 3,
        title: "Luha ng Buwaya",
        image: "Images/Luha.jpg",
        year: "1962",
        tag: "Nobela",
        fullDesc: "Nakasentro sa mga mahihirap na magsasakang nagkaisa upang itatag ang isang unyon at ipaglaban ang kanilang karapatan laban sa mga mangingikil at mapagkait na may-ari ng lupa."
      },
      {
        id: 4,
        title: "Isang Dipang Langit",
        image: "Images/Langit.jpg",
        year: "1961",
        tag: "Koleksyon ng Tula",
        fullDesc: "Binuo habang siya ay nakakulong sa selda, inilalarawan ng 'Isang Dipang Langit' ang dusa ng pagkakait ng kalayaan at ang hindi magagapi na espiritu ng tao."
      },
      {
        id: 5,
        title: "Bayang Malaya",
        image: "Images/Bayan.jpg",
        year: "1969",
        tag: "Epikong Tula",
        fullDesc: "Isang pampanitikang epiko na naglalahad sa makasaysayang pakikibaka ng mga magsasakang Pilipino, mga gerilya noong Ikalawang Digmaang Pandaigdig, at ang patuloy na laban para sa demokrasya."
      },
      {
        id: 6,
        title: "Magkabilang Mukha ng Isang Bagol",
        image: "Images/Bagol.jpg",
        year: "1960",
        tag: "Dula / Sanaysay",
        fullDesc: "Isang koleksyon ng mga dula at sanaysay na nagsusuri sa malaking agwat ng mayayaman at ng mga kapus-palad na manggagawa sa lipunan."
      },
      {
        id: 7,
        title: "Bullets and Roses",
        image: "Images/Bullets.jpg",
        year: "Bilingual Edition",
        tag: "Koleksyon ng Tula",
        fullDesc: "Naglalaman ng mga piling tula na nagpapakita ng dalawang mukha ng panulat ni Hernandez: ang radikal na paglaban ('bala') at ang pagmamahal sa bayan at manggagawa ('rosas')."
      },
      {
        id: 8,
        title: "Langaw sa Isang Basong Gatas",
        image: "Images/Langaw.jpg",
        year: "1996 Edition",
        tag: "Maikling Kuwento",
        fullDesc: "Koleksyon ng mga maikling kuwento na nagpapakita ng tahimik na pakikibaka, moral na suliranin, at katatagan ng mga ordinaryong mamamayan sa Maynila pagkatapos ng digmaan."
      },
      {
        id: 9,
        title: "Rice Grains",
        image: "Images/Rice.jpg",
        year: "1966 Edition",
        tag: "Piling Tula",
        fullDesc: "Isang internasyonal na salin ng kanyang mga tula upang maibahagi ang kanyang mensahe ng paglaban sa kolonyalismo at pagsuporta sa mga manggagawa sa buong mundo."
      },
      {
        id: 10,
        title: "Tudla at Tudling",
        image: "Images/Tudla.jpg",
        year: "Centennial Edition",
        tag: "Koleksyon ng Tula",
        fullDesc: "Inilimbag ng UP Press, kinokolekta ng antolohiyang ito ang kanyang pinakamatalim na kolum sa pamamahayag at mga tulang panlipunan."
      }
    ];

    const worksGrid = document.getElementById('worksGrid');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModal = document.getElementById('closeModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalMeta = document.getElementById('modalMeta');
    const modalBody = document.getElementById('modalBody');

    function renderGallery() {
      worksGrid.innerHTML = '';

      worksData.forEach(work => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.innerHTML = `
          <div class="cover-wrapper">
            <img src="${work.image}" alt="${work.title}">
            <div class="gallery-overlay">Tingnan ang Detalye</div>
          </div>
          <div class="card-info">
            <div class="work-title">${work.title}</div>
            <div class="click-more">Magbasa pa &rarr;</div>
          </div>
        `;
        card.addEventListener('click', () => openModal(work));
        worksGrid.appendChild(card);
      });
    }

    function openModal(work) {
      modalImg.src = work.image;
      modalImg.alt = work.title;
      modalTitle.textContent = work.title;
      modalMeta.textContent = `${work.tag} • ${work.year}`;
      modalBody.textContent = work.fullDesc;
      modalOverlay.classList.add('active');
    }

    closeModal.addEventListener('click', () => modalOverlay.classList.remove('active'));

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });

    renderGallery();