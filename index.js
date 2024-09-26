const express = require("express");
const app = express();
const port = 3000;
const hbs = require("hbs");
const handlebars = require('hbs');
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const path = require('path');
const upload = require("./middleweres/upload-file");

const blogModel = require("./models").Projects;
const userModel = require("./models").User;

handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

hbs.registerHelper('includes', function(array, value) {
  return array && array.includes(value);
});

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.set("view engine", "hbs");
app.set("views", "views");
app.use('/uploads', express.static('uploads'));
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
app.get('/edit-profile', renderProfile);
app.post('/auth/login', login);
app.post('/auth/register', register);
app.post('/update-blog/:id', upload.single("image"), updatedBlog);
app.post('/myproject', upload.single("image"), addBlog);
app.get('/edit-blog/:id', renderUpdate)
app.get('/delete-blog/:id', deleteBlog)
app.post('/edit-profile/:id',upload.single("image"), editProfile)


app.get('/blog', (req, res) => {
    res.render("blog",);
}); // Day 1   

function renderRegister(req, res){
  res.render("register", { currentPath: req.path });
}

async function editProfile(req, res) {
  try {
    const { edit_name, edit_email, edit_password } = req.body;
    const { id } = req.params;
    const user = req.session.user;
    const image = req.file ? req.file.filename : null;

    const editProfile = await userModel.findOne({ where: { id: id } });

    if (!user) {
      return res.status(403).send("Please log in first!");
    }
    if (!editProfile) {
      return res.status(404).send("Account not found!");
    }

    if (edit_name) {
      editProfile.name = edit_name;
      req.session.user.name = edit_name;
    }

 
    if (edit_email && edit_email !== editProfile.email) {
      const existingEmail = await userModel.findOne({ where: { email: edit_email } });
      if (existingEmail) {
        req.flash("error-email-exist", "Cannot change email, email is already registered.");
        res.redirect("/edit-profile");
        return
      }
      editProfile.email = edit_email;
    }

    if (edit_password) {
      const saltRounds = 10;
      editProfile.password = await bcrypt.hash(edit_password, saltRounds);
    }

    if (image) {
      editProfile.image = image;
      req.session.user.image = image;
    }

    await editProfile.save();
    res.redirect("/edit-profile");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}


app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/home');
    }
    res.redirect('/auth/login');
  });
});  

function renderProfile(req, res) {
  const user = req.session.user;

  try {
    if (user) {
      res.render("profile", { user });
    } else {
      req.flash("error-edit-profile", "Unable to load the page, please log in first!");//2
      res.render("profile"); 
    }
  } catch (error) {
    console.error(error);
    res.render("error"); 
  }
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
  req.flash("sukses-register", "Registration successful! Please log in.") //3
  res.redirect("/auth/register")
  }
  catch(error){
    req.flash("error-register", "Registration failed, the email is already registered.")
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
    req.flash("error-user", "Account not found"); //5
    res.redirect("/auth/login");
    return;
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    req.flash("error-password", "Invalid password!") //6
    res.redirect("/auth/login");
    return;
  } 

  req.session.user = user;

  res.redirect("/home")
}

function renderLogin(req, res){
  res.render("login", { currentPath: req.path });
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
        durationText += `${yearDifference} Year(s) `;
      }
      if (monthDifference > 0) {
        durationText += `${monthDifference} Month(s) `;
      }
      if (remainingDays > 0) {
        durationText += `${remainingDays} Day(s)`;
      }

      if (!durationText) {
        durationText = "0 Day";
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
    const user = req.session.user;
    let result = await blogModel.findOne({
      where: {
        id : id,
      }
    }) 
      if (!user){
        req.flash("error-delete-blog-user", "Unable to delete, please log in first."); //7
        res.redirect("/home")
        return
      }
      if (!result) {
        res.status(404).send('Blog not found');
       return   
      }
      if (user.id !== result.user_id) {
        req.flash("error-delete-blog-match-user", "You are not authorized to delete this blog."); 
        res.redirect("/home");
        return;
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
        const user = req.session.user;
        const result = await blogModel.findOne({
          where: {
            id : id,
          }
        })

        if(!user){
          req.flash("error-update-blog-user", "Unable to update, please log in first!") //8
          res.redirect("/home");
          return
        }
        if (user.id !== result.user_id) {
          req.flash("error-update-blog-match-user", "You are not authorized to update this blog!");
          res.redirect("/home");
          return;
      }
    
        if (!result) {
          res.status(404).send('Blog not found');
            return;
        } 
          res.render('update', { blog: result, user : user});
        
    };
    
    async function addBlog(req, res) {
      const userId = req.session.user.id;
      let { name, description, tech, start_date, end_date } = req.body;
      const image = req.file ? req.file.filename : null; 
  
      if (!userId) {
          return res.status(403).send('User not authenticated');
      }
      
      if (typeof tech === 'string') {
          tech = [tech];
      }
      if (!tech || tech.length === 0 || tech[0] === "") {
          tech = [" "]; 
      }
  
      try {
          await blogModel.create({
              user_id: userId,
              name: name,
              image: image,
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
    
 
    async function renderHome(req, res) {
      const user = req.session.user;
    
      try {
        const result = await blogModel.findAll({
          include: [{
            model: userModel,
            as: 'user', 
            attributes: ['name'] 
          }],
        });
    
        const blogsWithTech = result.map(blog => {
          const blogData = blog.get();
          const userName = blog.user ? blog.user.name : 'Unknown';
        
          const truncatedMessage =
            blogData.description.length > 100
              ? blogData.description.substring(0, 100) + "..."
              : blogData.description;
        
          return {
            ...blogData,
            userName, 
            truncatedMessage,
            techIcons: techI(blogData.tech), 
            resultCoutDays: coutDays(blogData.start_date, blogData.end_date)
          };
        });
        
    
        res.render("index", { blogs: blogsWithTech, currentPath: req.path, user: user });
      } catch (error) {
        console.error("Error executing query:", error);
        res.render("error", { message: "Something went wrong" });
      }
    }
    

 function renderTestimonials(req, res){
  const user = req.session.user;

    res.render("testimonials", { currentPath: req.path, user : user })
};

function renderContact(req, res){
  const user = req.session.user;


    res.render("contact", { user : user });
};

function renderMyproject(req, res){
  const user = req.session.user;

  if(!user){
    req.flash("error-project-user", "Unable to add project, please log in first."); //9
    res.render("myproject", { currentPath: req.path, user : user });
    return
  }
    req.flash("sukses-project-user", " ")
    res.render("myproject", { currentPath: req.path , user : user});
};

async function renderDetail(req, res) {
  const { id } = req.params;

  const result = await blogModel.findOne({
    where: {
      id: id
    },
    include: [{
      model: userModel,
      as: 'user',
      attributes: ['name']
    }],
  });

  if (result) {
    const blogData = result.get();
    const techArray = ['NodeJs', 'Laravel', 'ReactJs', 'JavaScript'];

    const techs = blogData.tech || [];
    const extractedTechs = techArray.filter(tech => techs.includes(tech));
    const formattedDetArray = detalTch(extractedTechs, techArray);
    const resultCoutDays = coutDays(blogData.start_date, blogData.end_date);
    
    res.render("detail", {
      blogData,
      formattedDetArray,
      resultCoutDays,
      userName: result.user ? result.user.name : 'Unknown', 
      createdAt: blogData.createdAt,
      updatedAt: blogData.updatedAt
    });
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

  const image = req.file ? req.file.filename : result.image;

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
  result.image = image;

  await result.save()
  res.redirect("/home");
  
}
;



app.listen(port, () => {
    console.log(`Berjalan di port ${port}`)
})

