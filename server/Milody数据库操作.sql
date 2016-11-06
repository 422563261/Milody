create database musicku;
use musicku;

create table songs
(
	Name char(50),
    ID int auto_increment,
    Singer char(20),
    PinYin char(100),
    SongLocal char(100),
    Lyrics char(100),
    Hot int,
	PRIMARY KEY(ID)
);


insert into songs(Name,Singer,PinYin,SongLocal,Lyrics,Hot) 
values 
('我好像在哪见过你','薛之谦','wohaoxiangzainajianguoni','E:/wamp','E:/wamp',0),
('不该','周杰伦','bugai','E:/wamp','E:/wamp',0),
('我的好兄弟','小沈阳、高进','wodehaoxiongdi','E:/wamp','E:/wamp',0),
('画','G.E.M邓紫棋','hua','E:/wamp','E:/wamp',0),
('FLOW','方大同、王力宏','flow','E:/wamp','E:/wamp',0),
('男人花','黄勇','nanrenhua','E:/wamp','E:/wamp',0);


select *from songs;
drop database musicku;