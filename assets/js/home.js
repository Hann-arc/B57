window.onload = function() {
  const projectsContainer = document.getElementById('projects-container');
  const projects = JSON.parse(localStorage.getItem('projectDataList')) || [];

  if (projects.length > 0) {
    projects.forEach((project, index) => {
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

      let techIcons = '';
      // Cek apakah techList ada dan merupakan array
      if (Array.isArray(project.techList)) {
        project.techList.forEach((tech) => {
          switch (tech) {
            case "NodeJs":
              techIcons += `<span class="span-logo">
                      <i class="fa-brands fa-node-js fa-xl"></i></span
                    >`;
              break;
            case "Laravel":
              techIcons += `<span class="span-logo"
                      ><i class="fa-brands fa-laravel fa-xl"></i></span
                    >`;
              break;
            case "ReactJs":
              techIcons += `<span class="span-logo"
                      ><i class="fa-brands fa-react fa-xl"></i></span
                    >`;
              break;
            case "JavaScript":
              techIcons += `<span
                      class="span-logo"
                      ><i class="fa-brands fa-js fa-xl"></i></span
                    >`;
              break;
          }
        });
      }

      const projectCard = ``;

      projectsContainer.insertAdjacentHTML("beforeend", projectCard);
    });
  } else {
    console.log("No projects available");
  }
};

function deleteProject(index, button) {
 
  let projects = JSON.parse(localStorage.getItem("projectDataList")) || [];
  projects.splice(index, 1);
  localStorage.setItem("projectDataList", JSON.stringify(projects));

  const card = button.closest(".card");
  card.remove();


  if (projects.length === 0) {
    document.getElementById("projects-container").innerHTML = "";
    console.log("No projects available");
  }
}