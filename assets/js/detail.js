window.onload = function() {
  const projects = JSON.parse(localStorage.getItem('projectDataList')) || [];

  // Ambil ID dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  // Pastikan ID valid dan proyek ada
  if (projects.length > 0 && projectId < projects.length) {
    const project = projects[projectId]; // Ambil proyek berdasarkan ID

    let startDate = new Date(project.startDate);
    let endDate = new Date(project.endDate);

    let timeDifference = endDate - startDate;
    let dayDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    let yearDifference = endDate.getFullYear() - startDate.getFullYear();
    let monthDifference = endDate.getMonth() - startDate.getMonth();
    let remainingDays = endDate.getDate() - startDate.getDate();

    if (remainingDays < 0) {
      monthDifference--;
      const daysInLastMonth = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        0
      ).getDate();
      remainingDays += daysInLastMonth;
    }

    if (monthDifference < 0) {
      yearDifference--;
      monthDifference += 12;
    }

    let durationText = "";

    if (yearDifference > 0) {
      durationText += `${yearDifference} tahun `;
    }
    if (monthDifference > 0) {
      durationText += `${monthDifference} bulan `;
    }
    if (remainingDays > 0) {
      durationText += `${remainingDays} hari`;
    }

    if (!durationText) {
      durationText = "0 hari";
    }

    function formatDateISO(date) {
      return date.toISOString().split("T")[0];
    }

    let techIcons = '';
    project.techList.forEach((tech) => {
      switch (tech) {
        case "NodeJs":
          techIcons +=
            '<div class="col-6 d-flex align-items-center"><i class="fa-brands fa-node-js fa-xl me-2"></i><p class="mb-0">Node Js</p></div>';
          break;
        case "Laravel":
          techIcons +=
            '<div class="col-6 d-flex align-items-center"><i class="fa-brands fa-laravel fa-xl me-2"></i><p class="mb-0">Laravel</p></div>';
          break;
        case "ReactJs":
          techIcons +=
            '<div class="col-6 d-flex align-items-center"><i class="fa-brands fa-react fa-xl me-2"></i><p class="mb-0">React Js</p></div>';
          break;
        case "JavaScript":
          techIcons +=
            '<div class="col-6 d-flex align-items-center"><i class="fa-brands fa-js fa-xl me-2"></i><p class="mb-0">JavaScript</p></div>';
          break;
      }
    });

    let detailProject = ` <h1 style="text-align: center; margin-top: 25px;">${project.projectName}</h1>
      <div class="container mt-5">
        <div class="row">
          <div class="col-lg-7 col-md-8 col-sm-12 mb-3">
            <img src="${project.image}" class="img-fluid" alt="" style="max-height: 500px; object-fit: cover; width: 100%;">
          </div>
          <div class="col-lg-5 col-md-4 col-sm-12">
            <div class="d-flex flex-column mb-3">
              <h4>Duration :</h4>
              <div class="p-2">
                <div class="d-flex flex-row align-items-center mb-3">
                  <i class="fa-solid fa-calculator fa-xl me-2"></i>
                  <p class="mb-0">${formatDateISO(startDate)} - ${formatDateISO(endDate)}</p>
                </div>
              </div>
              <div class="p-2">
                <div class="d-flex flex-row align-items-center mb-3">
                  <i class="fa-regular fa-clock fa-xl me-2"></i>
                  <p class="mb-0">${durationText}</p>
                </div>
              </div>
            </div>
      
            <div class="container">
              <h4 style="text-align: start;">Technologies:</h4>
              <div class="row">
              ${techIcons}
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <p class="mt-4">${project.message}</p>
          </div>
        </div>
      </div>`;

    document.getElementById('detail-Project').insertAdjacentHTML('beforeend', detailProject);
    
  } else {
    console.log("Project not found");
  }
};
