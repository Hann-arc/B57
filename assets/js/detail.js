window.onload = function () {
  let projectData = JSON.parse(localStorage.getItem("projectData"));

  if (projectData) {
    let startDate = new Date(projectData.startDate);
    let endDate = new Date(projectData.endDate);

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
    projectData.techList.forEach((tech) => {
      switch (tech) {
        case "NodeJs":
          techIcons +=
            '<div class="container-detail-logo"><i class="fa-brands fa-node-js fa-xl"><p>Node Js</p></i></div>';
          break;
        case "Laravel":
          techIcons +=
            '<div class="container-detail-logo"><i class="fa-brands fa-laravel fa-xl"><p>Laravel</p></i></div>';
          break;
        case "ReactJs":
          techIcons +=
            '<div class="container-detail-logo"><i class="fa-brands fa-react fa-xl"><p>React Js</p></i></div>';
          break;
        case "JavaScript":
          techIcons +=
            '<div class="container-detail-logo"><i class="fa-brands fa-js fa-xl"><p>Javascript</p></i></div>';
          break;
      }
    });
    let detailProject = `<h1 class="detail-title">${projectData.projectName}</h1>
      <div class="detail-container">
        <div class="first-container">
          <div class="detail-img"><img src="${projectData.image}" /></div>
          <div class="detail-other">
            <div class="detail-duration">
              <h2>Duration :</h2>
              <div class="container-detail-duration">
                <i class="fa-solid fa-calculator fa-xl">
                  <p>${formatDateISO(startDate)} - ${formatDateISO(endDate)}</p>
                </i>
                <i class="fa-regular fa-clock fa-xl">
                  <p>${durationText}</p>
                </i>
              </div>
            </div>
            <div class="detail-logo">
              <h2>Technologies :</h2>
              <div class="container-detail-logo">${techIcons}</div>
            </div>
          </div>
        </div>
        <div class="second-container">
          <p>${projectData.message}</p>
        </div>
      </div>
    </div>`;


    document.getElementById('detail-Project').insertAdjacentHTML('beforeend', detailProject);
    
  }
};
