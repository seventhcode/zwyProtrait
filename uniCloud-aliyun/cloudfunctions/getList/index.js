'use strict';


const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event',event);
	let countRes = await db.collection('protraitList').where({
		hasInit: true,
		...event
	}).count();
	let total = countRes['total'];
	console.log('total', total);
	let nowNum = 0;
	let allList = [];
	while (nowNum < total) {
		let res = await db.collection('protraitList').where({
			hasInit: true,
			...event
		}).limit(500).skip(nowNum).get();
		allList = allList.concat(res.data);
		nowNum += 500;
	}
	
	
	//返回数据给客户端
	return allList;
};
