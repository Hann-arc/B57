const express = require("express");
const app = express();
const port = 3000;
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");


const blogModel = require("./models").Projects;
const userModel = require("./models").User;

hbs.registerHelper('includes', function(array, value) {
  return array && array.includes(value);
});

app.set("view engine", "hbs");
app.set("views", "views");
app.use("/assets", express.static("assets"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  name: "my-session",
  secret: "DxId5OKMRL",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge : 1000 * 60 * 60 * 24
  }
}))
app.use(flash())

app.get('/home', renderHome);
app.get('/auth/login', renderLogin);
app.get('/auth/register', renderRegister);
app.get('/testimonials', renderTestimonials);
app.get('/contact', renderContact);
app.get('/myproject', renderMyproject);
app.get('/detail/:id', renderDetail);
app.post('/auth/login', login);
app.post('/auth/register', register);
app.post('/update-blog/:id', updatedBlog);
app.post('/myproject', addBlog);
app.get('/edit-blog/:id', renderUpdate)
app.get('/delete-blog/:id', deleteBlog)

app.get('/blog', (req, res) => {
    res.render("blog",);
}); // Day 1   

function renderRegister(req, res){
  res.render("register");
}

async function register(req, res){

  try  {
  const { name, email, password } = req.body;

  const saltRounds = 10;

  const hashedPassword =  await bcrypt.hash(password, saltRounds);

  await userModel.create({
    name: name,
    email: email,
    password: hashedPassword
  });
  req.flash("sukses", "Register berhasil brok silahkan login!")
  res.redirect("/auth/register")
  }
  catch(error){
    req.flash("error", "Register gagal brok coba lagi ya")
    res.redirect("/auth/register")
  }
  
}
async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({
    where: {
      email: email
    }
  });

  if (!user) {
    res.status(404).send('email salah');
    return;
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    res.status(404).send('password salah');
    return;
  }

  req.session.user = user;

  res.redirect("/home")
}

function renderLogin(req, res){
  res.render("login");
}



function coutDays(start_date, end_date){
      let start = new Date(start_date);
      let end = new Date(end_date);

      let timeDifference = end - start;
      let dayDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
      let yearDifference = end.getFullYear() - start.getFullYear();
      let monthDifference = end.getMonth() - start.getMonth();
      let remainingDays = end.getDate() - start.getDate();

      if (remainingDays < 0) {
        monthDifference--;
        const daysInLastMonth = new Date(
          end.getFullYear(),
          end.getMonth(),
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

      return durationText;

    }

function techI(tech){
    let techIcons = '';
    tech.forEach(techIcon => {
        switch (techIcon) {
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

      return techIcons;
    }

    function detalTch(detIcon, techIcons) {
      let detIcones = '';
      detIcon.forEach(detIcone => {
          if (techIcons.includes(detIcone)) {
              switch (detIcone) {
                  case 'NodeJs':
                      detIcones += '<div class="col-6 d-flex align-items-center"><i class="fa-brands fa-node-js fa-xl me-2"></i><p class="mb-0">Node Js</p></div>';
                      break;
                  case 'Laravel':
                      detIcones += '<div class="col-6 d-flex align-items-center"><i class="fa-brands fa-laravel fa-xl me-2"></i><p class="mb-0">Laravel</p></div>';
                      break;
                  case 'ReactJs':
                      detIcones += '<div class="col-6 d-flex align-items-center"><i class="fa-brands fa-react fa-xl me-2"></i><p class="mb-0">React Js</p></div>';
                      break;
                  case 'JavaScript':
                      detIcones += '<div class="col-6 d-flex align-items-center"><i class="fa-brands fa-js fa-xl me-2"></i><p class="mb-0">JavaScript</p></div>';
                      break;
              }
          }
      });
      return detIcones;
  }
    async function deleteBlog(req, res) {
      
      const { id } = req.params;
   
      let result = await blogModel.findOne({
        where: {
          id : id,
        }
      }) 
        
        if (!result) {
          res.status(404).send('Blog not found');
         return   
        }
          await blogModel.destroy({
            where: {
              id : id,
            }
          })

          res.redirect("/home")
        
    };


async function renderUpdate(req, res) {
        const { id } = req.params
        
        const result = await blogModel.findOne({
          where: {
            id : id
          }
        })
 
    
        if (!result) {
          res.status(404).send('Blog not found');
            
        } else {
          res.render('update', { blog: result});
        }
    };
    
    async function addBlog(req, res) {
      let { name, description, tech, start_date, end_date } = req.body;
    
      if (typeof tech === 'string') {
        tech = [tech];
      }
      if (!tech || tech.length === 0 || tech[0] === "") {
        tech = [" "]; 
      }
    
      try {
        await blogModel.create({
          name: name,
          image: 'https://nano-manga.com/wp-content/uploads/2023/04/Top-Tier-Providence-Secretly-Cultivate-for-a-Thousand-Years.png',
          start_date: start_date,
          end_date: end_date, 
          description: description,
          tech: tech 
        });
    
        res.redirect("/home");
      } catch (error) {
        console.error('Error adding blog:', error);
        res.status(500).send('Internal Server Error');
      }
    }
    
    
 
async function renderHome(req, res){
  const result = await blogModel.findAll()
 

  const blogsWithTech = result.map(blog => {

    const blogData = blog.get();
    const truncatedMessage =
      blog.description.length > 100
        ? blog.description.substring(0, 100) + "..."
        : blog.description;


    return {
      ...blogData,
      truncatedMessage,
      techIcons: techI(blog.tech),
      resultCoutDays : coutDays(blog.start_date, blog.end_date)
    };
    
  });


  res.render("index", { blogs: blogsWithTech });
};
 function renderTestimonials(req, res){

    res.render("testimonials")
};

function renderContact(req, res){
    res.render("contact");
};

function renderMyproject(req, res){
    res.render("myproject");
};

async function renderDetail(req, res) {
  const { id } = req.params;

  const result = await blogModel.findOne({
    where: {
      id : id
    }
  });
 
  if (result) {
    const blogData = result.get();
    const techArray = [
          'NodeJs',
          'Laravel',
          'ReactJs',
          'JavaScript'
      ];

      const techs = blogData.tech || [];
      const extractedTechs = techArray.filter(tech => techs.includes(tech));
      const formattedDetArray = detalTch(extractedTechs, techArray);
      const resultCoutDays = coutDays(blogData.start_date, blogData.end_date);
    
      res.render("detail", {
        blogData,
        formattedDetArray,
        resultCoutDays
      })  
  } else {
      res.status(404).send('ga ada brokk');
  }
}


async function updatedBlog(req, res){
  const { id } =  req.params;
  let { name, description, tech, start_date, end_date } = req.body;
  const result = await blogModel.findOne({
    where: {
      id : id,
    }
  })

  if (typeof tech === 'string') {
    tech = [tech];
  }
  if (!tech || tech.length === 0 || tech[0] === "") {
    tech = [" "]; 
  }

  if (!result) {
    res.status(404).send('Blog not found');
    return
  } 
  result.name = name;
  result.description = description;
  result.tech = tech;
  result.start_date = start_date;
  result.end_date = end_date;

  await result.save()
  res.redirect("/home");
  
}
;



app.listen(port, () => {
    console.log(`Berjalan di port ${port}`)
})

