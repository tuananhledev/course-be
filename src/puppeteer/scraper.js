const startBrowser = require('./browser');


const baseUrl = 'https://bsmart.edu.vn'

const scraper = async (url, cb, ...args) => {
   const browser = await startBrowser();
   const page = await browser.newPage();
   await page.goto(url);
   // await page.waitForSelector('.blog-wrapper');

   const data = await page.evaluate(cb, ...args);

   browser.close();
   return data
}

const scraperHome =  async () =>await scraper(baseUrl, (url) => {
   // declare func
   const bgStyle = (image) => window.getComputedStyle(image).backgroundImage.match(/url\("(.*)"/)[1]

   // for banner
   const banner = {
      image: bgStyle(document.querySelector('.banner')),
      title: document.querySelector('.caption-content h4').textContent,
      caption: document.querySelector('.caption-content h2').innerText,
      description: document.querySelector('.caption-content p').innerText,
      linkCourse: document.querySelector('.banner-control a').getAttribute('href')
   }

   // for about
   const about = {
      title:  document.querySelector('.aboutus-content > h2').innerText,
      description:  document.querySelector('.about-description').innerText,
      overlayImage: bgStyle(document.querySelector('#aboutus')),
      aboutImage: url +  document.querySelector('.banner-aboutus > img').getAttribute('src'),
      linkCourse: '/course',
      linkFb: 'https://www.facebook.com/bsmart.edu.vn'
   }

   // for advantages
   const advantages = {
      title: document.querySelector('.advantages h2').innerText,
      items: [Array.from(document.querySelector('.service-card'))]
   }

   const card = Array.from(document.querySelectorAll('.service-card'))

   advantages.items = card.map(item => (
      {
         title: item.querySelector('.service-card-title').innerText,
         content: item.querySelector('.service-card-content').innerText
      }
   ))
   
   // for courses
   let courses = Array.from(document.querySelectorAll('.courses-section')).splice(0,2);

   const getNumber = (str) => Number(str.trim().split(' ')[0])

   const convertStar = (fullStar, halfStar, noneStar) => {
      return Number(parseFloat(fullStar.length * 1 + halfStar.length * 0.5 + noneStar.length * 0).toFixed(1))
   }

   const getLevel = (str) => {
      const modeImage = {
         '/files/Levels/1/ant-icon-01.webp': 'easy',
         '/files/Levels/1/ant-icon-02.webp': 'medium',
         '/files/Levels/1/ant-icon-03.webp': 'hard',
         '/files/Levels/1/ant-icon-04.webp': 'expert',
         '/assets/images/captoc.webp': 'hot',
      };
      return modeImage[str]
   }

   courses = courses.map(section => ({
      title: section.querySelector('.courses-content .section-heading-course-title').innerText,
      items: Array.from(section.querySelectorAll('.course-card')).map(course => ({
         link: course.querySelector('a').getAttribute('href'),
         banner: bgStyle(course.querySelector('.banner-course')),
         mentorAvatar: url + course.querySelector('.logo-course img').getAttribute('src'),
         name: course.querySelector('.card-title').innerText,
         mentor: course.querySelector('.sub-title:last-child').innerText,
         level: getLevel(course.querySelector('.icon-title-course').getAttribute('src')),
         students: getNumber(course.querySelector('.time .cl-icon-user').innerText),
         description: course.querySelector('.description p').innerText,
         price: getNumber(course.querySelector('.feedback-time .time').innerText.replaceAll(',','')),
         lessons: getNumber(course.querySelector('.feedback-time .mark .cl-icon-V').innerText),
         star: convertStar(course.querySelectorAll('.testi-rating .fa-star'), course.querySelectorAll('.testi-rating .fa-star-half-o'), course.querySelectorAll('.testi-rating .fa-star-o'))
      })) 
   }))

   // for mentor
   let representative = Array.from(document.querySelectorAll('.courses-section')).pop()

   const mentors = {
      title: representative.querySelector('.section-heading-course-title').innerText,
      items: Array.from(representative.querySelectorAll('.out__sigle-mentor-home')).map(item => ({
         mentorAvatar: url + item.querySelector('img').getAttribute('src'),
         link: url + item.querySelector('.out__sigle-info a').getAttribute('href'),
         mentor: item.querySelector('.out__sigle-info a h3').innerText,
         description: item.querySelector('.out__sigle-info .description').innerText,
      }))
   }

   const learning = {
      left: {
         image: bgStyle(document.querySelector('.learning-path .left-section')),
         title: document.querySelector('.learning-path .left-section-content h2').innerText,
         subTitle: document.querySelector('.learning-path .left-section-content p').innerText,
      },
      right: {
         image: bgStyle(document.querySelector('.learning-path .right-section')),
         title: document.querySelector('.learning-path .right-section-content h2').innerText,
         subTitle: document.querySelector('.learning-path .right-section-content p').innerText,
      }
   }
   
   const advantages2 = {
      image: bgStyle(document.querySelector('.advantages-2')),
      title: document.querySelector('.advantages-2-content h4').innerText,
      caption: document.querySelector('.advantages-2-content h2').innerText,
      linkCourse: '/course',
      linkFb: 'https://www.facebook.com/bsmart.edu.vn'
   }

   const logos = {
      title: document.querySelector('.information .introduction h5').innerText,
      items: Array.from(document.querySelectorAll('.logo-section .logo-wrapper .swiper-slide')).map(item => url +'/' +item.querySelector('img').getAttribute('src'))
   }

   return {banner, about, advantages, courses, mentors, learning, advantages2, logos}
}, baseUrl)

module.exports = {scraperHome};