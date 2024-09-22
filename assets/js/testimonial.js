async function fetchUrl(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }


async function allTestimonial(){
    try {
        const testimonials = await fetchUrl(
            "https://api.npoint.io/500e7d290c182450b120"
        );
    
    const testimonialHTML = testimonials.map((testimonial) => {
        return `<div data-aos="zoom-in" data-aos-delay="500" class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card h-100 mx-auto mx-lg-0" style="max-width: 18rem;">
              <img src="${testimonial.image}" class="card-img-top" style="width: 100%; height: 200px; object-fit: cover;  alt="...">
              <div class="card-body">
                <p class="card-text">${testimonial.content}</p>
                <h5 class="text-end">- ${testimonial.author}</h5>
                <div class="d-flex justify-content-end">
                  <div class="p-2">
                    <span class="rating-text">${testimonial.rating}</span>
                    <i class="fa-regular fa-star" style="font-weight: bold;"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>`
    });

    document.getElementById("container-card").innerHTML = testimonialHTML.join(" ");
} catch (error) {
    alert (error);
}
};


async function filterTesti(rating){
    try {
        const testimonials = await fetchUrl(
            "https://api.npoint.io/500e7d290c182450b120"
        );
    const filterTestimonials = testimonials.filter((testimonial) => {
        return testimonial.rating == rating
    });

    testimonialHTML = filterTestimonials.map((testimonial) => {
        return `<div data-aos="zoom-in" data-aos-delay="500" class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card h-100 mx-auto mx-lg-0" style="max-width: 18rem;">
              <img src="${testimonial.image}" class="card-img-top" style="width: 100%; height: 200px; object-fit: cover; alt="...">
              <div class="card-body">
                <p class="card-text">${testimonial.content}</p>
                <h5 class="text-end">- ${testimonial.author}</h5>
                <div class="d-flex justify-content-end">
                  <div class="p-2">
                    <span class="rating-text">${testimonial.rating}</span>
                    <i class="fa-regular fa-star" style="font-weight: bold;"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>`
    });
    document.getElementById("container-card").innerHTML = testimonialHTML.join(" ");
    }
    catch(error){
        alert (error)
    }
}


allTestimonial();