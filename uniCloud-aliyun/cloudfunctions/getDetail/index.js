'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event',event);
	
	if(event.url && event.url.indexOf('%2Fp%2F') != -1) event.url = event.url.replace('%2Fp%2F','/p/')
	
	
	let res = await db.collection('protraitDetail').where({
		...event
	}).get();
	//返回数据给客户端
	return res.data;
};
