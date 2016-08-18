!$(function(){
    var funcTool = {
        clearInputFile: function(f) {
            if(f.value){
                try{
                    f.value = ''; //for IE11, latest Chrome/Firefox/Opera...
                }catch(err){
                    if(f.value){ //for IE5 ~ IE10
                        var form = document.createElement('form'), ref = f.nextSibling, p = f.parentNode;
                        form.appendChild(f);
                        form.reset();
                        p.insertBefore(f,ref);
                    }
                }

            }
        },

        // f ---> input file
        // type ---> array allow file type
        checkFileType: function(f, type) {
            if(f.value) {
                var fileList = f.files;
                var flag = 0;
				console.log(fileList)
				
                for(var i = 0 ; i < fileList.length; i++) {
                    var fileName = fileList[i].name;
                    var fileType = fileName.split('.');
                    fileType = fileType[fileType.length-1];
                    var j = 0;
                    while(j < type.length) {
                        if(type[j].toLowerCase() == fileType.toLowerCase()) {
                            flag++;
                            break;
                        }
                        j++;
                    }
                }
                return fileList.length == flag ? true : false;
            }
        },

        uploadFile: function(f, success, progress) {
            if(f.value) {
                var file_count = f.files.length;
                try{

                    for(var i = 0; i<file_count; i++) {
                        var formData = new FormData();
                        formData.append('file', f.files[i]);
                        $.ajax({
                            url: '/attachment/attachments/imgUp.html',
                            type: 'POST',
                            cache: false,
                            data: formData,
                            processData: false,
                            contentType: false,
                            xhr: function(){
                                var xhr = $.ajaxSettings.xhr();
                                if(progress && xhr.upload) {
                                    xhr.upload.addEventListener("progress" , progress, false);
                                    return xhr;
                                }
                            }
                        }).done(function(res) {
                            success(res);
                        }).fail(function(res) {});
                    }
                }catch(err) {
                    alert("不兼容！");
                }
            }
        }
    }

    //-----------------demo-----------------------//
    var $file = $('#file');
    $file.change(function(evt) {
        var allowType = ['jpg', 'png', 'jpeg', 'gif']
        if(!funcTool.checkFileType($file[0], allowType)) {
            alert('文件类型不对！');
            return;
        }

		
        var success = function(res) {
            res = eval('(' + res + ')');
            if(res.error == 0) {
				var $img=$("<img src="+ res['url'] +" data-aid="+ res['aid'] +">")
                var $li = $( '<li class="img-item">' +
                '<p class="imgWrap"></p>'+
                
                '</li>' ),
				$btns = $('<div class="file-panel">' + '<span class="cancel">删除</span>').appendTo( $li )
				$img.appendTo($li.find( 'p.imgWrap' ))
                $li.appendTo($("#wrapper"));
            }
        };

        var progress = function(event) {
            var loaded = event.loaded;                  //已经上传大小情况 
            var tot = event.total;                      //附件总大小 
            var per = Math.floor(100*loaded/tot);     //百分比
			$("#progress-wrap").closest(".progress").css("display","block")
            $("#progress-wrap").css("width",per+"%").text( per +"%" );
            //$("#progress-wrap").css("width" , per +"%");
			var num=$("#progress-wrap").text();
            setTimeout(function () {
                if (per === 100) {
                    $("#progress-wrap").closest(".progress").css("display", "none")
                }
            }, 1500);
			
			
			
        }

        funcTool.uploadFile($file[0], success, progress);
        
    }).click(function() {
        funcTool.clearInputFile($file[0]);
    });
});
