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

    let detailProject = ` `;

    document.getElementById('detail-Project').insertAdjacentHTML('beforeend', detailProject);
    
  } else {
    console.log("Project not found");
  }
};
