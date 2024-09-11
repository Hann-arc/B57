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

      const projectCard = `<div class="card h-100 mx-5" style="width: 20rem; margin-top: 20px;">
            <img
              src="${project.image}"
              style="width: 100%; height: 200px; object-fit: cover;"
              class="card-img-top"
              alt="..."
            />
            <div class="card-body">
              <h5 class="card-title"><a href="/detail.html?id=${index}" style="text-decoration: none; color: black;" target="_blank">${project.projectName}</a></h5>
              <p class="card-text" style="color: grey;">Duration : ${durationText}</p>
              <p class="card-text">
                ${project.truncatedMessage}
              </p>
              ${techIcons}
              <div
                class="d-flex justify-content-around"
                style="align-items: center; margin-top: 20px"
              >
                <a href="#" class="btn btn-dark btn-sm pb-1 pt-1 ps-4 pe-4"
                  >Edit</a
                >
                <a href="#" class="btn btn-dark btn-sm pb-1 pt-1 ps-4 pe-4"
                onclick="deleteProject(${index}, this)">Delete</a
                >
              </div>
            </div>
          </div>`;

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