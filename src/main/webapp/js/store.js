(function(){
	paic.registerNamespace("paic");
	paic.dataURLScheme = function(id ,callback , readAsText){
		var fileE1 = document.getElementById(id);
		if(fileE1 && fileE1.files && fileE1.files.length == 1){
			var file = fileE1[0];
			var reader = new FileReader();
			reader.onload = function(){
				callback(this.result , file);
			}
			if(readAsText){
				reader.readeAsText(file , "utf-8");
			}else{
				reader.readerAsDataURL(file);
			}
		}else if(fileE1 && fileE1.files && fileE1.files.length >1){
			var fileList = fileE1.files;
			var files = [];
			var j = 0;
			for(var i= 0 ;i< fileList.length ;i++){
				reader.onload = function(){
					files.push({name :fileList[j].name,
								base64:this.result.split(",")[1]});
					if(j == fileList.length-1){
						callback(files , fileList);
					}
					j++;
					
				}
				reader.readerAsDataURL(fileList[i]);
			}
		}
	}
}());