Katherine Tse Final Project Readme
===

## Meets Me - Gymnastics 

Link: https://cs4241e25-final-project-katherinetse.onrender.com 

**Description**: 

Meets Me is a personal score tracker specifically made for Women's Gymnastics. When you first open the application, there is a simple login page that prompts you for a username and password. If you have a login already, you can fill out the form and it will bring you to the main application (described later). If you do not have a login yet, there is a link to an account creation form at the bottom of the login form. The account creation form asks users for first name, last name, username, and a password that must be typed twice to confirm. Once you fill out that form, you will be redirected to the main application. 

The main application is where a your data is displayed and manipulated. At the top of the page, under the header, there is a persoanlize welcome and brief description of the website. Underneath that, there are two buttons that open up forms to allow you to add and delete data entries. A data entry consists of a unqiue entry ID, the name of the competition, the year of the competition, the program that you competed under, the leve you competed, and scores for all four events and all-around/total score. To showcase the data, there is a table where you can manipulate it to show specific columns, sort it by specific attributes, search for specific entries, specify pagination, and export a csv or pdf. The final column of the table holds the Edit Entry button which allows users to edit specific entries. On the right, you can find the Analytics section. The analytics section displays the average scores and top scores for each gymnastics event and the total score. The analytics can be narrowed via a dropdown menu that allows you to select various categories such as level, year and program. You can also toggle on and off a visual graph display of these analytics. 

Finally, there are two buttons in the header. The About button opens a modal that gives a brief description of the application and a list of features. The Why button opens a modal that introduces me (the creator) and explains my background and why I decided to make this application. There is also a image carousel of pictures of me competing. 

**Instructions**
- Login Information to see populated account
  - Username: ktse
  - Password: thisismypassword1
- Note from hosting service
  -  The free instance will spin down with inactivity, which can delay requests by 50 seconds or more.
 
**Technologies**
- Node.JS
  - runtime environment used for the back-end server
  - aided communication between the front-end and the database
  - base for login/authentication, routing, database usage and data calculations
- Express
  -  routing framework
  -  helped set up HTTP server
- Cookies
  - data storage in browser 
  - used for login/user athentication
- MongoDB
  - database used to maintain persistent data
  - stored user login information (username, password, etc.)
  - stored all competitions entries and the links back to the proper user
- Tailwind CSS
  - front-end styling CSS framework
  - used to style all aspects of the website with in-line styling
  - allowed fro very specific styles to be applied to each individual elemnt
- Material UI
  - UI component library
  - used to create and customize the data table 
  - used to create the modals/pop-ups linked in the header
  - used to generate the graphs in the Analytics section

**Challenges** 
- Deploy Images:
  - I used npm run dev to test my application locally during development. When I finally got to deploying my application, my images, which worked when I ran locally, would not load. I could not for the life of me figure out why. There were no errors in the console, just the image alts displaying instead of the pictures and icons themselves. I did a lot of googling and looking into how Vite and React handle images, how Vite Build works, and potential issues with the hosting service (Render) itself. After a good amount of trial and error, I realized that the way that importing images in an HTML file did not work in JSX files once you built the project. I switched to importing the images and that ended up working!
- Deciding Analytics:
  - Going into the project, I knew that I wanted to have some form of analtyics derived from the data aside from the calculated total score. I thought a lot about what would be the most helpful for gymnasts and decided that average and top scores would probably be best. From there I realized that I probably also wanted to be able to not just do analytics for the entire dataset but also for some subsets of the data based on things like level, year, and program. After deciding on the numbers, I started to think about what would be the best graph to use to display the data. I went back and forth a lot between trying to scatter chart the entries or using a gauge. After looking into both of the options, I decided that a gauge would be the best and most desired data visualization. The age range of the ideal user group starts pretty young and I figured that a gauge would be easily understood by the younger population. 
- Paring Down:
  - Coming into this application, I knew that there were a TON of features and ideas that I could implement and attack. While writing up the proposal and working on the project, I found myself constantly thinking about how best to pair down all of the ideas. I really honed in on making a complete and easy to use product which meant that there are many features that I wish I had time to implement that just didn't make the cut.
 
**Contributors**: Katherine Tse (solo)

**Accessibility**
- Proper HTML Tags
  - I did my best to use the proper HTML tags for all elements of the website. Instead of making everything a div, I put all content into descriptive tags and wrapped divs around elements when needed for styling purposes.
- Color Conscious
  - I did my best to avoid excessive use of red and green becaues of the high rate of color-blindness towards those colors.
  - I also checked all text and background colors with a contrast color checker. (linked below)
    - https://color.adobe.com/create/color-contrast-analyzer
- Lighthouse Test
  - When developing, I aimed for at minimum a 90 on all four lighthouse tests which I was able to achieve.   
- Font Size
  - The base font size of my application is 18px with no text smaller than 16px.
- Images
  - All images have alt text available.
- Link hover
  - Hovering over links removes the underline and does not just change the color of the text.
- Zoom Reformat
  - When a user zooms in, the Analytics will drop down below the Competition Entries section to allow for the table to grow.      
