window.onload = function(){
	firstSign = '&lt;';
	secondSign = '&le;';
	document.getElementById('analyse').onclick = handleData;
	document.getElementById('outit').onclick = updateData;
	g('gout').onclick = groupUpdate;
	document.getElementById('percentilec').onclick = function(){refreshOut();
																			var newa = [];
																			var table = g('displayData');
																			rows = table.getElementsByTagName('tr');
																			for(var row = 1;row < rows.length;row++){
																				var cd = rows[row].getElementsByTagName('td')[0].innerHTML;
																				if(cd == 'Item')continue;
																				for(var c = 0;c < freqOf(cd);c++)newa.push(parseInt(cd));
																			}
																			a = newa;
																			var pr = g('percentile').value;
																			refreshOut();
																			if(a.length != 0)print('P<sub>'+pr+'</sub>: '+p(a,parseInt(pr)));
																			if(groups.length != 0 ){
																			var newa = [];
																			var table = g('displayIntervals');
																			var gs = table.getElementsByTagName('tr');
																			var grops = [];
																			for(var i = 0;i<gs.length-1;i++)grops.push(gs[i+1].getElementsByTagName('td')[0].innerHTML);
																			for(gro = 0;gro < grops.length;gro++){
																				classd = extract(grops[gro]);
																				freq = freqOfX(classd);
																				for(var i = 0;i < parseInt(freq);i++)newa.push(cmOf(classd));
																			}
																			var a = newa;
																			print('Class P<sub>'+pr+'</sub>: '+p(a,parseInt(pr)) + " ( "+classOf(p(a,parseInt(pr))) +' )');
																}
																		}
}
function g(x){
	return document.getElementById(x);
}
function updateTables(){
	var newa = [];
	var table = g('displayData');
	rows = table.getElementsByTagName('tr');
	for(var row = 1;row < rows.length;row++){
		var cd = rows[row].getElementsByTagName('td')[0].innerHTML;
		if(cd == 'Item')continue;
		for(var c = 0;c < freqOf(cd);c++)newa.push(parseInt(cd));
	}
	a = newa;
	setMids();
}
function sieve(arr){
	var na = [];
	for(var i = 0;i<arr.length;i++){
		s = (''+arr[i]).trim();
		if(s != '')na.push(s);
	}
	return na;
}
function handleData(){
	clearTable();
	iClearTable();
	g('displayData').innerHTML += '<tr><td>Item</td><td>Frequency</td><td>Delete Item</td></tr>';
	g('displayIntervals').innerHTML += '<tr><td>Interval</td><td>Frequency</td><td>Class Midpoint</td><td>Frequency x Class Midpoint<td>Delete Interval</td></tr>';
	a = sieve(g('ui').value.split(' '));
	var na = [];
	if(g('intervals').value.length != 0 ){
	var intervals = sieve(g('intervals').value.replace(/\r\n/g, "\n").split("\n"));
	groups = [];
	for(var i = 0;i<intervals.length;i++)if(intervals[i].length != 0)groups.push(intervals[i].split(' ') );
	if(groups.length != 0){
	for(gr = 0;gr<groups.length;gr++){
		itable(groups[gr][0],groups[gr][1]);
	}
	for(var i = 0;i < groups.length;i++){
		gr = groups[i];
		setFreqX(gr.join(' '),countC(a,gr[0],gr[1]));
		setCm(gr.join(' '));
	}}}
	if(a.length != 0){
	a.sort(compareNumbers);
	seen = [];
	for(var i = 0; i < a.length;i++){
		if(count(seen,a[i]) == 0){
			table(a[i]);
			seen.push(a[i]);
		}
	}
	for(var i = 0; i < a.length;i++){
		setFreq(a[i],count(a,a[i]));
	}}
}
function setMids(){
	for(var i = 0;i < groups.length;i++){
		gr = groups[i];
		setFreqX(gr.join(' '),countC(a,gr[0],gr[1]));
		setCm(gr.join(' '));
	}
}
function refreshOut(){
	g('output').innerHTML = '';
}
function print(x,col){
	var c = col || 'white';
	g('output').innerHTML += '<span style="color:'+c+';">'+ x+'</span><br>';
}
function clearTable(){
	g('displayData').innerHTML = '';
}
function iClearTable(){
	g('displayIntervals').innerHTML = '';
}
function table(x){
	texty = g('displayData').innerHTML;
	texty += '<tr id="data'+x+'">';
	texty += '<td>'+x+'</td><td><input size=8 onchange="updateTables();" /></td><td class="del" onclick="remove('+x+');">X</td>';
	texty += '</tr>';
	g('displayData').innerHTML = texty;
}
function itable(l,u){
	fn = 'iremove(\''+l+' '+u+'\');';
	setter = 'setCm(\''+l + ' '+u+'\');'
	var texty = g('displayIntervals').innerHTML;
	texty += '<tr id="Inter'+l+' '+u+'">';
	texty += '<td>'+l+' '+fSign()+' x '+sSign()+' '+u+'</td><td><input size=8/ onchange="'+setter+'"></td><td class="cm"></td><td class="freqprod"></td><td class=\'del\' onclick="'+fn+'">X</td>';
	texty += '</tr>';
	g('displayIntervals').innerHTML = texty;
	setTimeout(function(){setCm(l+" "+ u);},1)
}
function countC(a,l,u){
	var count = 0;
	for(var i = 0;i<a.length;i++){
		var x = a[i];
		if(eval(eqGen(l+' '+fSign()+' x '+sSign()+ ' '+u) ))count++;
	}
	return count
}
function count(a,b){
	var count = 0;
	for(var i = 0;i<a.length;i++){
		if(a[i] == b)count++;
	}
	return count
}
function setCm(n){
	lower = parseFloat(n.split(' ')[0]);
	upper = parseFloat(n.split(' ')[1]);
	if(dataType() == 'discrete'){
		if(fSign() == '&lt;' || fSign() == '<') lower = Math.floor(parseFloat(lower)) + 1;
		if(sSign() == '&lt;' || sSign() == '<') upper =Math.ceil(parseFloat(upper)) - 1;
	}
	g('Inter'+n).getElementsByClassName('cm')[0].innerHTML = (upper + lower)/2;
	g('Inter'+n).getElementsByClassName('freqprod')[0].innerHTML = parseFloat(freqOfX(n))* (upper+lower)/2;
}
function freqOf(n){
	return parseFloat(g('data'+n).getElementsByTagName('input')[0].value);
}
function setFreq(n,val){
	g('data'+n).getElementsByTagName('input')[0].value = val;
}
function freqOfX(n){
	return parseFloat(g('Inter'+n).getElementsByTagName('input')[0].value);
}
function setFreqX(n,val){
	g('Inter'+n).getElementsByTagName('input')[0].value = val;
}
function iremove(n){
	iClearTable();
	g('displayIntervals').innerHTML += '<tr><td>Interval</td><td>Frequency</td><td>Class Midpoint</td><td>Frequency x Class Midpoint<td>Delete Interval</td></tr>';
	var newg = [];
	for(var i = 0;i<groups.length;i++){
		if(groups[i].join(' ') != n) newg.push(groups[i]);
	}
	groups = newg;
	seen = [];
	for(var i = 0; i < groups.length;i++){
		if(count(seen,groups[i]) == 0){
			itable(groups[i][0],groups[i][1]);
			seen.push(groups[i]);
		}
	}
	for(var i = 0; i < groups.length;i++){
		setFreqX(groups[i].join(' '),countC(a,groups[i][0],groups[i][1]));
	}
}
function remove(n){
	clearTable();
	g('displayData').innerHTML += '<tr><td>Item</td><td>Frequency</td><td>Delete Item</td></tr>';
	var newa = [];
	for(var i = 0;i<a.length;i++){
		if(a[i] != n) newa.push(a[i]);
	}
	a = newa;
	seen = [];
	for(var i = 0; i < a.length;i++){
		if(count(seen,a[i]) == 0){
			table(a[i]);
			seen.push(a[i]);
		}
	}
	for(var i = 0; i < a.length;i++){
		setFreq(a[i],count(a,a[i]));
	}
}
function updateData(){
	refreshOut();
	var newa = [];
	var table = g('displayData');
	rows = table.getElementsByTagName('tr');
	for(var row = 1;row < rows.length;row++){
		var cd = rows[row].getElementsByTagName('td')[0].innerHTML;
		if(cd == 'Item')continue;
		for(var c = 0;c < freqOf(cd);c++)newa.push(parseInt(cd));
	}
	a = newa;
	sum = 0;
	for(var x = 0;x<a.length;x++)sum += parseInt(a[x]);
	print('Sorted in ascending order: ','blue');
	print(a,'blue');
	print('Mean: '+sum+' / '+ a.length+' = '+mean(a),'green');
	print('Range: '+ range(a),'red');
	print('Median: '+p(a,50),'yellow');
	print('Lower-Quartile: '+p(a,25),'yellow');
	print('Upper-Quartile: '+p(a,75),'yellow');
	print('Inter-Quartile-Range: '+ p(a,75)+' - '+p(a,25)+' = '+ (p(a,75)-p(a,25)),'orange' );
	print('Semi-Inter-Quartile-Range: '+ (p(a,75)-p(a,25))+'/2 = '+(p(a,75)-p(a,25))/2,'orange' ) 
	print('Mode: '+ mode(a), 'violet' );
}
function extract(n){
	var ar = n.split(' ');
	var s = [ar[0],ar[4]];
	return s.join(' ');
}
function dataType(){
	if(document.getElementsByName('dt')[0].checked)return 'continuous';
	return 'discrete';
}
function groupUpdate(){
	refreshOut();
	var newa = [];
	var table = g('displayIntervals');
	var gs = table.getElementsByTagName('tr');
	var grops = [];
	for(var i = 0;i<gs.length-1;i++)grops.push(gs[i+1].getElementsByTagName('td')[0].innerHTML);
	for(gro = 0;gro < grops.length;gro++){
		classd = extract(grops[gro]);
		freq = freqOfX(classd);
		for(var i = 0;i < parseInt(freq);i++)newa.push(cmOf(classd));
	}
	var a = newa;
	sum = 0;
	for(var x = 0;x<a.length;x++)sum += parseInt(a[x]);
	print('Mean: '+sum+' / '+ a.length+' = '+mean(a) +' ( ' + classOf(mean(a))+' )','green');
	print('Range: '+ range(a),'red');
	print('Median: '+p(a,50) + ' ( '+classOf(p(a,50) )+' )','yellow');
	print('Lower-Quartile: '+p(a,25) + ' ( '+classOf(p(a,25)) + ' )','yellow');
	print('Upper-Quartile: '+p(a,75) + ' ( '+classOf(p(a,75)) + ' )','yellow');
	print('Inter-Quartile-Range: '+ p(a,75)+' - '+p(a,25)+' = '+ (p(a,75)-p(a,25)) + ' ( '+classOf((p(a,75)-p(a,25)) ) +' )','orange' );
	print('Semi-Inter-Quartile-Range: '+ (p(a,75)-p(a,25))+'/2 = '+(p(a,75)-p(a,25))/2 + ' ( '+classOf((p(a,75)-p(a,25))/2 ) + ' )','orange' ) 
	print('Modal Class: '+ gMode(grops), 'violet' );
}
function cmOf(n){
	return parseFloat(g('Inter'+n).getElementsByClassName('cm')[0].innerHTML );
}
function fSign(){
	return g('firstS').value;
}
function sSign(){
	return g('secondS').value;
}
function eqGen(str){
	console.log(str);
	var sa = str.split(' ');
	var lower = sa[0];
	var upper = sa[4];
	s = '';
	if(dataType() == 'discrete'){
	if(fSign() == '&lt;' || fSign() == '<') lower = Math.floor(parseFloat(lower)) + 1;
	if(sSign() == '&lt;' || sSign() == '<') upper = Math.ceil(parseFloat(upper)) - 1;
	}
	s += lower;
	if(dataType() == 'discrete' ) s+= '<=';
	else{
	if(fSign() == "&lt;" || fSign() == '<')s += ' < ';
	else s += ' <= ';
	}
	s += sa[2]+' && '+sa[2];
	if(dataType() == 'discrete'){
		s += '<=';
	}
	else{
	if(sSign() == "&lt;"  || sSign() == '<')s += ' < ';
	else s += ' <= ';}
	s += upper;
	console.log(' It becomes '+s);
	return s;
}
function classOf(x){
	var table = g('displayIntervals');
	var gs = table.getElementsByTagName('tr');
	var grops = [];
	for(var i = 0;i<gs.length-1;i++)grops.push(gs[i+1].getElementsByTagName('td')[0].innerHTML);
	for(var i = 0; i < grops.length;i++){
		if(eval(eqGen(grops[i])))return grops[i];
	}
}
function mean(d){
	sum = 0;
	for(var x = 0;x<d.length;x++)sum += parseInt(d[x]);
	return sum/d.length;
}
function p(d,percent){
	var pos = parseFloat(percent)*(1+d.length)/100 - 1;
	return parseFloat(d[Math.floor(pos)] + (pos - Math.floor(pos))*(d[Math.ceil(pos)] - d[Math.floor(pos)]));
}
function range(d){
	return d[d.length-1] +'-'+ d[0] + ' = '+ (parseInt(d[d.length-1]) - parseInt(d[0]));
}
function gMode(d){
	var max = 0;
	var modes = [];
	for(var i = 0;i<d.length;i++){
		if(freqOfX(extract(d[i])) > max){
			max = freqOfX(extract(d[i]));
		}
	}
	for(var i = 0;i<d.length;i++){
		if(freqOfX(extract(d[i])) == max){
			modes.push(d[i])
	}}
	return modes.join(' and ');
}
function mode(d){
	var max = 0;
	var modes = [];
	var m = 0;
	for(var i = 0;i<d.length;i++)if(count(d,parseFloat(d[i])) > max){
		max = count(d,parseFloat(d[i]));
		m = d[i];
	}
	for(var n = 0;n<d.length;n++)if(count(d,parseFloat(d[n])) == max && count(modes,parseFloat(d[n])) == 0)modes.push(d[n]);
	s = modes.join(' and ')
	return s;
}
function compareNumbers(a, b)
{
    return a - b;

}
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}