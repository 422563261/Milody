var fs = require('fs'),
    path = require('path'),
    util = require('util');


let _path = '中文歌';
let json_url = '/assets/js/musicList.json';

explorer(_path,json_url);

function explorer(path,json_url){

    var musicList = [];
    var flag = 0;
    var i = 0;

    fs.readdir(path, function(err, files){

        //err 为错误 , files 文件名列表包含文件夹与文件
        if(err){
            console.log('error:\n' + err);
            return;
        }

        files.forEach(function(file){

            fs.stat(path + '/' + file, function(err, stat){
                if(err){console.log(err); return;}
                if(stat.isDirectory()){

                    // 如果是文件夹遍历
                    explorer(path + '/' + file);

                }else{
                    if (file.slice(-4) == '.mp3'){
                        var _file = file.slice(0,-4);
                        var url = path + '/' + file;

                        var musicInfo = _file.split(" - ");
                        // 读出所有的文件

                        var info = {
                            'i': i,
                            'singer': musicInfo[0],
                            'name': musicInfo[1],
                            'url': url
                        };
                        i++;
                        musicList.push(info);
                    }

                }
            });


        });

        flag = 1;

    });

    (function writeList() {
        if (flag){
            // console.log(musicList);
            fs.writeFileSync(__dirname+json_url, JSON.stringify(musicList));
        } else {
            setTimeout(
                writeList, 100
            )
        }
    })()


}

exports.explorer = explorer;
