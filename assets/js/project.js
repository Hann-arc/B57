flatpickr("#label-start-date", {
  dateFormat: "Y-m-d",
});
flatpickr("#label-end-date", {
  dateFormat: "Y-m-d",
});

function addBlog(event) {
  event.preventDefault();

  let projectName = document.getElementById("blog-name").value;
  let startDate = new Date(document.getElementById("label-start-date").value);
  let endDate = new Date(document.getElementById("label-end-date").value);
  let message = document.getElementById("message").value;

  let techIcons = "";
  let techList = [];
  let techs = document.querySelectorAll('input[name="tech"]:checked');

  techs.forEach((tech) => {
    techList.push(tech.value);
    switch (tech.value) {
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

  const inputImage = document.getElementById("file-upload").files;
  const blobImage = URL.createObjectURL(inputImage[0]);
  let image = blobImage;
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

  let truncatedMessage = message.length > 100 ? message.substring(0, 100) + "..." : message;
  let projectCard = `<div class="card">
          <img src="${image}" />
          <div class="card-detail">
            <h2><a href="/detail.html" style="text-decoration: none; color: black;" target="_blank">${projectName}</a></h2>
            <p class="duration">Durasi: ${durationText}</p>
            <p>${truncatedMessage}</p>
            ${techIcons}
            <div class="buttons">
              <a href="detail.html" class="btna" id="visit-link"></a
              ><button class="edit" onclick="visitProject(this)">Edit</button>
              <button class="delete" onclick="deleteProject(this)">Delete</button>
            </div>
          </div>
        </div>`;
        
        
        
  document.getElementById("projects-container").insertAdjacentHTML("afterbegin", projectCard);


  localStorage.setItem('projectData', JSON.stringify({
    projectName,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    message,
    image,
    techList
}));

  document.querySelector("form").reset();
}

function deleteProject(button) {
  const card = button.closest('.card');
    card.remove();
  
}

