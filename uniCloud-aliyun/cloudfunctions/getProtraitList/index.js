'use strict';
const axios = require('axios');
const cheerio = require('cheerio');
const db = uniCloud.database();
const collection = db.collection('protraitList');



exports.main = async (event, context) => {
	//event为客户端上传的参数;
	let nowPn = 0;
	let keyList = ['头像','情侣头像', '女生头像','动漫头像','男生头像','男头', '女头', '情头'];
	let keyObj = {
		头像:'头像',
		情侣头像:'情头',
		女生头像:'女头',
		动漫头像:'动漫头像',
		男生头像:'男头',
		男头:'男头',
		女头:'女头',
		情头:'情头'
	}
	// let keyList = ['女头', '情头'];
	let keyIndex = 0;
	let saveList = [];
	let checkObj = {};
	//返回数据给客户端
	let getList = async () => {
		let tempUrl =
			`https://tieba.baidu.com/f?kw=${encodeURI(keyList[keyIndex])}&ie=utf-8&pn=${nowPn}`;
		console.log('tempUrl', tempUrl);
		let tempRes = await axios.get(tempUrl);
		const $ = cheerio.load(tempRes.data, {
			normalizeWhitespace: true,
			decodeEntities: false
		});
		let contentList = $('.t_con');
		$('.t_con').each(async (index, elem) => {
			let tempNum = Number($(elem).children('.col2_left').text());
			if (tempNum > 200) {
				let detailItem = $($(elem).find('.j_th_tit a'));
				let tempItem = {
					num: tempNum,
					title: detailItem.attr('title'),
					url: detailItem.attr('href'),
					type: keyObj[keyList[keyIndex]],
					hasInit: false
				}
				let checkCountInSql = await collection.where({
					url: tempItem['url']
				}).count();
				console.log('checkCountInSql', checkCountInSql);
				if (checkCountInSql['total'] === 0 && tempItem['title'] && !checkObj[
						tempItem['url']] && checkTitle(tempItem.title)) {
					saveList.push(tempItem);
					checkObj[tempItem['url']] = true;
				}
			}

		})
		nowPn += 50;
		
		await new Promise(function(resolve) {
		    setTimeout(resolve, 2000)
		});
		
		
		if (nowPn <= 200) await getList();
		else {
			console.log(`获取${keyList[keyIndex]}结束`);
			if (saveList.length > 0) {
				let res = await collection.add(saveList);
				console.log('saveToSql', res);
			}
			saveList = [];
			keyIndex++;
			if (keyList.length > keyIndex) {
				nowPn = 0;
				await getList();
			} else {
				console.log('全部获取结束');
			}
		}
	}
	await getList();
	return event;
};

function checkTitle(title) {
	let forbidTitleList = ['水贴', '吧务', '联系','官方','经验','删除'];
	for (let i = 0; i < forbidTitleList.length; i++) {
		if (title.indexOf(forbidTitleList[i]) != -1) return false;
	}
	return true;
}
