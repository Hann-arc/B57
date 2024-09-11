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

  let truncatedMessage =
    message.length > 100 ? message.substring(0, 100) + "..." : message;

  const inputImage = document.getElementById("file-upload").files;

  if (inputImage.length > 0) {
    const reader = new FileReader();
    reader.readAsDataURL(inputImage[0]);

    reader.onloadend = function () {
      const image = reader.result; 

      const projectData = {
        projectName,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        message,
        image, 
        truncatedMessage,
        techList,
      };

      let existingProjects = JSON.parse(localStorage.getItem('projectDataList')) || [];
      existingProjects.push(projectData);
      localStorage.setItem('projectDataList', JSON.stringify(existingProjects));

      console.log({
        "nama": projectName,
        "gambar": image,
        "durasi": durationText,
        "deskripsi": message,
        "techIcone": techList,
        "start date": startDate,
        "endDate": endDate,
      });

      
      document.querySelector("form").reset();
    };
  } else {
    console.log("No file uploaded");
  }
}
