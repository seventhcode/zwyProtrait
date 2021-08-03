'use strict';



const cheerio = require('cheerio');
const axios = require('axios');
// const puppeteer = require('puppeteer');


const db = uniCloud.database();
const collection = db.collection('protraitList');




exports.main = async (event, context) => {
	
	// const browserFetcher = puppeteer.createBrowserFetcher();

	// let browserRes = await browserFetcher.download("818858");
	//   let browser = puppeteer
	//     .launch({
	//       executablePath: browserRes.executablePath, //chrome执行门路
	//       headless: false, //浏览器无头模式
	//     })



	// 本地运行
	// let browser = await puppeteer.launch({
	// 	headless: false, // 隐藏浏览器界面启动
	// 	slowMo: 100, // 放慢浏览器执行速度，方便测试观察
	// 	args: [ // 启动 Chrome 的参数
	// 		'–no-sandbox',
	// 		'--window-size=1280,960'
	// 	]
	// });

	// let page = await browser.newPage();



	let countRes = await db.collection('protraitList').where({
		hasInit: false
	}).count();
	let total = countRes['total'];
	console.log('total', total);
	let nowNum = 0;
	let failNum = 0;
	let allList = [];
	while (nowNum < total) {
		let res = await db.collection('protraitList').where({
			hasInit: false
		}).limit(500).skip(nowNum).get();
		console.log('res', res);
		allList = allList.concat(res.data);
		nowNum += 500;
	}

	console.log('allList', allList);


	let nowIndex = 0;
	let saveListDetail = [];
	let nowPnDetail = 1;
	let needViewTrue = false;

	let getDetail = async () => {

		let nowUrl = allList[nowIndex]['url'];



		let tempUrl = `https://tieba.baidu.com${nowUrl}?see_lz=1&pn=${nowPnDetail}`;
		console.log('tempUrl', tempUrl);




		// let tempRes = await axios.get(tempUrl);
		let tempRes = await axios({
			headers: {
				'Cookie': '',
				'Referer': tempUrl,
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.81 Safari/537.36 SE 2.X MetaSr 1.0',
			},
			method: 'get',
			url: tempUrl
		})




		let content = tempRes.data;

		// console.log('content', content);

		if (needViewTrue && content.indexOf('百度安全验证') != -1) {
			console.log('被安全验证了，跑路~');
			return;
		} else needViewTrue = false;


		// await page.goto(tempUrl, {
		// 	waitUntil: 'load', // Remove the timeout
		// 	timeout: 0
		// });

		// let content = await page.content();


		let $ = cheerio.load(content);

		let tempCheck = content.indexOf('原图');


		if (tempCheck != -1) {
			// 非原图 删除某条数据

			await db.collection('protraitList').doc(allList[nowIndex]['_id']).remove();

			console.log('非原图', tempCheck);
			saveListDetail = [];
			nowIndex++;
			nowPnDetail = 1;
			if (allList.length > nowIndex) {
				await getDetail();
			} else {
				// await new Promise(function(resolve) {
				// 	setTimeout(resolve, 800)
				// });
				// if (page) await page.close();
				// await new Promise(function(resolve) {
				// 	setTimeout(resolve, 800)
				// });
				// if (browser) await browser.close();
				console.log('遍历结束');
			}
			return;
		}
		let maxPn = 1;
		let replayList = $('.l_reply_num');
		$('.l_reply_num').each((index, elem) => {
			let nowText = $(elem).text();
			let tempIndex = nowText.indexOf('共');
			if (tempIndex != -1) {
				maxPn = nowText.substring(tempIndex + 1, nowText.length - 1);
			}
		})
		if (maxPn > 3) maxPn = 3;
		let imgList = $('.BDE_Image');
		imgList.each((index, elem) => {
			saveListDetail.push($(elem).attr('src'));
		})
		nowPnDetail++;
		if (nowPnDetail <= maxPn) await getDetail();
		else {
			console.log(`${nowIndex}:获取${allList[nowIndex]['title']}详情结束`, saveListDetail);
			// 判断图片数量
			if (saveListDetail.length < 8) {
				// 图片数量过少删除某条数据
				if (content.indexOf('百度安全验证') != -1) needViewTrue = true;
				else await db.collection('protraitList').doc(allList[nowIndex]['_id']).remove();
			} else {
				let tempImgUrl = saveListDetail.slice(0, 3);
				// 更新某条数据，存入详情
				await db.collection('protraitList').doc(allList[nowIndex]['_id']).update({
					hasInit: true,
					imgUrl: tempImgUrl
				});

				await db.collection('protraitDetail').add({
					imgUrl: saveListDetail,
					url: nowUrl
				});
			}

			saveListDetail = [];
			nowIndex++;
			nowPnDetail = 1;
			if (allList.length > nowIndex) {
				await getDetail();
			} else {
				await new Promise(function(resolve) {
					setTimeout(resolve, 800)
				});
				if (page) await page.close();
				await new Promise(function(resolve) {
					setTimeout(resolve, 800)
				});
				if (browser) await browser.close();
				return;
				console.log('遍历结束');
			}
		}
	}

	if (allList.length > 0) await getDetail();
	else {
		console.log('全部结束');
		// await new Promise(function(resolve) {
		// 	setTimeout(resolve, 800)
		// });
		// if (page) await page.close();
		// await new Promise(function(resolve) {
		// 	setTimeout(resolve, 800)
		// });
		// if (browser) await browser.close();
	}
	return 'list';
};
