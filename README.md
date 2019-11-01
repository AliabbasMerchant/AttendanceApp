# Attendance App
A simple attendance app

## Background & Requirements
My friend, a few days ago, told me to make an attendance app for his class.  
Requirements:  
- [x] Login for admin(s)
- [x] PWA
- [x] Ability to add users
- [x] Very easy selection of present students
- [x] A bit of statistics/analysis
I knew it was a simple task, so I thought of doing it in a coding sprint. Sort of a mini hackathon.


## Preparation
* I have my heroku account set up
* My DB is set up
* A few projects for reference and copy pasta :smile:
* Lots of thinking

Its 8:30 pm, and I now begin. I have my laptop (with a mouse attached to it), paper and pen and a water bottle with me. (And obviously Google, SO, GitHub, etc to help me out)

Lets see how fast I can copy pasta and build a working system, according to the requirements!
Lets begin!

### Updates
30/10/19 20:30: Lets start hacking!  
31/10/19 00:09: Hacked for approx 03:20 hours  
31/10/19 10:30: Lets start hacking again!  
31/10/19 13:10: Hacked for approx 02:10 hours  
31/10/19 16:45: Lets start hacking again!  
31/10/19 18:25: Hacked for approx 01:40 hours  
31/10/19 20:05: Lets start hacking again!  
01/11/19 00:25: Hacked for approx 04:00 hours  
01/11/19 08:00: Lets start hacking again!  
01/11/19 12:00: Hacked for approx 03:00 hours  
01/11/19 16:40: Lets start hacking again!  
01/11/19 19:40: Hacked for approx 03:00 hours  
01/11/19 21:00: Lets start hacking again!  
01/11/19 22:00: Hacked for approx 01:00 hours  
01/11/19 22:45: Lets start hacking again!  
02/11/19 00:00: Hacked for approx 01:00 hours  

I think the app is finally completed.  
Took me approx 19:00 hours.  
Lots more than I had expected, but it was fun!

I will be deploying the app at https://aliabbas-attendance-app.herokuapp.com/ , but it will be password protected, so... :smile:

## Environment Variables
I had set the following environment variables (in nodemon.json):  
```
"MONGO_CONNECTION_STRING": "mongoSRVString",
"SECRET": "aRandomString1",
"SECRET_NUMBER": aRandomNumber,
"PORT": 3000,
"COOKIES_SECRET": "aRandomString2",
"DEVELOPER": "someAdminName"
```

## Notes
* Dont delete a student on the last day. Delete it on the next day.
* Add users the first day they attend class. Not before that. Otherwise they will be marked absent
* There is almost no offline capability. You need an internet connection