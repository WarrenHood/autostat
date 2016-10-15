window.onload = function(){
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
																print('P<sub>'+pr+'</sub>: '+p(a,parseInt(pr)));
																		}
}
function g(x){
	return document.getElementById(x);
}
function handleData(){
	clearTable();
	iClearTable();
	g('displayData').innerHTML += '<tr><td>Item</td><td>Frequency</td><td>Delete Item</td></tr>';
	g('displayIntervals').innerHTML += '<tr><td>Interval</td><td>Frequency</td><td>Class Midpoint</td><td>Frequency x Class Midpoint<td>Delete Interval</td></tr>';
	a = g('ui').value.split(' ');
	var intervals = g('intervals').value.replace(/\r\n/g, "\n").split("\n");
	groups = [];
	for(var i = 0;i<intervals.length;i++)groups.push(intervals[i].split(' ') );
	for(gr = 0;gr<groups.length;gr++){
		itable(groups[gr][0],groups[gr][1]);
	}
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
	}
	for(var i = 0;i < groups.length;i++){
		gr = groups[i]
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
	texty += '<td>'+x+'</td><td><input size=8/></td><td class="del" onclick="remove('+x+');">X</td>';
	texty += '</tr>';
	g('displayData').innerHTML = texty;
}
function itable(l,u){
	fn = 'iremove(\''+l+' '+u+'\');';
	setter = 'setCm(\''+l + ' '+u+'\');'
	var texty = g('displayIntervals').innerHTML;
	texty += '<tr id="Inter'+l+' '+u+'">';
	texty += '<td>'+l+' &lt; x &le; '+u+'</td><td><input size=8/ onchange="'+setter+'"></td><td class="cm"></td><td class="freqprod"></td><td class=\'del\' onclick="'+fn+'">X</td>';
	texty += '</tr>';
	g('displayIntervals').innerHTML = texty;
	setTimeout(function(){setCm(l+" "+ u);},1)
}
function countC(a,l,u){
	var count = 0;
	for(var i = 0;i<a.length;i++){
		if(parseFloat(a[i]) > parseFloat(l) && parseFloat(a[i]) <= parseFloat(u))count++;
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
	g('Inter'+n).getElementsByClassName('cm')[0].innerHTML = (parseFloat(n.split(' ')[0])+parseFloat(n.split(' ')[1]))/2;
	g('Inter'+n).getElementsByClassName('freqprod')[0].innerHTML = parseFloat(freqOfX(n))* (parseFloat(n.split(' ')[0])+parseFloat(n.split(' ')[1]))/2;
}
function freqOf(n){
	return g('data'+n).getElementsByTagName('input')[0].value;
}
function setFreq(n,val){
	g('data'+n).getElementsByTagName('input')[0].value = val;
}
function freqOfX(n){
	return g('Inter'+n).getElementsByTagName('input')[0].value;
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
	print('Sorted in ascending order: ','blue');
	print(a,'blue');
	print('Mean: '+mean(a),'green');
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
	print('Mean: '+mean(a),'green');
	print('Range: '+ range(a),'red');
	print('Median: '+p(a,50),'yellow');
	print('Lower-Quartile: '+p(a,25),'yellow');
	print('Upper-Quartile: '+p(a,75),'yellow');
	print('Inter-Quartile-Range: '+ p(a,75)+' - '+p(a,25)+' = '+ (p(a,75)-p(a,25)),'orange' );
	print('Semi-Inter-Quartile-Range: '+ (p(a,75)-p(a,25))+'/2 = '+(p(a,75)-p(a,25))/2,'orange' ) 
	print('Modal Class: '+ gMode(grops), 'violet' );
}
function cmOf(n){
	return parseFloat(g('Inter'+n).getElementsByClassName('cm')[0].innerHTML );
}
function mean(d){
	sum = 0;
	for(var x = 0;x<d.length;x++)sum += parseInt(d[x]);
	return ''+sum+' / ' + d.length + ' = ' + sum/d.length;
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