//import { ExportToCsv } from 'export-to-csv';
const 	rp       = require('request-promise'),
		cheerio  = require('cheerio'),
		Table    = require('cli-table'),
		readline = require('readline');

let menmatches = new Table({
	head:['Date','Team A','Score','Team B'],
	colWidths: [10,15,7,15]
});
let men_url=[];

function fetch_menmatches(){
	return new Promise(function(resolve,reject){		

		const options1 = {
			url: 'https://int.soccerway.com/teams/united-states/united-states-of-america/2281/matches/',
			transform: body => cheerio.load(body)
		};

		process.stdout.write("Loading last 4 matches of USMNT");

		var i=0;
		function men_matches(){
			if(i<4){
				rp(options1)
					.then(function($){
						process.stdout.write(".");
						const numRows = $('tbody tr').length;
						//console.log(numRows);
						const date = $(".matches tbody > tr:nth-child("+(numRows-3-i)+")  > td:nth-child(2)").text()
						//console.log(date)
						const teama = $(".matches tbody > tr:nth-child("+(numRows-3-i)+")  > td:nth-child(4) > a").attr("title");
						//console.log(teama);
						const score = $(".matches tbody > tr:nth-child("+(numRows-3-i)+")  > td:nth-child(5)").text().toString().substring(49,54);
						//console.log(score);
						const teamb = $(".matches tbody > tr:nth-child("+(numRows-3-i)+")  > td:nth-child(6) > a").attr("title");
						//console.log(teamb);
						menmatches.push([date,teama,score,teamb]);

						var url = $(".matches tbody > tr:nth-child("+(numRows-3-i)+")  > td:nth-child(8) > a").attr("href");
						url="https://int.soccerway.com"+url;
						//console.log(url);
						var side;
						if(teama=="United States")
							side="left";
						else
							side="right";
						var temp = {url, side}
						//console.log(temp);
						men_url.push(temp);
						//console.log(men_url);
						i++;
						return men_matches();
					});
			}else{
				console.log();
				resolve(menmatches.toString());
			}
		}
		return men_matches();
	})
}
/////////////////////////////////////////////////////////////////https://int.soccerway.com/matches/2020/02/01/world/friendlies/united-states-of-america/costa-rica/3201532/

let womenmatches = new Table({
	head:['Date','Team A','Score','Team B'],
	colWidths: [10,15,7,15]
});
let women_url=[];

function fetch_womenmatches(){
	
	return new Promise(function(resolve,reject){

		const options2 = {
			url: 'https://us.women.soccerway.com/teams/united-states/united-states/5977/matches/',
			transform: body => cheerio.load(body)
		};

		process.stdout.write("Loading last 4 matches of USWNT");

		i=0;
		function women_matches(){
			if(i<4){
				rp(options2)
					.then(function($){
						process.stdout.write(".");
						const numRows = $('tbody tr').length;
						//console.log(numRows);
						const date = $(".matches tbody > tr:nth-child("+(numRows-8-i)+")  > td:nth-child(2)").text()
						//console.log(date)
						const teama = $(".matches tbody > tr:nth-child("+(numRows-8-i)+")  > td:nth-child(4) > a").attr("title");
						//console.log(teama);
						const score = $(".matches tbody > tr:nth-child("+(numRows-8-i)+")  > td:nth-child(5)").text().toString().substring(49,54);
						//console.log(score);
						const teamb = $(".matches tbody > tr:nth-child("+(numRows-8-i)+")  > td:nth-child(6) > a").attr("title");
						//console.log(teamb);
						womenmatches.push([date,teama,score,teamb]);

						var url = $(".matches tbody > tr:nth-child("+(numRows-8-i)+")  > td:nth-child(8) > a").attr("href");
						url="https://us.women.soccerway.com/"+url;
						var side;
						if(teama=="United States")
							side="left";
						else
							side="right";
						var temp = {url, side}
						//console.log(temp);
						women_url.push(temp);

						i++;
						return women_matches();
					});
			}else{
				console.log();
				resolve(womenmatches.toString());
			}
		}
		return women_matches();
	})		
}

//fetch_menmatches().then(function(data){
//	console.log(data);
//});
//setTimeout(function(){ fetch_womenmatches() }, 3000);
//setTimeout(function(){ console.log(men_url) }, 1000);

///////////////////////////////////////////////////////////////////

let menplayers = new Table({
	head:['Match','Squad'],
	colWidths: [7,120]
});


function fetch_menplayers(i){
	
	return new Promise(function(resolve,reject){

		
			//var i=2;
			const options = {
				url: men_url[i].url,
				transform: body => cheerio.load(body)
			};
			process.stdout.write("Loading USMNT players of Match"+(i+1));
			var side = men_url[i].side;
			//console.log(side);
			var j=1;
			let players = []
			function next(){
				if(j<12){
					rp(options)
						.then(function($){
							process.stdout.write(".");
							var name="ABC",num="0";

							if(side=="left"){
								name = $(".left tbody > tr:nth-child("+j+")  > td:nth-child(2) > a").text()
								num = $(".left tbody > tr:nth-child("+j+")  > td").text().toString().substring(0,2);
							}
							else{
								name = $(".right tbody > tr:nth-child("+j+")  > td:nth-child(2) > a").text()
								num = $(".right tbody > tr:nth-child("+j+")  > td").text().toString().substring(0,2);	
							}
							//console.log(name);
							players.push(name);
							j++;
							return next();
						});
				}else{
					console.log();
					resolve(players.toString());
				}
			}
			return next();
		
	})
	//resolve(menplayers.toString());

}
//fetch_menplayers();


let womenplayers = new Table({
	head:['Match','Squad'],
	colWidths: [7,120]
});


function fetch_womenplayers(i){
	
	return new Promise(function(resolve,reject){

			const options = {
				url: women_url[i].url,
				transform: body => cheerio.load(body)
			};
			process.stdout.write("Loading USWNT players of Match"+(i+1));
			var side = women_url[i].side;
			//console.log(side);
			var j=1;
			let players = []
			function next(){
				if(j<12){
					rp(options)
						.then(function($){
							process.stdout.write(".");
							var name="ABC",num="0";

							if(side=="left"){
								name = $(".left tbody > tr:nth-child("+j+")  > td:nth-child(2) > a").text()
								num = $(".left tbody > tr:nth-child("+j+")  > td").text().toString().substring(0,2);
							}
							else{
								name = $(".right tbody > tr:nth-child("+j+")  > td:nth-child(2) > a").text()
								num = $(".right tbody > tr:nth-child("+j+")  > td").text().toString().substring(0,2);	
							}
							//console.log(name);
							players.push(name);
							j++;
							return next();
						});
				}else{
					console.log();
					resolve(players.toString());
				}
			}
			return next();		
	})
}







async function main(){
	
	 const options = { 
	    fieldSeparator: ',',
	    quoteStrings: '"',
	    decimalSeparator: '.',
	    showLabels: true, 
	    showTitle: true,
	    title: 'My CSV',
	    useTextFile: false,
	    useBom: true,
	    useKeysAsHeaders: true,    
   	};
	const csvExporter = new csv(options);

	var input = process.argv[2];
	
  	if(input=='m'||input=='M'){
  		var data1 = await fetch_menmatches();
		console.log(data1);		
		csvExporter.generateCsv(data1);
		//console.log(men_url);
		//for(var i=0;i<4;i++){
		//	var data3 = await fetch_menplayers(i);
		//	menplayers.push([i+1,data3]);
		//}
		console.log(menplayers.toString());
  	}else if(input=='w'||input=='W'){
  		var data2 = await fetch_womenmatches();
		console.log(data2);
		//console.log(women_url);
		for(var i=0;i<4;i++){
			var data4 = await fetch_womenplayers(i);
			womenplayers.push([i+1,data4]);
		}
		console.log(womenplayers.toString());
  	}else{
  		console.log("Press M for USMNT Stats, or Press W for USWNT Stats after the filename and run!");
  	}
}
main();

//to be added to csv file
