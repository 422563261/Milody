<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/10/24
 * Time: 19:10
 */
//mysql数据库连接准备
header("Content-type:application/json;charset=utf-8");
define('HOST','localhost');
define('UserName','root');
define ('PassWord','xiaoyu520');
//数据库连接及判断
if(!($con = mysqli_connect(HOST,UserName,PassWord))){
    echo mysqli_error($con);
}
//数据库选择及判断
if(!(mysqli_select_db($con,'musicku'))){
    echo mysqli_error($con);
}
//数据库返回字段设置为utf-8
if(!(mysqli_query($con,"set names 'utf8'"))){
    echo mysqli_error($con);
}
//要运行的sql语句
$sql='select * from songs';
//得到资源句柄
$res = mysqli_query($con,$sql);
//在内存中取出数据
$row = mysqli_fetch_all($res);
//打印
echo json_encode($row);




