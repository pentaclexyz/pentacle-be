### You'll need a cut of the database – ask pentacle for one

$ createdb pentacle-db
$ psql pentacle-db < pentacle-db.sql



### To run

$ yarn develop



### caution

strapi sometimes sometimes alters relations from inversedBy to mappedBy and vice versa which causes the relations to break. So before you push anything make sure it hasn't altered any of the relations that you didn't deliberately add / alter

